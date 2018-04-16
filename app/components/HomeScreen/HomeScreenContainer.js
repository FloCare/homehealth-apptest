import React, {Component} from 'react';
import {MyRealm, Visit} from '../../utils/data/schema';
import {VisitSummary} from './VisitSummary';

class HomeScreenContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: 0
        };
    }
    render() {
        this.visitResultObject = MyRealm.objects(Visit.schema.name)
                                        .filtered('midnightEpoch==$0', this.state.date)
                                        .filtered('isDone==false');
        return (
            <VisitSummary visitResultObject={this.visitResultObject} />
        );
    }

}

export {HomeScreenContainer};
