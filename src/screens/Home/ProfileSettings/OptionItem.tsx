import React from 'react';
import { Text, View } from 'native-base';
import { TouchableOpacity } from 'react-native';

const OptionItem: React.FC<{ text: string; icon?: JSX.Element; onPress?: () => void }> = ({ text, icon, onPress }) => {
  return (
    <View
      style={{
        marginLeft: 10,
        marginRight: 10,
        borderBottomColor: 'rgba(0, 0, 0, .2)',
        borderBottomWidth: 1,
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}
        >
          {icon}
          <Text bold style={{ flex: 1, marginLeft: 10, marginBottom: 15, marginTop: 15 }}>
            {text}
          </Text>
          <Text bold style={{ color: '#4c85e0', marginBottom: 15, marginTop: 15, alignSelf: 'flex-end', textAlign: 'right' }}>
            {'>'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OptionItem;
