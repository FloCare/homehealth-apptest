import React, {Component} from 'react';
import { TextInput, View, Text } from 'react-native';

export default class Input extends Component {
    constructor(props) {
        super(props)
        this.state = {isValid: false, editing: false}
        this.errorText = "Please enter a valid " + this.props.label
    }

    isValid() {
        if(this.state.isValid) {
            switch (this.props.type) {
                case 'phone':
                    if(this.props.value.length > 10)
                        return false
                    break;
                case 'email':
                    if(this.props.value.length > 10)
                        return false
                    break;
                case 'zipcode':
                    if(this.props.value.length > 10)
                        return false
                    break;
            }
        }
        return true
    }

    render() {
        const { inputStyle, labelStyle, containerStyle, errorStyle } = styles;
        const { label, downMargin } = this.props
        return (
            <View style={[containerStyle, downMargin ? {marginBottom: downMargin} : {}]}>
                <Text style={labelStyle}>{label}</Text>
                <TextInput
                    {...this.props}
                    style={[inputStyle,this.state.editing ? {borderColor: '#34da92'}: {}]}
                    autoCorrect={false}
                    onFocus={() => this.setState({editing: true})}
                    onBlur={() => this.setState({isValid: true, editing: false})}
                />
                {!this.isValid() ? <Text style={errorStyle}>{this.errorText}</Text> : null}
            </View>
        );
    }

};

const styles = {
	inputStyle: {
		color: '#000',
		paddingRight: 5,
		fontSize: 18,
		lineHeight: 24,
		flex: 2,
        borderBottomWidth: 1,
        borderColor: '#ddd',
	},
    errorStyle: {
		color: '#d50000',
		padding: 5,
		fontSize: 12,
	},
	labelStyle: {
		fontSize: 14,
        color: "#525252",
        paddingBottom: 4,
		flex: 1
	},
	containerStyle: {
		flex: 1,
        margin: 4,
        marginBottom: 20,
		flexDirection: 'column',
	}
};

export { Input };
