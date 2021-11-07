import React from 'react';
import { Button, Center, ScrollView, Text, View, VStack } from 'native-base';
import InputSpinner from 'react-native-input-spinner';
import { StackScreenProps } from '@react-navigation/stack';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import Container from 'typedi';
import RescueStore from '@mobx/stores/rescue';
import { STORE_STATUS } from '@utils/constants';
import toast from '@utils/toast';

const CategoryDetail: React.FC = ({ categoryName, price }) => {
  return (
    <View my={3}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 16,
        }}
      >
        {categoryName}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontSize: 16,
            textAlignVertical: 'bottom',
            height: 35,
          }}
        >
          {price}đ
        </Text>
        <InputSpinner
          max={300}
          min={1}
          step={1}
          initialValue={1}
          width='30%'
          height={35}
          buttonFontSize={15}
          inputStyle={{
            width: '40%',
          }}
          buttonStyle={{
            width: '30%',
            backgroundColor: '#4285F4',
          }}
          skin='square'
          fontSize={10}
          style={{
            borderRadius: 5,
          }}
        />
      </View>
    </View>
  );
};

type Props = StackScreenProps<GarageHomeOptionStackParams, 'RepairSuggestion'>;

const RepairSuggestion: React.FC<Props> = ({ navigation }) => {
  const rescueStore = Container.get(RescueStore);
  return (
    <ScrollView>
      <VStack px={15} py={25}>
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
            }}
          >
            Báo giá ban đầu
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 15,
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              paddingVertical: 10,
            }}
          >
            Thiết bị
          </Text>
          <Button
            onPress={() => {
              navigation.pop();
            }}
            style={{
              width: '40%',
              backgroundColor: '#34A853',
            }}
          >
            Thêm thiết bị
          </Button>
        </View>
        <View>
          <CategoryDetail categoryName='Láng đĩa phanh trước' price='250.000' />
          <CategoryDetail categoryName='Lọc dầu' price='150.000' />
          <CategoryDetail categoryName='Lọc xăng' price='850.000' />
          <CategoryDetail categoryName='Bugi' price='354.800' />
          <CategoryDetail categoryName='Gioăng nắp dàn cò' price='480.000' />
        </View>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            paddingVertical: 10,
          }}
        >
          Dịch vụ
        </Text>
        <View>
          <CategoryDetail categoryName='Công thợ' price='200.000' />
          <CategoryDetail categoryName='Phí di chuyển' price='250.000' />
        </View>
        <View
          style={{
            alignItems: 'flex-end',
            marginVertical: 10,
            paddingVertical: 15,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
            }}
          >
            Tổng: 2.784.800đ
          </Text>
        </View>
        <Center>
          <Button
            onPress={async () => {
              await rescueStore.changeRescueStatusToWorking();

              if (rescueStore.state === STORE_STATUS.ERROR) {
                toast.show(rescueStore.errorMessage);
              } else {
                navigation.pop(2);
              }
            }}
            style={{
              backgroundColor: '#34A853',
              width: '100%',
            }}
          >
            Tiến hành sửa chữa
          </Button>
        </Center>
      </VStack>
    </ScrollView>
  );
};

export default RepairSuggestion;
