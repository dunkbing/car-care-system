import { CarDetailModel } from '@models/car';
import { GarageModel } from '@models/garage';
import { AvailableCustomerRescueDetail, CustomerRescueHistory, GarageRescueHistory } from '@models/rescue';
import { StaffModel } from '@models/staff';
import { CustomerModel } from '@models/user';
import { NavigatorScreenParams } from '@react-navigation/native';

export type StackParams = {
  Auth: NavigatorScreenParams<AuthStackParams>;
  CustomerHomeTab: NavigatorScreenParams<CustomerTabParams> | undefined;
  GarageHomeStack: NavigatorScreenParams<GarageHomeOptionStackParams> | undefined;
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
  ForgotPassword: undefined;
  VerifyCode: { email: string };
  ResetPassword: { verifyCode: string };
};

export type ProfileStackParams = {
  ProfileOverview: undefined;
  ProfileInfo: undefined;
  CarInfo: undefined;
  CarHistory: { car: CarDetailModel };
  EditCarDetail: { car: CarDetailModel };
  DefineCarModel: { loggedIn: boolean };
  GarageDetail: { garageId: number; side: 'garage' | 'customer' };
  SearchGarage: undefined;
  RescueHistory: undefined;
  HistoryDetail: { rescue: CustomerRescueHistory };
  EditFeedback: { id: number; type: 'update' | 'create'; staffName: string; garage: string; rating: number; comment: string };
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
  Home: undefined;
  GarageDetail: { garageId: number; side: 'garage' | 'customer' };
  ProposalList: undefined;
  QuotationSuggestion: { invoiceId: number };
  ManageStaffs: undefined | { rescueId: number };
  AddStaff: undefined;
  EditStaff: { staff: StaffModel };
  ManageCustomers: undefined;
  CustomerCarStatus: { customerId: number };
  RescueHistory: undefined | { customerId: number; customerName: string };
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
  Payment: { rescueId: number; invoiceId: number };
  RejectRequest: { customerId: number };
  Feedback: { rescueDetailId: number; customerName: string };
};

export type RescueStackParams = {
  Map: undefined;
  NearByGarages: { onSelectGarage: (garage: GarageModel) => void; customerLocation: { longitude: number; latitude: number } };
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
  CancelStaffSuggestion: { invoiceId: number; quotation?: boolean };
  DefineRequestCancelReason:
    | undefined
    | {
        onCancel: (() => void) | undefined;
      };
  GarageDetail: undefined | { garageId: number; side?: 'garage' | 'customer'; isRescueStack?: boolean };
  RepairSuggestion: { invoiceId: number };
  QuotationSuggestion: { invoiceId: number };
  Payment: { rescueId?: number };
  Feedback: { rescueDetailId: number; staffName: string; garage: string };
};
