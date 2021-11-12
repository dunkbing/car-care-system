import React from 'react';
import { Center, Text } from 'native-base';
import { RESCUE_STATUS } from '@utils/constants';

const RescueStatusBar: React.FC<{ status: RESCUE_STATUS; duration?: string }> = ({ status, duration }) => {
  switch (status) {
    case RESCUE_STATUS.ACCEPTED:
      return (
        <Center>
          <Text>Cứu hộ đang đến</Text>
          <Text>Vui lòng đợi trong ít phút</Text>
        </Center>
      );
    case RESCUE_STATUS.ARRIVING:
      return (
        <Center>
          <Text>Cứu hộ sẽ đến trong</Text>
          <Text bold>{duration}</Text>
        </Center>
      );
    case RESCUE_STATUS.WORKING:
      return (
        <Center>
          <Text bold>Đang trong quá trình sửa chữa.</Text>
          <Text bold>Quý khách vui lòng chờ</Text>
        </Center>
      );
    default:
      return null;
  }
};

export default RescueStatusBar;
