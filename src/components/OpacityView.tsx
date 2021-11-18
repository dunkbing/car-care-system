import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';

const OpacityView = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(147, 148, 153, 0.5);
  z-index: 1;
`;

export default OpacityView;
