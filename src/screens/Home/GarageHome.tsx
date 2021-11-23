import React, { useEffect } from 'react';
import { Box, Center, HStack, Image, Text, VStack } from 'native-base';
import { Customer, Employees, ListImg, RepairSuggestionImg, RequestImg, ScrewDriverWrench } from '@assets/images';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import { headerColor } from '@screens/shared/colors';
import { observer } from 'mobx-react';
import Container from 'typedi';
import AuthStore from '@mobx/stores/auth';
import { ACCOUNT_TYPES, RESCUE_STATUS, STORE_STATUS } from '@utils/constants';
import { TouchableOpacity } from 'react-native';
import GarageStore from '@mobx/stores/garage';
import RescueStore from '@mobx/stores/rescue';
import toast from '@utils/toast';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';

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

const ManagerOption: React.FC<{ navigation: StackNavigationProp<GarageHomeOptionStackParams, 'Home'> }> = ({ navigation }) => {
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
              navigation.navigate('MyGarage', { garage: garageStore.garageDefaultGarage });
            }}
          />
          <OptionItem
            name='Đề xuất sửa chữa'
            imgSrc={RepairSuggestionImg}
            onPress={async () => {
              await rescueStore.getCurrentProcessingStaff();

              if ((rescueStore.currentStaffProcessingRescue?.status as number) >= RESCUE_STATUS.ARRIVING) {
                navigation.navigate('Map', { request: rescueStore.currentStaffProcessingRescue });
              } else {
                navigation.navigate('DetailAssignedRequest', { request: rescueStore.currentStaffProcessingRescue, checking: true });
              }
            }}
          />
        </HStack>
        <HStack space={6} mt='6'>
          <OptionItem
            name='Quản lý khách hàng'
            imgSrc={Customer}
            onPress={() => {
              navigation.navigate('ManageCustomers');
            }}
          />
          <OptionItem
            name='Quản lý nhân viên'
            imgSrc={Employees}
            onPress={() => {
              navigation.navigate('ManageStaffs');
            }}
          />
        </HStack>
        <HStack space={6} mt='6'>
          <OptionItem
            name='Lịch sử cứu hộ'
            imgSrc={ListImg}
            onPress={() => {
              navigation.navigate('RescueHistory');
            }}
          />
          <Box w='40%' pt='1' pb='1' />
        </HStack>
      </Center>
    </VStack>
  );
};

const StaffOption: React.FC<{ navigation: StackNavigationProp<GarageHomeOptionStackParams, 'Home'> }> = ({ navigation }) => {
  const rescueStore = Container.get(RescueStore);
  const garageStore = Container.get(GarageStore);

  return (
    <VStack pt='3'>
      <Center>
        <HStack space={6}>
          <OptionItem
            name='Garage của tôi'
            imgSrc={ScrewDriverWrench}
            onPress={() => {
              navigation.navigate('MyGarage', { garage: garageStore.garageDefaultGarage });
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

              if ((rescueStore.currentStaffProcessingRescue?.status as number) >= RESCUE_STATUS.ARRIVING) {
                navigation.navigate('Map', { request: rescueStore.currentStaffProcessingRescue });
              } else {
                navigation.navigate('DetailAssignedRequest', { request: rescueStore.currentStaffProcessingRescue, checking: true });
              }
            }}
          />
        </HStack>
        <HStack space={6} mt='6'>
          <OptionItem
            name='Lịch sử cứu hộ'
            imgSrc={ListImg}
            onPress={() => {
              navigation.navigate('RescueHistory');
            }}
          />
          <Box w='40%' pt='1' pb='1' />
        </HStack>
      </Center>
    </VStack>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams, 'Home'>;

const GarageHome: React.FC<Props> = ({ navigation }) => {
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
          {garageStore.garageDefaultGarage?.name}
        </Text>
        <HStack width='80%' justifyContent='center' alignItems='center' space={2}>
          <FaIcon name='map-marker' size={24} color={headerColor} />
          <Text fontSize='lg'>{garageStore.garageDefaultGarage?.address}</Text>
        </HStack>
      </Center>
      {authStore.userType === ACCOUNT_TYPES.GARAGE_MANAGER ? (
        <ManagerOption navigation={navigation} />
      ) : (
        <StaffOption navigation={navigation} />
      )}
    </VStack>
  );
};

export default observer(GarageHome);
