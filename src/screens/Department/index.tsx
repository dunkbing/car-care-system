import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Text } from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import { Table, Row } from 'react-native-table-component';
import { useDeleteDepartmentByIdMutation, useGetDepartmentsQuery } from '@redux/services/department';
import { StackParamList } from '../common';
import dialog from '@utils/dialog';
import { MessageDialogResult } from '@components/dialog/MessageDialog';

type Props = StackScreenProps<StackParamList, 'Home'>;

const Departments: React.FC<Props> = ({ navigation }) => {
  const { data, isLoading, isFetching, refetch } = useGetDepartmentsQuery('');
  const departments = data ?? [];
  const [deleteDept] = useDeleteDepartmentByIdMutation();

  const tableHead = ['Tên ban', '', ''];

  useEffect(() => {
    const unSub = navigation.addListener('focus', refetch);

    return unSub;
  }, [navigation]);

  /**
   * deleting a department
   * @param deptId id of deleting department
   * @returns new function handler
   */
  const handleDelete = (deptId: string | number) => {
    return () => {
      dialog.open('Xóa', 'Xác nhận xóa', async (dialogResult) => {
        if (dialogResult === MessageDialogResult.OK) {
          await deleteDept(deptId);
          refetch();
        }
      });
    };
  };

  const table = departments.map((dept) => {
    const updateBtn = (
      <Button
        onPress={() => {
          navigation.navigate('MutateDepartment', { ...dept });
        }}
      >
        Sửa
      </Button>
    );
    const deleteBtn = (
      <Button onPress={handleDelete(dept.id)} colorScheme='danger'>
        Xóa
      </Button>
    );
    const rowData = [dept.name, updateBtn, deleteBtn];
    return <Row key={dept.id} data={rowData} style={styles.row} textStyle={styles.text} flexArr={[3, 1, 1]} />;
  });

  return (
    <View style={{ flex: 1, margin: 10 }}>
      <Button
        style={{ padding: 16 }}
        onPress={() => {
          navigation.navigate('MutateDepartment');
        }}
      >
        Thêm mới
      </Button>
      <ScrollView>
        <View style={styles.container}>
          <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
            <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[3, 1, 1]} />
            {isLoading || isFetching ? <ActivityIndicator size='large' /> : table}
          </Table>
          {departments.length === 0 && !(isLoading || isFetching) ? <Text>Khong co du lieu</Text> : null}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, paddingTop: 10, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6, textAlign: 'center' },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
});

export default Departments;
