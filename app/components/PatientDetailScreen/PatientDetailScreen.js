import React from 'react';
import {PatientDetailCard} from '../PatientDetailCard';

const PatientDetailScreen = (props) => {
    const {patientDetail, onPressAddVisit, onPressAddNotes, onWeekChanged,
        currentWeekVisitData, selectedVisitsDate, visitSectionData,
        onChangeVisitsDate, showCallout, setMarkerRef} = props;
    return (
        <PatientDetailCard
            patientDetail={patientDetail}
            onPressAddVisit={onPressAddVisit}
            onWeekChanged={onWeekChanged}
            selectedVisitsDate={selectedVisitsDate}
            visitSectionData={visitSectionData}
            onChangeVisitsDate={onChangeVisitsDate}
            currentWeekVisitData={currentWeekVisitData}
            onPressAddNotes={onPressAddNotes}
            showCallout={showCallout}
            setMarkerRef={setMarkerRef}
        />
    );
};

export {PatientDetailScreen};
