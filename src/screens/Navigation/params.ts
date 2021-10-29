import { NavigatorScreenParams } from '@react-navigation/native';

export type StackParams = {
  Auth: NavigatorScreenParams<AuthStackParams>;
  Home: NavigatorScreenParams<HomeStackParams> | undefined;
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
  DefineCarModel: { loggedIn: boolean };
  DefaultGarage: undefined;
  SearchGarage: undefined;
  RescueHistory: undefined;
  ChangePassword: undefined;
};

export type HomeStackParams = {
  RescueHome: undefined;
  ProfileHome: undefined;
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
