import React from 'react';
import {WebView} from 'react-native';

function LegalScreen() {
    return (
        <WebView
            source={{uri: 'https://www.flocare.health/privacy.html'}}
            style={{marginTop: 20}}
        />
    );
}

export {LegalScreen};
