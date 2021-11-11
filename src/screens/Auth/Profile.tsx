import React, { useState } from 'react';
import FormInput from '@components/form/FormInput';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Box, Button, Center, HStack, Radio, ScrollView, Text, VStack } from 'native-base';
import { Container } from 'typedi';
import { ProfileStackParams } from '@screens/Navigation/params';
import { rootNavigation } from '@screens/Navigation/roots';
import AuthStore from '@mobx/stores/auth';
import FormSelect from '@components/form/FormSelect';
import { ACCOUNT_TYPES } from '@utils/constants';
import { AvatarStaff } from '@assets/images';
import { CustomerLoginResponseModel, GarageLoginResponseModel } from '@models/user';

type Props = NativeStackScreenProps<ProfileStackParams, 'ProfileInfo'>;

const Profile: React.FC<Props> = () => {
  const [typeCustomer, setTypeCustomer] = React.useState('');
  const authStore = Container.get(AuthStore);
  const currentUser =
    authStore.userType === ACCOUNT_TYPES.CUSTOMER
      ? (authStore.user as CustomerLoginResponseModel)
      : (authStore.user as GarageLoginResponseModel);
  const [user, setUser] = useState({ ...currentUser });

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
            <Avatar size='xl' bg='lightBlue.400' source={user.avatarUrl ? { uri: user.avatarUrl } : AvatarStaff}>
              NB
            </Avatar>
            {/* <Button size='xs' mt='1.5' leftIcon={<Ionicons name='cloud-upload-outline' size={15} />}>
              Thay đổi avatar
            </Button> */}
          </Center>
          <FormInput
            isRequired
            label='Họ và tên'
            placeholder='Họ và tên'
            keyboardType='ascii-capable'
            defaultValue={`${user?.lastName} ${user?.firstName}`}
          />
          <Radio.Group
            defaultValue='1'
            name='myRadioGroup'
            accessibilityLabel=''
            style={{
              flexDirection: 'row',
            }}
          >
            <HStack space={3} mt={-2}>
              <Text
                style={{
                  fontWeight: 'bold',
                  marginTop: 10,
                }}
              >
                Giới tính
              </Text>
              <Radio value='1' my={1}>
                Nam
              </Radio>
              <Radio value='2' my={1}>
                Nữ
              </Radio>
              <Radio value='3' my={1}>
                Khác
              </Radio>
            </HStack>
          </Radio.Group>
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
            defaultValue={user?.dateOfBirth?.slice(0, 10) || ''}
          />
          <FormInput
            isRequired
            label='Địa chỉ'
            placeholder='Địa chỉ'
            keyboardType='ascii-capable'
            defaultValue={(user as any)?.address || ''}
          />
          {authStore.userType === ACCOUNT_TYPES.CUSTOMER && (
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
          )}
        </VStack>
        {authStore.userType === ACCOUNT_TYPES.CUSTOMER && (
          <FormInput label='Mã số thuế' placeholder='Mã số thuế' keyboardType='phone-pad' />
        )}
        {authStore.userType === ACCOUNT_TYPES.CUSTOMER && (
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
        )}
      </Box>
    </ScrollView>
  );
};

export default Profile;
