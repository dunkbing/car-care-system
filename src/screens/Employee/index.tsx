import { StackScreenProps } from '@react-navigation/stack';
import { Button, Text } from 'native-base';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Table, Row, TableWrapper, Cell } from 'react-native-table-component';
import { useDeleteEmployeeByIdMutation, useGetEmployeesQuery } from '@redux/services/employee';
import { StackParamList } from '../common';
import dialog from '@utils/dialog';
import { MessageDialogResult } from '@components/dialog/MessageDialog';

type Props = StackScreenProps<StackParamList, 'Home'>;

const Employees: React.FC<Props> = ({ navigation }) => {
  const { data, isLoading, isFetching, refetch } = useGetEmployeesQuery('');
  const employees = data ?? [];
  const [deleteEmp] = useDeleteEmployeeByIdMutation();
  const tableHead = ['Tên', 'Sdt', 'Email', 'Deparment', '', ''];

  useEffect(() => {
    const unSub = navigation.addListener('focus', refetch);

    return unSub;
  }, [navigation]);

  const cellWidthArr = [150, 120, 210, 100, 70, 70];

  const handleDelete = (empId: string | number) => {
    return () => {
      dialog.open('Xác nhận xóa', 'Xóa', async (dialogResult) => {
        if (dialogResult === MessageDialogResult.OK) {
          await deleteEmp(empId);
          refetch();
        }
      });
    };
  };

  const table = employees.length ? (
    <ScrollView>
      <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
        {employees.map((employee) => (
          <TableWrapper key={employee.id} style={styles.row}>
            <Cell textStyle={styles.text} data={`${employee.lastName} ${employee.firstName}`} width={cellWidthArr[0]} />
            <Cell textStyle={styles.text} data={employee.phone} width={cellWidthArr[1]} />
            <Cell textStyle={styles.text} data={employee.email} width={cellWidthArr[2]} />
            <Cell textStyle={styles.text} data={employee?.department?.name} width={cellWidthArr[3]} />
            <Cell
              textStyle={styles.text}
              data={
                <Button
                  onPress={() => {
                    navigation.navigate('MutateEmployee', { ...employee, departmentId: employee?.department?.id });
                  }}
                >
                  Sửa
                </Button>
              }
              width={cellWidthArr[4]}
            />
            <Cell
              textStyle={styles.text}
              data={
                <Button onPress={handleDelete(employee.id)} colorScheme='danger'>
                  Xóa
                </Button>
              }
              width={cellWidthArr[5]}
            />
          </TableWrapper>
        ))}
      </Table>
    </ScrollView>
  ) : (
    <Text>Không có dữ liệu</Text>
  );

  return (
    <View style={{ flex: 1, margin: 10 }}>
      <Button
        style={{ padding: 16 }}
        onPress={() => {
          navigation.navigate('MutateEmployee');
        }}
      >
        Thêm mới
      </Button>
      <View style={styles.container}>
        <ScrollView horizontal>
          <View>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
              <Row data={tableHead} style={styles.head} textStyle={styles.text} widthArr={cellWidthArr} />
            </Table>
            {isLoading || isFetching ? <ActivityIndicator size='large' /> : table}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, paddingTop: 10, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6, textAlign: 'center' },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
});

export default Employees;
