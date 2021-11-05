import React, { useEffect } from 'react';
import { NativeBaseProvider, Box, HStack, Text, ScrollView, Image, Spinner } from 'native-base';
import AvatarStaff from '@assets/images/avatar-staff.png';
import { TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import SearchBar from '@components/SearchBar';
import { observer } from 'mobx-react';
import StaffStore from '@mobx/stores/staff';
import Container from 'typedi';
import { StaffModel } from '@models/staff';
import { STORE_STATES } from '@utils/constants';

type StaffViewProps = {
  staff: Pick<StaffModel, 'firstName' | 'lastName' | 'avatarUrl'>;
  onPress: OnPress;
};

const StaffView: React.FC<StaffViewProps> = ({ staff, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack space={2} mt={6} style={{ flexDirection: 'row' }}>
        <Image source={staff.avatarUrl ? { uri: staff.avatarUrl } : AvatarStaff} alt='Alternate Text' size={'sm'} mr={1} />
        <Text ml={7} style={{ textAlignVertical: 'center', fontSize: 20 }}>
          {staff.lastName} {staff.firstName}
        </Text>
      </HStack>
    </TouchableOpacity>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams, 'ManageStaffs'>;

const ManageStaff: React.FC<Props> = ({ navigation, route }) => {
  const staffStore = Container.get(StaffStore);

  useEffect(() => {
    navigation.addListener('focus', () => {
      void staffStore.find();
    });
  }, [navigation, staffStore]);

  const onPress = (staff: StaffModel) => {
    return () => {
      if (!route.params?.rescue) {
        navigation.navigate('EditStaff', { staff });
      } else {
        navigation.pop();
        navigation.navigate('DetailAssignedRequest');
      }
    };
  };

  return (
    <NativeBaseProvider>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
        }}
        backgroundColor='#fff'
      >
        <Box pt={5}>
          <SearchBar placeholder='Tìm tên nhân viên' />
        </Box>
        <Box safeArea flex={1} p={2} w='100%' mx='auto' ml={3}>
          {staffStore.state === STORE_STATES.LOADING ? (
            <Spinner size='lg' />
          ) : (
            staffStore.staffs.map((staff) => <StaffView key={staff.id} staff={staff} onPress={onPress(staff)} />)
          )}
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default observer(ManageStaff);
