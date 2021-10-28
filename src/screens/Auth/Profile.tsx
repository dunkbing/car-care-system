import FormInput from '@components/form/FormInput';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Box, Button, Center, HStack, ScrollView, VStack } from 'native-base';
import React, { useContext, useState } from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { ProfileStackParams } from '@screens/Navigation/params';
import { rootNavigation } from '@screens/Navigation/roots';
import AuthStore from '@mobx/stores/auth';
import FormSelect from '@components/form/FormSelect';

type Props = NativeStackScreenProps<ProfileStackParams, 'ProfileInfo'>;

const Profile: React.FC<Props> = () => {
  const [typeCustomer, setTypeCustomer] = React.useState('');
  const authStore = useContext(AuthStore);
  const [user, setUser] = useState({ ...authStore.user });
  return (
    <ScrollView
      _contentContainerStyle={{
        px: '20px',
        mb: '4',
        backgroundColor: 'white',
        flexGrow: 1,
      }}
    >
      <Box safeArea flex={1} p={2} w='90%' mx='auto'>
        <VStack space={2} mt={5}>
          <Center>
            <Avatar
              size='xl'
              bg='lightBlue.400'
              source={{
                uri: 'https://alpha.nativebase.io/img/native-base-icon.png',
              }}
            >
              NB
              <AntIcon name='camera' size={24} />
            </Avatar>
          </Center>
          <FormInput
            isRequired
            label='Họ và tên'
            placeholder='Họ và tên'
            keyboardType='ascii-capable'
            defaultValue={`${user?.lastName} ${user?.firstName}`}
          />
          <FormInput
            isRequired
            label='Số điện thoại'
            placeholder='Số điện thoại'
            keyboardType='phone-pad'
            defaultValue={user?.phoneNumber || ''}
            onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
          />
          <FormInput
            isRequired
            label='Email'
            placeholder='Email@example.com'
            keyboardType='email-address'
            defaultValue={user?.email || ''}
          />
          <FormInput
            isRequired
            label='Ngày sinh'
            placeholder='Ngày sinh'
            keyboardType='ascii-capable'
            defaultValue={user?.dateOfBirth || ''}
          />
          <FormInput isRequired label='Địa chỉ' placeholder='Địa chỉ' keyboardType='ascii-capable' defaultValue={user?.address || ''} />
          <FormSelect
            label='Loại khách hàng'
            value={typeCustomer}
            items={[
              { value: 'Cá nhân', label: 'Cá nhân' },
              { value: 'Doanh nghiệp', label: 'Doanh nghiệp' },
            ]}
            onValueChange={(value) => setTypeCustomer(value)}
            selectProps={{ accessibilityLabel: 'Loại khách hàng', placeholder: 'Loại khách hàng' }}
          />
        </VStack>
        <FormInput label='Mã số thuế' placeholder='Mã số thuế' keyboardType='phone-pad' />
        <Center>
          <HStack space={10} mt={5} mb={5}>
            <Button style={{ alignSelf: 'center', width: '40%', height: 40 }} colorScheme='green' _text={{ color: 'white' }}>
              Lưu
            </Button>
            <Button
              style={{ alignSelf: 'center', width: '40%', height: 40 }}
              bgColor='#EA4335'
              _text={{ color: 'white' }}
              onPress={() => rootNavigation.goBack()}
            >
              Hủy
            </Button>
          </HStack>
        </Center>
      </Box>
    </ScrollView>
  );
};

export default Profile;
