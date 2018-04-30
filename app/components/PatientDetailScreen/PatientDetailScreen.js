import React from 'react';
import {PatientDetailCard} from '../PatientDetailCard';

const PatientDetailScreen = (props) => {
    const {patientDetail, visits, onPressAddVisit, onPressAddNotes, showCallout, setMarkerRef} = props;
    return (
        <PatientDetailCard
            patientDetail={patientDetail}
            visits={visits}
            onPressAddVisit={onPressAddVisit}
            onPressAddNotes={onPressAddNotes}
            showCallout={showCallout}
            setMarkerRef={setMarkerRef}
        />
    );
};

export {PatientDetailScreen};
