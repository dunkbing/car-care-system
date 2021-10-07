import React from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import styles from './styles';
import { StackParamList } from '../common';
import { Avatar } from 'native-base';

type Props = StackScreenProps<StackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Avatar source={{ uri: 'https://pbs.twimg.com/profile_images/1188747996843761665/8CiUdKZW_400x400.jpg' }} />

      <View style={styles.inputView}>
        <TextInput placeholder='Email.' placeholderTextColor='#003f5c' />
      </View>

      <View style={styles.inputView}>
        <TextInput placeholder='Password.' placeholderTextColor='#003f5c' secureTextEntry={true} />
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.loginText}>REGISTER</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
