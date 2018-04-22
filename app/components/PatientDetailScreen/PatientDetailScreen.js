import React from 'react';
import {PatientDetailCard} from '../PatientDetailCard';

const PatientDetailScreen = (props) => {
    const {patientDetail, onPressAddVisit, onPressAddNotes} = props;
    return (
        <PatientDetailCard
            patientDetail={patientDetail}
            onPressAddVisit={onPressAddVisit}
            onPressAddNotes={onPressAddNotes}
        />
    );
};

export {PatientDetailScreen};
