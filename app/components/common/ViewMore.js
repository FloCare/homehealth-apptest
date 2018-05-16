import React from 'react';
import {View, Text} from 'react-native';

// Todo: Improve this component; handle corner cases; add default props
const renderFooter = (renderViewMore) => (
	renderViewMore()
);

const ViewMore = (props) => {
	return (
		<View>
			<Text
				style={props.textStyle}
				numberOfLines={props.numberOfLines}
			>
				{props.children}
			</Text>
			{renderFooter(props.renderViewMore)}
			{props.numberOfLines &&
				<View style={{width: 1, height: 1}} />
			}
		</View>
	);
};

export default ViewMore;
