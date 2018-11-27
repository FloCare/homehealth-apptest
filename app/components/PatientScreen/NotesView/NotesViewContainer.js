import moment from 'moment';
import React, {Component} from 'react';
import {View, SectionList, KeyboardAvoidingView, Platform} from 'react-native';
import {NoteDataService} from '../../../data_services/NotesDataService';
import {PatientDataService} from '../../../data_services/PatientDataService';
import {NoteBubble} from './NoteBubble';
import StyledText from '../../common/StyledText';
import {NoteTextBox} from './NoteTextBox';

export class NotesViewContainer extends Component {
    constructor(props) {
        super(props);
        console.log(`patientID mila ${props.patientID}`);
        const patient = PatientDataService.getInstance().getPatientByID(props.patientID);

        this.episode = patient.episodes[0];
        this.notes = NoteDataService.getInstance().getNotesForEpisodeID(this.episode.episodeID);
        this.state = {sectionedData: this.getSectionedDataForNotes(this.notes)};

        this.notesChangeListener = notesResult => {
            this.setState({sectionedData: this.getSectionedDataForNotes(notesResult)});
        };

        this.platformBasedView = Platform.select({
            android: View,
            ios: KeyboardAvoidingView
        });

        this.sectionList = React.createRef();
    }

    componentDidMount() {
        this.notes.addListener(this.notesChangeListener);
        this.scrollToBottom(false);
    }

    componentWillUnmount() {
        if (this.notesChangeListener) {
            this.notes.removeListener(this.notesChangeListener);
        }
    }

    componentDidUpdate() {
        console.log('result changed');
        if (this.sectionList && this.sectionList.scrollToLocation) {
            console.log('attempt scroll');
            this.scrollToBottom(true);
            this.sectionList.flashScrollIndicators();
        }
    }

    scrollToBottom(animated) {
        if (this.state.sectionedData.length > 0) {
            this.sectionList.scrollToLocation({
                animated,
                sectionIndex: this.state.sectionedData.length - 1,
                itemIndex: this.state.sectionedData[this.state.sectionedData.length - 1].data.length - 1,
                viewPosition: 1
            });
        }
    }

    getSectionedDataForNotes(notesResult) {
        const sectionedList = [];
        if (notesResult.length === 0) { return sectionedList; }
        const firstMessageDate = notesResult[0].timetoken;
        const lastMessageDate = notesResult[notesResult.length - 1].timetoken;

        const dayCounter = moment(firstMessageDate);
        while (dayCounter.valueOf() <= moment(lastMessageDate).valueOf()) {
            const notesForDay = notesResult.filtered('timetoken >= $0 AND timetoken < $1', dayCounter.toDate(), moment(dayCounter).add(1, 'days').toDate());
            if (notesForDay.length !== 0) { sectionedList.push({title: dayCounter.format('MMM Do'), data: notesForDay}); }
            dayCounter.add(1, 'days');
        }
        return sectionedList;
    }

    render() {
        const PlatformBasedView = this.platformBasedView;

        return (
            <PlatformBasedView
                style={{flex: 1}}
                behavior={'padding'}
                keyboardVerticalOffset={64}
            >
                <SectionList
                    ref={ref => (this.sectionList = ref)}
                    renderItem={({item}) => NoteBubble(item)}
                    onScrollToIndexFailed={() => {}}
                    renderSectionHeader={({section: {title}}) => (
                        <View
                            style={{
                                borderBottomWidth: 1.5,
                                borderColor: '#f6f6f6',
                                paddingVertical: 7,
                                paddingLeft: 10,
                                backgroundColor: 'white',
                            }}
                        >
                            <StyledText
                                style={{
                                    fontSize: 12,
                                    color: '#181818',
                                    fontWeight: 'bold',
                                }}
                            >
                                {title}
                            </StyledText>
                        </View>
                    )}
                    sections={this.state.sectionedData}
                />
                <NoteTextBox
                    onSubmit={message => {
                        NoteDataService.getInstance().generateAndPublishNote(message, this.episode);
                    }}
                />
            </PlatformBasedView>
        );
    }
}
