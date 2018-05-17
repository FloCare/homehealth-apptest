import React from 'react';
import {I18nManager, Animated, Easing, StyleSheet, PixelRatio} from 'react-native';

const OPEN_ANIM_DURATION = 225;
const CLOSE_ANIM_DURATION = 195;

const axisPosition = (oDim, wDim, tPos, tDim) => {
  // if options are bigger than window dimension, then render at 0
  if (oDim > wDim) {
    return 0;
  }
  // render at trigger position if possible
  if (tPos + oDim <= wDim) {
    return tPos;
  }
  // aligned to the trigger from the bottom (right)
  if (tPos + tDim - oDim >= 0) {
    return tPos + tDim - oDim;
  }
  // compute center position
  let pos = Math.round(tPos + (tDim / 2) - (oDim / 2));
  // check top boundary
  if (pos < 0) {
    return 0;
  }
  // check bottom boundary
  if (pos + oDim > wDim) {
    return wDim - oDim;
  }
  // if everything ok, render in center position
  return pos;
};

const computePosition = ({windowLayout, triggerLayout, optionsLayout}, isRTL) => {
  const {x: wX, y: wY, width: wWidth, height: wHeight} = windowLayout;
  const {x: tX, y: tY, height: tHeight, width: tWidth} = triggerLayout;
  const {height: oHeight, width: oWidth} = optionsLayout;
  const top = axisPosition(oHeight, wHeight, tY - wY, tHeight);
  const left = axisPosition(oWidth, wWidth, tX - wX, tWidth);
  const start = isRTL ? 'right' : 'left';
  return {top, [start]: left};
};

class CustomMenuRenderer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scaleAnim: new Animated.Value(0.1),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.scaleAnim, {
      duration: OPEN_ANIM_DURATION,
      toValue: 1,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }

  close() {
    return new Promise(resolve => {
      Animated.timing(this.state.scaleAnim, {
        duration: CLOSE_ANIM_DURATION,
        toValue: 0,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true
      }).start(resolve);
    });
  }

  render() {
    const {style, children, layouts, ...other} = this.props;
    const animation = {
      transform: [{scale: this.state.scaleAnim}],
      opacity: this.state.scaleAnim,
    };
    const position = computePosition(layouts, I18nManager.isRTL);
    return (
      <Animated.View {...other} style={[styles.options, style, animation, position]}>
        {children}
      </Animated.View>
    );
  }

}

CustomMenuRenderer.computePosition = computePosition;

const styles = StyleSheet.create({
  options: {
    position: 'absolute',
    borderRadius: 2,
    backgroundColor: 'white',
    width: PixelRatio.roundToNearestPixel(120),

    // Shadow only works on iOS.
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: {width: 3, height: 3},
    shadowRadius: 4,

    // This will elevate the view on Android, causing shadow to be drawn.
    elevation: 5,
  },
});

export default CustomMenuRenderer;
