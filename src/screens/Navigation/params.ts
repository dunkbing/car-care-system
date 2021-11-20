import { CarDetailModel } from '@models/car';
import { GarageModel } from '@models/garage';
import { AvailableCustomerRescueDetail, CustomerRescueHistory, GarageRescueHistory } from '@models/rescue';
import { StaffModel } from '@models/staff';
import { CustomerModel } from '@models/user';
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
  HistoryDetail: { rescue: CustomerRescueHistory };
  EditFeedback: { rescue: Pick<CustomerRescueHistory, 'garage' | 'staff' | 'customerFeedback'> };
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
  MyGarage: { garage: GarageModel | null };
  ManageStaffs: undefined | { rescueId: number };
  AddStaff: undefined;
  EditStaff: { staff: StaffModel };
  ManageCustomers: undefined;
  CustomerCarStatus: undefined;
  RescueHistory: undefined;
  HistoryDetail: { rescue: GarageRescueHistory };
  PendingRescueRequest: undefined;
  DetailRequest: { request: AvailableCustomerRescueDetail };
  DetailAssignedRequest: { request: AvailableCustomerRescueDetail | null; checking?: boolean };
  Map: { request: AvailableCustomerRescueDetail | null };
  DetailRescueRequest:
    | undefined
    | {
        onCancel: () => void;
        person: Pick<CustomerModel, 'id' | 'firstName' | 'lastName' | 'phoneNumber' | 'avatarUrl'> | null | undefined;
        duration: string;
        rescueId: number;
        isStaff?: boolean;
      };
  DefineRequestCancelReason:
    | undefined
    | {
        onCancel: (() => void) | undefined;
      };
  AutomotivePartSuggestion: undefined;
  ServiceSuggestion: undefined;
  RepairSuggestion: undefined;
  Payment: undefined;
  RejectRequest: undefined;
  Feedback: undefined | { customerName: string };
};

export type RescueStackParams = {
  Map: undefined;
  DefineCarStatus: {
    garage: GarageModel;
    onConfirm: (rescueCaseId: number, description: string) => void;
  };
  DetailRescueRequest:
    | undefined
    | {
        onCancel: () => void;
        person: Pick<StaffModel, 'id' | 'firstName' | 'lastName' | 'phoneNumber' | 'avatarUrl'> | null | undefined;
        duration: string;
        rescueId: number;
        isStaff?: boolean;
      };
  DefineRequestCancelReason:
    | undefined
    | {
        onCancel: (() => void) | undefined;
      };
  GarageDetail: undefined | { garage: GarageModel; isRescueStack: boolean };
  ConfirmSuggestedRepair: undefined;
  Payment: undefined;
  Feedback: undefined;
};
