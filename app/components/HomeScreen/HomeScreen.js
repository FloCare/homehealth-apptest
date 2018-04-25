import React from 'react';
import {VisitSummary} from './VisitSummary';

function HomeScreen(props) {
    return (
        //TODO insert other stuff thats got to be on the home screen too
        <VisitSummary
            visitResultObject={props.visitResultObject}
            navigateToVisitListScreen={props.navigateToVisitListScreen}
            navigateToVisitMapScreen={props.navigateToVisitMapScreen}
        />
    );
}

export {HomeScreen};
