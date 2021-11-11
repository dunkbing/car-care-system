import React, { useEffect } from 'react';
import { Box, Center, HStack, Image, Text, VStack } from 'native-base';
import { Customer, Employees, ListImg, RequestImg, ScrewDriverWrench } from '@assets/images';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import { headerColor } from '@screens/shared/colors';
import { observer } from 'mobx-react';
import Container from 'typedi';
import AuthStore from '@mobx/stores/auth';
import { ACCOUNT_TYPES, RESCUE_STATUS, STORE_STATUS } from '@utils/constants';
import { TouchableOpacity } from 'react-native';
import GarageStore from '@mobx/stores/garage';
import { rootNavigation } from '@screens/Navigation/roots';
import RescueStore from '@mobx/stores/rescue';
import toast from '@utils/toast';

const OptionItem = ({ name, imgSrc, onPress }: { name: string; imgSrc: any; onPress?: () => void }) => {
  return (
    <Box rounded='md' shadow={'4'} backgroundColor='#206DB6' w='40%' pt='1' pb='1'>
      <TouchableOpacity onPress={onPress}>
        <Center>
          <Image source={imgSrc} alt='screw-driver-and-wrench' size='sm' tintColor='white' />
          <Text pt='1' fontSize='16' bold color='white'>
            {name}
          </Text>
        </Center>
      </TouchableOpacity>
    </Box>
  );
};

const ManagerOption: React.FC = () => {
  //#region stores
  const garageStore = Container.get(GarageStore);
  const rescueStore = Container.get(RescueStore);
  //#endregion

  return (
    <VStack pt='3'>
      <Center>
        <HStack space={6}>
          <OptionItem
            name='Garage của tôi'
            imgSrc={ScrewDriverWrench}
            onPress={() => {
              rootNavigation.navigate('GarageHomeOptions', { screen: 'MyGarage', params: { garage: garageStore.garage } });
            }}
          />
          <OptionItem
            name='Yêu cầu cứu hộ'
            imgSrc={RequestImg}
            onPress={async () => {
              await rescueStore.getCurrentProcessingStaff();

              if ((rescueStore.currentStaffProcessingRescue?.status as number) >= RESCUE_STATUS.ARRIVING) {
                rootNavigation.navigate('GarageHomeOptions', {
                  screen: 'Map',
                  params: { request: rescueStore.currentStaffProcessingRescue },
                });
              } else {
                rootNavigation.navigate('GarageHomeOptions', {
                  screen: 'DetailAssignedRequest',
                  params: { request: rescueStore.currentStaffProcessingRescue, checking: true },
                });
              }
            }}
          />
        </HStack>
        <HStack space={6} mt='6'>
          <OptionItem
            name='Quản lý khách hàng'
            imgSrc={Customer}
            onPress={() => {
              rootNavigation.navigate('GarageHomeOptions', { screen: 'ManageCustomers' });
            }}
          />
          <OptionItem
            name='Quản lý nhân viên'
            imgSrc={Employees}
            onPress={() => {
              rootNavigation.navigate('GarageHomeOptions', { screen: 'ManageStaffs' });
            }}
          />
        </HStack>
        <HStack space={6} mt='6'>
          <OptionItem
            name='Lịch sử cứu hộ'
            imgSrc={ListImg}
            onPress={() => {
              rootNavigation.navigate('GarageHomeOptions', { screen: 'RescueHistory' });
            }}
          />
          <Box w='40%' pt='1' pb='1' />
        </HStack>
      </Center>
    </VStack>
  );
};

const StaffOption: React.FC = () => {
  const rescueStore = Container.get(RescueStore);

  return (
    <VStack pt='3'>
      <Center>
        <HStack space={6}>
          <OptionItem
            name='Garage của tôi'
            imgSrc={ScrewDriverWrench}
            onPress={() => {
              rootNavigation.navigate('GarageHomeOptions', { screen: 'MyGarage', params: { garage: Container.get(GarageStore).garage } });
            }}
          />
          <OptionItem
            name='Yêu cầu cứu hộ'
            imgSrc={RequestImg}
            onPress={async () => {
              await rescueStore.getCurrentProcessingStaff();

              if (rescueStore.state === STORE_STATUS.ERROR) {
                toast.show(`${rescueStore.errorMessage}`);
                return;
              }

              console.log(rescueStore.currentStaffProcessingRescue);
              if ((rescueStore.currentStaffProcessingRescue?.status as number) >= RESCUE_STATUS.ARRIVING) {
                rootNavigation.navigate('GarageHomeOptions', {
                  screen: 'Map',
                  params: { request: rescueStore.currentStaffProcessingRescue },
                });
              } else {
                rootNavigation.navigate('GarageHomeOptions', {
                  screen: 'DetailAssignedRequest',
                  params: { request: rescueStore.currentStaffProcessingRescue, checking: true },
                });
              }
            }}
          />
        </HStack>
        <HStack space={6} mt='6'>
          <OptionItem
            name='Lịch sử cứu hộ'
            imgSrc={ListImg}
            onPress={() => {
              rootNavigation.navigate('GarageHomeOptions', { screen: 'RescueHistory' });
            }}
          />
          <Box w='40%' pt='1' pb='1' />
        </HStack>
      </Center>
    </VStack>
  );
};

const GarageHome: React.FC = () => {
  const authStore = Container.get(AuthStore);
  const garageStore = Container.get(GarageStore);
  const rescueStore = Container.get(RescueStore);

  //#region hooks
  useEffect(() => {
    void rescueStore.getCurrentProcessingStaff();
  }, [rescueStore]);
  //#endregion

  return (
    <VStack>
      <Center pb='8' pt='8'>
        <Text bold fontSize='2xl' pb='3'>
          {garageStore.garage?.name}
        </Text>
        <HStack width='80%' justifyContent='center' alignItems='center' space={2}>
          <FaIcon name='map-marker' size={24} color={headerColor} />
          <Text fontSize='lg'>{garageStore.garage?.address}</Text>
        </HStack>
      </Center>
      {authStore.userType === ACCOUNT_TYPES.GARAGE_MANAGER ? <ManagerOption /> : <StaffOption />}
    </VStack>
  );
};

export default observer(GarageHome);
