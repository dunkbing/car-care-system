import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View, VStack } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import MatCommuIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import { rootNavigation } from '@screens/Navigation/roots';
import { ProfileStackParams } from '@screens/Navigation/params';
import GarageStore from '@mobx/stores/garage';
import { observer } from 'mobx-react';

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

type Props = NativeStackScreenProps<ProfileStackParams, 'ProfileOverview'>;

const ProfileSettings: React.FC<Props> = () => {
  const garageStore = useContext(GarageStore);
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
            text='Danh sách xe'
            onPress={() =>
              rootNavigation.navigate('Profile', {
                screen: 'CarInfo',
              })
            }
            icon={<AntIcon name='car' style={{ alignSelf: 'center' }} size={24} color='#4c85e0' />}
          />
          <OptionItem
            text='Garage cứu hộ mặc định'
            onPress={() => {
              if (!garageStore.defaultGarage) {
                rootNavigation.navigate('Profile', {
                  screen: 'SearchGarage',
                });
                return;
              }
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
          <OptionItem
            text='Đăng xuất'
            onPress={() => rootNavigation.navigate('Auth', { screen: 'ChooseMethod' })}
            icon={<AntIcon name='lock' style={{ alignSelf: 'center' }} size={24} color='#4c85e0' />}
          />
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default observer(ProfileSettings);
