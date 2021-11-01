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
  CarDetail: { carId: number };
  DefineCarModel: { loggedIn: boolean };
  DefaultGarage: undefined;
  SearchGarage: undefined;
  RescueHistory: undefined;
  EditFeedback: undefined | { username: string };
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
  GarageOptions: undefined;
  MyGarage: undefined;
  ManageStaffs: undefined | { rescue: boolean };
  AddStaff: undefined;
  EditStaff: undefined;
  ManageCustomers: undefined;
  CustomerCarStatus: undefined;
  RescueHistory: undefined;
  DetailHistory: undefined;
  PendingRescueRequest: undefined;
  DetailRequest: undefined;
  DetailAssignedRequest: undefined;
  RejectRequest: undefined;
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
};
