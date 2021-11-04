import { CarDetailModel, CarModel } from '@models/car';
import { GarageModel } from '@models/garage';
import { CustomerRescueHistoryModel, GarageRescueHistoryModel } from '@models/rescue';
import { NavigatorScreenParams } from '@react-navigation/native';

export type StackParams = {
  Auth: NavigatorScreenParams<AuthStackParams>;
  CustomerHomeTab: NavigatorScreenParams<CustomerTabParams> | undefined;
  GarageHomeTab: NavigatorScreenParams<GarageTabParams> | undefined;
  GarageHomeOptions: NavigatorScreenParams<GarageHomeOptionStackParams> | undefined;
  Profile: NavigatorScreenParams<ProfileStackParams>;
  Rescue: NavigatorScreenParams<RescueStackParams>;
};

export type RootStackParams = StackParams;

export type AuthStackParams = {
  ChooseMethod: undefined;
  CustomerLogin: undefined;
  GarageLogin: undefined;
  Register: undefined;
  DefineCarModel: undefined;
  SearchGarage: undefined | { skip?: boolean };
  ChangePassword: undefined;
  ResetPassword: undefined;
  ForgotPassword: undefined;
};

export type ProfileStackParams = {
  ProfileOverview: undefined;
  ProfileInfo: undefined;
  CarInfo: undefined;
  CarHistory: { car: CarDetailModel };
  EditCarDetail: { car: CarDetailModel };
  DefineCarModel: { loggedIn: boolean };
  DefaultGarage: undefined;
  SearchGarage: undefined;
  RescueHistory: undefined;
  HistoryDetail: { rescue: Pick<CustomerRescueHistoryModel, 'car' | 'garage' | 'rescueCase' | 'createAt' | 'staff' | 'customerFeedback'> };
  EditFeedback: { rescue: Pick<CustomerRescueHistoryModel, 'garage' | 'staff' | 'customerFeedback'> };
  ChangePassword: undefined;
};

export type CustomerTabParams = {
  RescueHome: undefined;
  ProfileHome: undefined;
};

export type GarageTabParams = {
  GarageHome: undefined;
  PendingRequestHome: undefined;
  ProfileHome: undefined;
};

export type GarageHomeOptionStackParams = {
  MyGarage: undefined;
  ManageStaffs: undefined | { rescue: boolean };
  AddStaff: undefined;
  EditStaff: undefined;
  ManageCustomers: undefined;
  CustomerCarStatus: undefined;
  RescueHistory: undefined;
  HistoryDetail: { rescue: Pick<GarageRescueHistoryModel, 'car' | 'staff' | 'createAt' | 'customer' | 'customerFeedback'> };
  PendingRescueRequest: undefined;
  DetailRequest: undefined;
  DetailAssignedRequest: undefined;
  RejectRequest: undefined;
  Feedback: undefined;
};

export type RescueStackParams = {
  Map: undefined;
  DefineCarStatus: {
    onConfirm: () => void;
  };
  DetailRescueRequest:
    | undefined
    | {
        onCancel: () => void;
      };
  DefineRequestCancelReason:
    | undefined
    | {
        onCancel: (() => void) | undefined;
      };
  GarageDetail: undefined | { garage: GarageModel };
};
