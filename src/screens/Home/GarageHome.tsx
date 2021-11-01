import React, { useEffect } from 'react';
import { Box, Center, HStack, Image, Text, VStack } from 'native-base';
import { Customer, Employees, ListImg, RequestImg, ScrewDriverWrench } from '@assets/images';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import { headerColor } from '@screens/shared/colors';
import { observer } from 'mobx-react';
import Container from 'typedi';
import AuthStore from '@mobx/stores/auth';
import { USER_TYPES } from '@utils/constants';
import { TouchableOpacity } from 'react-native';
import GarageStore from '@mobx/stores/garage';
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

type OptionProps = { navigation: StackNavigationProp<GarageHomeOptionStackParams, 'GarageOptions'> };

const ManagerOption: React.FC<OptionProps> = ({ navigation }) => {
  return (
    <VStack pt='3'>
      <Center>
        <HStack space={6}>
          <OptionItem
            name='Garage của tôi'
            imgSrc={ScrewDriverWrench}
            onPress={() => {
              navigation.navigate('MyGarage');
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
            name='Quản lý khách hàng'
            imgSrc={Customer}
            onPress={() => {
              navigation.navigate('ManageCustomers');
            }}
          />
          <OptionItem
            name='Lịch sử cứu hộ'
            imgSrc={ListImg}
            onPress={() => {
              navigation.navigate('RescueHistory');
            }}
          />
        </HStack>
      </Center>
    </VStack>
  );
};

const StaffOption: React.FC<OptionProps> = ({ navigation }) => {
  return (
    <VStack pt='3'>
      <Center>
        <HStack space={6}>
          <OptionItem
            name='Garage của tôi'
            imgSrc={ScrewDriverWrench}
            onPress={() => {
              navigation.navigate('MyGarage');
            }}
          />
          <OptionItem
            name='Yêu cầu cứu hộ'
            imgSrc={ListImg}
            onPress={() => {
              navigation.navigate('PendingRescueRequest');
            }}
          />
        </HStack>
        <HStack space={6} mt='6'>
          <OptionItem
            name='Lịch sử cứu hộ'
            imgSrc={RequestImg}
            onPress={() => {
              navigation.navigate('RescueHistory');
            }}
          />
        </HStack>
      </Center>
    </VStack>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams, 'GarageOptions'>;

const GarageHome: React.FC<Props> = ({ navigation }) => {
  const authStore = Container.get(AuthStore);
  const garageStore = Container.get(GarageStore);
  // useEffect(() => {
  //   garageStore.setDefaultGarage({
  //     address: 'QL23, Vân Nội, Đông Anh, Hà Nội',
  //     name: 'Garage ô tô Hùng Lý',
  //     phoneNumber: '0325163541',
  //   } as any);
  // }, []);
  return (
    <VStack>
      <Center pb='8' pt='8'>
        <Text bold fontSize='2xl' pb='3'>
          Garage ô tô Hùng Lý
        </Text>
        <HStack width='80%' justifyContent='center' alignItems='center' space={2}>
          <FaIcon name='map-marker' size={24} color={headerColor} />
          <Text fontSize='lg'>QL23, Vân Nội, Đông Anh, Hà Nội</Text>
        </HStack>
      </Center>
      {authStore.userType === USER_TYPES.GARAGE_MANAGER ? (
        <ManagerOption navigation={navigation} />
      ) : (
        <StaffOption navigation={navigation} />
      )}
    </VStack>
  );
};

export default observer(GarageHome);
