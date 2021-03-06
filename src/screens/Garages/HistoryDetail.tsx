import React, { useEffect } from 'react';
import { Center, ScrollView, Text, View, VStack } from 'native-base';
import FAFIcon from 'react-native-vector-icons/FontAwesome5';
import { AirbnbRating } from 'react-native-ratings';
import { GarageHomeOptionStackParams } from '@screens/Navigation/params';
import { StackScreenProps } from '@react-navigation/stack';
import { formatAMPM } from '@utils/time';
import Container from 'typedi';
import formatMoney from '@utils/format-money';
import { ApiService } from '@mobx/services/api-service';
import { GarageRescueHistoryDetail } from '@models/rescue';
import { rescueApi } from '@mobx/services/api-types';
import { ImageCarousel } from '@components/image';

type CategoryDetailProps = {
  name: string;
  price: number;
  quantity: number;
};

const CategoryDetail: React.FC<CategoryDetailProps> = ({ name, price, quantity }) => {
  return (
    <View my={1.5}>
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

type Props = StackScreenProps<GarageHomeOptionStackParams, 'HistoryDetail'>;

const HistoryDetail: React.FC<Props> = ({ route }) => {
  const { rescue } = route.params;
  const rescueDate = new Date(rescue.createAt);
  const apiService = Container.get(ApiService);

  const [rescueDetail, setRescueDetail] = React.useState<GarageRescueHistoryDetail>();

  useEffect(() => {
    if (rescue.id) {
      void apiService.get<GarageRescueHistoryDetail>(rescueApi.garageHistoryDetail(rescue.id), {}, true).then(({ result }) => {
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
            {rescue.staff?.lastName} {rescue.staff?.firstName}
          </Text>
          <Text style={{ fontSize: 16 }}>
            {rescueDate.toLocaleDateString('vi-VN')} | {formatAMPM(rescueDate)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 17,
            }}
          >
            {rescue.car?.brandName} {rescue.car?.modelName}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 17,
            }}
          >
            {rescue.car?.licenseNumber}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 15,
          }}
        >
          <FAFIcon name='map-marker-alt' size={20} color='#1F87FE' />
          <Text style={{ marginHorizontal: 10 }}>{rescue?.address}</Text>
        </View>
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            Thi???t b???
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
              <Text>Kh??ng c?? thi???t b???</Text>
            )}
          </View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              marginTop: 15,
            }}
          >
            D???ch v???
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
              <Text>Kh??ng c?? d???ch v???</Text>
            )}
          </View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              marginTop: 15,
            }}
          >
            T??nh tr???ng xe
          </Text>
          <Text>{rescueDetail?.checkCondition || 'Kh??ng c?? m?? t??? t??nh tr???ng xe'}</Text>
          <ImageCarousel imageUrls={rescueDetail?.checkImageUrls || []} />
        </View>
        <VStack mt='3' space={2}>
          <Text bold fontSize='lg' textAlign='right'>
            Thu??? GTGT (10%): {formatMoney(Number(rescueDetail?.invoice?.total) - Number(rescueDetail?.invoice?.totalBeforeTax))}
          </Text>
          <Text bold fontSize='lg' textAlign='right'>
            T???ng: {formatMoney(rescueDetail?.invoice?.total)}
          </Text>
        </VStack>
        {rescueDetail?.customerFeedback ? (
          <View>
            <Text
              style={{
                marginVertical: 10,
                fontWeight: 'bold',
              }}
            >
              ????nh gi?? c???a kh??ch h??ng
            </Text>
            <AirbnbRating defaultRating={rescueDetail.customerFeedback.point} showRating={false} isDisabled={true} />
            <Text
              style={{
                marginVertical: 10,
              }}
            >
              {rescueDetail.customerFeedback.comment}
            </Text>
          </View>
        ) : (
          <Center>
            <Text>Ch??a c?? ????nh gi??</Text>
          </Center>
        )}
      </VStack>
    </ScrollView>
  );
};

export default HistoryDetail;
