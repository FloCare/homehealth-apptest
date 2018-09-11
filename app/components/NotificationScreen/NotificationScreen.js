import React, {Component} from 'react';

export class NotificationScreen extends Component {
    constructor(props) {
        super(props);
        props.navigator.setTabBadge({
            badge: 17, // badge value, null to remove badge
            badgeColor: '#006400', // (optional) if missing, the badge will use the default color
        });
    }

    render() {
        return null;
    }
}
