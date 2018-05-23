import React from 'react';
import {WebView} from 'react-native';

function LegalScreen() {
    return (
        <WebView
            source={{uri: 'https://flocare.health/legal'}}
            style={{marginTop: 20}}
        />
    );
}

export {LegalScreen};
