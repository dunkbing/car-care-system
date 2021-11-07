import React, { useCallback, useEffect } from 'react';
import { NativeBaseProvider, Box, HStack, Text, ScrollView, Image, Spinner } from 'native-base';
import AvatarStaff from '@assets/images/avatar-staff.png';
import { RefreshControl, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import SearchBar from '@components/SearchBar';
import { observer } from 'mobx-react';
import StaffStore from '@mobx/stores/staff';
import Container from 'typedi';
import { StaffModel } from '@models/staff';
import { STORE_STATUS } from '@utils/constants';
import { rootNavigation } from '@screens/Navigation';
import { withProgress } from '@mobx/services/config';
import RescueStore from '@mobx/stores/rescue';
import toast from '@utils/toast';

type StaffViewProps = {
  staff: Pick<StaffModel, 'firstName' | 'lastName' | 'avatarUrl'>;
  onPress: OnPress;
};

const StaffView: React.FC<StaffViewProps> = ({ staff, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack space={2} mt={6} style={{ flexDirection: 'row' }}>
        <Image source={staff.avatarUrl ? { uri: staff.avatarUrl } : AvatarStaff} alt='img' size={'sm'} mr={1} />
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
  const rescueStore = Container.get(RescueStore);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      if (route.params?.rescueId) {
        void staffStore.find({ isAvailable: true });
      } else {
        void staffStore.find();
      }
    });
  }, [navigation, route.params?.rescueId, staffStore]);

  const onPress = (staff: StaffModel) => {
    return async () => {
      if (!route.params?.rescueId) {
        navigation.navigate('EditStaff', { staff });
      } else {
        await withProgress(rescueStore.assignStaff({ staffId: staff.id, rescueDetailId: route.params?.rescueId }));
        if (rescueStore.state === STORE_STATUS.ERROR) {
          toast.show(rescueStore.errorMessage);
          return;
        }
        rootNavigation.navigate('GarageHomeTab', { screen: 'PendingRequestHome' });
      }
    };
  };

  const onRefresh = useCallback(() => {
    if (route.params?.rescueId) {
      void staffStore.find({ isAvailable: true });
    } else {
      void staffStore.find();
    }
  }, [route.params?.rescueId, staffStore]);

  return (
    <NativeBaseProvider>
      <ScrollView
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
        }}
        backgroundColor='#fff'
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
      >
        <Box pt={5}>
          <SearchBar
            placeholder='Tìm tên nhân viên'
            timeout={500}
            onSearch={(keyword) => {
              void staffStore.find({ keyword });
            }}
          />
        </Box>
        <Box safeArea flex={1} p={2} w='100%' mx='auto' ml={3}>
          {staffStore.state === STORE_STATUS.LOADING ? (
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
