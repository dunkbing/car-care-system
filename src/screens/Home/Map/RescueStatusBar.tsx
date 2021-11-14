import React from 'react';
import { Center, Text } from 'native-base';
import { RESCUE_STATUS } from '@utils/constants';

const ViewWrapper = ({ children }: { children: React.ReactNode }) => (
  <Center
    style={{
      width: '100%',
      height: 50,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
    }}
  >
    {children}
  </Center>
);

const RescueStatusBar: React.FC<{ status?: RESCUE_STATUS; duration?: string }> = ({ status, duration }) => {
  switch (status) {
    case RESCUE_STATUS.ACCEPTED:
    case RESCUE_STATUS.ARRIVING:
      return (
        <ViewWrapper>
          <Text>Thời gian ước tính di chuyển</Text>
          <Text bold>{duration || '15 phút'}</Text>
        </ViewWrapper>
      );
    case RESCUE_STATUS.ARRIVED:
      return (
        <ViewWrapper>
          <Text bold>Vui lòng chờ nhân viên kiểm tra</Text>
        </ViewWrapper>
      );
    case RESCUE_STATUS.WORKING:
      return (
        <ViewWrapper>
          <Text bold>Đang trong quá trình sửa chữa.</Text>
          <Text bold>Quý khách vui lòng chờ</Text>
        </ViewWrapper>
      );
    default:
      return null;
  }
};

export default RescueStatusBar;
