import React from 'react';
import Container from 'typedi';
import { observer } from 'mobx-react';
import { HStack, VStack, Text } from 'native-base';
import AuthStore from '@mobx/stores/auth';
import { AvatarStaff } from '@assets/images';
import { Image } from 'react-native';

const OptionProfile: React.FC = observer(() => {
  const authStore = Container.get(AuthStore);
  return (
    <HStack space={4} px='2' py='2'>
      <Image
        source={authStore.user?.avatarUrl ? { uri: authStore.user.avatarUrl } : AvatarStaff}
        style={{ width: 100, height: 100, margin: 5, borderRadius: 50 }}
      />
      <VStack space={2} justifyContent='center'>
        <Text bold fontSize='xl'>{`${authStore.user?.lastName} ${authStore.user?.firstName}`}</Text>
      </VStack>
    </HStack>
  );
});

export default OptionProfile;
