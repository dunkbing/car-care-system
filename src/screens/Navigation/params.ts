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
  ChangePassword: undefined;
  ResetPassword: undefined;
  ForgotPassword: undefined;
};

export type ProfileStackParams = {
  ProfileOverview: undefined;
  ProfileInfo: undefined;
  CarInfo: undefined;
  DefaultGarage: undefined;
  RescueHistory: undefined;
  ChangePassword: undefined;
};

export type HomeStackParams = {
  Map: undefined;
  ProfileHome: undefined;
};

export type RescueStackParams = {
  SearchGarage: undefined;
};
