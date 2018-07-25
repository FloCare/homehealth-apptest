import React from 'react';
import {PatientDetailCard} from '../PatientDetailCard';

const PatientDetailScreen = (props) => {
    const {patientDetail, onPressAddVisit, onPressAddNotes, onWeekChanged,
        currentWeekVisitData, selectedVisitsDate, visitSectionData,
        onSelectVisitsDate, showCallout, setMarkerRef} = props;
    return (
        <PatientDetailCard
            patientDetail={patientDetail}
            onPressAddVisit={onPressAddVisit}
            onWeekChanged={onWeekChanged}
            selectedVisitsDate={selectedVisitsDate}
            visitSectionData={visitSectionData}
            onSelectVisitsDate={onSelectVisitsDate}
            currentWeekVisitData={currentWeekVisitData}
            onPressAddNotes={onPressAddNotes}
            showCallout={showCallout}
            setMarkerRef={setMarkerRef}
        />
    );
};

export {PatientDetailScreen};
