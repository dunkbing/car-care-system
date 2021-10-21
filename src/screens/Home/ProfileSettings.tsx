import { Button, Center, Text, View, VStack } from 'native-base';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import MatCommuIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import { rootNavigation } from '@screens/Navigation/roots';
import { ProfileStackParams } from '@screens/Navigation/params';

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
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
        }}
      >
        {icon}
        <Text bold style={{ flex: 1, marginLeft: 10, marginBottom: 15, marginTop: 15 }} onPress={onPress}>
          {text}
        </Text>
        <Text bold style={{ color: '#4c85e0', marginBottom: 15, marginTop: 15, alignSelf: 'flex-end', textAlign: 'right' }}>
          {'>'}
        </Text>
      </View>
    </View>
  );
};

type Props = NativeStackScreenProps<ProfileStackParams, 'ProfileOverview'>;

const ProfileSettings: React.FC<Props> = () => {
  return (
    <SafeAreaView>
      <ScrollView style={{ margin: 20 }}>
        <VStack mt='10'>
          <OptionItem
            text='Thông tin cá nhân'
            onPress={() =>
              rootNavigation.navigate('Profile', {
                screen: 'ProfileInfo',
              })
            }
            icon={<MatCommuIcon name='account' style={{ alignSelf: 'center' }} size={24} color='#4c85e0' />}
          />
          <OptionItem
            text='Thông tin xe'
            onPress={() =>
              rootNavigation.navigate('Profile', {
                screen: 'CarInfo',
              })
            }
            icon={<AntIcon name='car' style={{ alignSelf: 'center' }} size={24} color='#4c85e0' />}
          />
          <OptionItem
            text='Garage yêu thích'
            onPress={() => {
              rootNavigation.navigate('Profile', {
                screen: 'DefaultGarage',
              });
            }}
            icon={<MatCommuIcon name='garage' style={{ alignSelf: 'center' }} size={24} color='#4c85e0' />}
          />
          <OptionItem
            text='Lịch sử cứu hộ'
            onPress={() => rootNavigation.navigate('Profile', { screen: 'RescueHistory' })}
            icon={<FaIcon name='history' style={{ alignSelf: 'center' }} size={24} color='#4c85e0' />}
          />
          <OptionItem
            text='Đổi mật khẩu'
            onPress={() => rootNavigation.navigate('Profile', { screen: 'ChangePassword' })}
            icon={<AntIcon name='lock' style={{ alignSelf: 'center' }} size={24} color='#4c85e0' />}
          />
        </VStack>
        <Center mt='50px'>
          <Button onPress={() => rootNavigation.navigate('Auth', { screen: 'ChooseMethod' })}>Đăng xuất</Button>
        </Center>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSettings;
