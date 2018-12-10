import React from 'react';
import {View} from 'react-native';

export function renderDot(color, styles = {}) {
    return (<View style={{height: 1, width: 1, borderColor: color, borderWidth: 1, ...styles}} />);
}
