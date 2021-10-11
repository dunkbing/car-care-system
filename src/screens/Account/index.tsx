import { Avatar, Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';

const OptionLabel: React.FC<{ text: string }> = ({ text }) => {
  return (
    <View>
      <Text
        style={{
          marginBottom: 5,
          marginTop: 5,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

const OptionItem: React.FC<{ text: string }> = ({ text }) => {
  return (
    <View
      style={{
        marginLeft: 10,
        marginRight: 10,
        borderBottomColor: 'rgba(0, 0, 0, .2)',
        borderBottomWidth: 1,
      }}
    >
      <TouchableOpacity>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}
        >
          <Text style={{ flex: 1, marginBottom: 15, marginTop: 15 }}>{text}</Text>
          <Text style={{ marginBottom: 15, marginTop: 15, alignSelf: 'flex-end', textAlign: 'right' }}>{'>'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const AccountScreen: React.FC = () => {
  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View style={styles.avatar}>
          <Avatar source={{ uri: 'https://pbs.twimg.com/profile_images/1188747996843761665/8CiUdKZW_400x400.jpg' }} />
          <View style={styles.profileText}>
            <Text>username</Text>
            <Text>View profile</Text>
          </View>
        </View>
        <View style={styles.option}>
          <View>
            <OptionItem text='Thông tin cá nhân' />
            <OptionItem text='Thông tin xe' />
            <OptionItem text='Garage yêu thích' />
            <OptionItem text='Lịch sử cứu hộ' />
            <OptionItem text='Đổi mật khẩu' />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;
