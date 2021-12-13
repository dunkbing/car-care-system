import React, { useEffect } from 'react';
import { Center, Link, ScrollView, Text, View, VStack } from 'native-base';
import MatCommuIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AirbnbRating } from 'react-native-ratings';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParams } from '@screens/Navigation/params';
import { formatAMPM } from '@utils/time';
import { ApiService } from '@mobx/services/api-service';
import { rescueApi } from '@mobx/services/api-types';
import { GarageRescueHistoryDetail } from '@models/rescue';
import Container from 'typedi';
import formatMoney from '@utils/format-money';
import { RESCUE_STATUS } from '@utils/constants';
import { ImageCarousel } from '@components/image';

type CategoryDetailProps = {
  name: string;
  price: number;
  quantity: number;
};

const CategoryDetail: React.FC<CategoryDetailProps> = ({ name, price, quantity }) => {
  return (
    <View my={3}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 12,
        }}
      >
        {name}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text>{formatMoney(price)}</Text>
        <Text>x{quantity}</Text>
      </View>
    </View>
  );
};

type Props = StackScreenProps<ProfileStackParams, 'HistoryDetail'>;

const HistoryDetail: React.FC<Props> = ({ navigation, route }) => {
  const { rescue } = route.params;
  const rescueDate = new Date(rescue.createAt as string);
  const apiService = Container.get(ApiService);

  const [rescueDetail, setRescueDetail] = React.useState<GarageRescueHistoryDetail>();

  useEffect(() => {
    if (rescue.id) {
      void apiService.get<GarageRescueHistoryDetail>(rescueApi.customerHistoryDetail(rescue.id), {}, true).then(({ result }) => {
        if (result) {
          setRescueDetail(result);
        }
      });
    }
  }, [apiService, rescue.id]);

  return (
    <ScrollView>
      <VStack
        style={{
          paddingHorizontal: 20,
          paddingVertical: 25,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 19,
            }}
          >
            {rescue.garage.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 17,
            }}
          >
            {rescue.car?.brandName || 'null'} {rescue.car?.modelName || 'null'}
          </Text>
          <Text>Biển số xe: {`${rescue.car?.licenseNumber}`}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
          }}
        >
          <MatCommuIcon name='map-marker' size={22} color='#1F87FE' />
          <Text style={{ marginHorizontal: 10 }}>{rescue.address}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
          }}
        >
          <MatCommuIcon name='clock-outline' size={22} color='#1F87FE' />
          <Text style={{ marginLeft: 10 }}>
            {rescueDate.toLocaleDateString('vi-VN')} | {formatAMPM(rescueDate)}
          </Text>
        </View>
        {rescue.status === RESCUE_STATUS.REJECTED ? (
          <Center>
            <Text style={{ color: 'red' }}>Đã hủy yêu cầu</Text>
          </Center>
        ) : (
          <View>
            <View>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                Thiết bị
              </Text>
              <View>
                {rescueDetail?.invoice?.automotivePartInvoices.length ? (
                  rescueDetail?.invoice?.automotivePartInvoices?.map((automotivePartInvoice) => (
                    <CategoryDetail
                      key={automotivePartInvoice.id}
                      name={`${automotivePartInvoice.automotivePart.name}`}
                      price={automotivePartInvoice.price}
                      quantity={automotivePartInvoice.quantity}
                    />
                  ))
                ) : (
                  <Text>Không có thiết bị</Text>
                )}
              </View>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                Dịch vụ
              </Text>
              <View>
                {rescueDetail?.invoice?.serviceInvoices?.length ? (
                  rescueDetail?.invoice?.serviceInvoices?.map((serviceInvoice) => (
                    <CategoryDetail
                      key={serviceInvoice.id}
                      name={`${serviceInvoice.service.name}`}
                      price={serviceInvoice.price}
                      quantity={serviceInvoice.quantity}
                    />
                  ))
                ) : (
                  <Text>Không có dịch vụ</Text>
                )}
              </View>
            </View>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                marginTop: 15,
              }}
            >
              Tình trạng xe
            </Text>
            <Text>{rescueDetail?.checkCondition || 'Không có mô tả tình trạng xe'}</Text>
            <ImageCarousel imageUrls={rescueDetail?.checkImageUrls || []} />
            <VStack mt='3' space={2}>
              <Text bold fontSize='lg' textAlign='right'>
                Thuế GTGT (10%): {formatMoney(Number(rescueDetail?.invoice?.total) - Number(rescueDetail?.invoice?.totalBeforeTax))}
              </Text>
              <Text bold fontSize='lg' textAlign='right'>
                Tổng: {formatMoney(rescueDetail?.invoice?.total)}
              </Text>
            </VStack>
            <View>
              <Text
                style={{
                  marginVertical: 10,
                  fontWeight: 'bold',
                }}
              >
                Đánh giá của khách hàng
              </Text>
              <AirbnbRating defaultRating={rescue.customerFeedback?.point || 0} showRating={false} isDisabled={true} />
              <Text
                style={{
                  marginTop: 10,
                  marginBottom: 5,
                }}
                textAlign='justify'
              >
                {rescue.customerFeedback?.comment}
              </Text>
            </View>
            <Link
              _text={{ fontSize: 'sm', fontWeight: '700', color: '#206DB6', textDecoration: 'none' }}
              alignSelf='center'
              mt={5}
              onPress={() =>
                navigation.navigate('EditFeedback', {
                  garage: rescue.garage.name,
                  id: rescue.customerFeedback?.id || rescue.id,
                  type: rescue.customerFeedback ? 'update' : 'create',
                  staffName: `${rescue.staff?.lastName} ${rescue.staff?.firstName}`,
                  rating: rescue.customerFeedback?.point || 0,
                  comment: rescue.customerFeedback?.comment || '',
                })
              }
            >
              Chỉnh sửa đánh giá
            </Link>
          </View>
        )}
      </VStack>
    </ScrollView>
  );
};

export default HistoryDetail;
