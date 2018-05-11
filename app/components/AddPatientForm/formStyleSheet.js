import t from 'tcomb-form-native';
import {PrimaryFontFamily} from '../../utils/constants';

var _ = require('lodash');

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.textbox.normal.borderWidth = 0;
stylesheet.textbox.error.borderWidth = 0;

stylesheet.textbox.normal.marginBottom = 0;
stylesheet.textbox.error.marginBottom = 0;

stylesheet.textbox.normal.marginBottom = 5;
stylesheet.textbox.error.marginBottom = 5;

stylesheet.textbox.normal.fontSize = 14;
stylesheet.textbox.error.fontSize = 14;

stylesheet.textbox.normal.fontFamily = PrimaryFontFamily;
stylesheet.textbox.error.fontFamily = PrimaryFontFamily;

stylesheet.textboxView.normal.borderWidth = 0;
stylesheet.textboxView.error.borderWidth = 0;

stylesheet.textboxView.normal.borderRadius = 0;
stylesheet.textboxView.error.borderRadius = 0;

stylesheet.textboxView.normal.borderBottomWidth = 0.5;
stylesheet.textboxView.error.borderBottomWidth = 0.5;

stylesheet.controlLabel.normal.fontSize = 14;
stylesheet.controlLabel.error.fontSize = 14;

stylesheet.controlLabel.normal.fontFamily = PrimaryFontFamily;
stylesheet.controlLabel.error.fontFamily = PrimaryFontFamily;

stylesheet.controlLabel.normal.fontWeight = 'normal';
stylesheet.controlLabel.error.fontWeight = 'normal';

stylesheet.controlLabel.normal.color = '#525252';
stylesheet.controlLabel.error.color = '#525252';

stylesheet.errorBlock.fontSize = 12;
stylesheet.errorBlock.color = '#d50000';
stylesheet.errorBlock.fontFamily = PrimaryFontFamily;

export default stylesheet;
