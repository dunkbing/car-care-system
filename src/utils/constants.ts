/* eslint-disable prettier/prettier */
export enum STORE_STATUS {
  IDLE,
  LOADING,
  LOADING_BACKGROUND,
  SUCCESS,
  ERROR,
}

//#region user
export enum ACCOUNT_TYPES {
  CUSTOMER = 0,
  GARAGE_MANAGER = 1,
  GARAGE_STAFF = 2,
}

export enum ACCOUNT_STATUS {
  DEACTIVATED,
  ACTIVATED,
}

export enum CUSTOMER_TYPES {
  PERSONAL,
  BUSINESS,
}

export enum Gender {
  MALE,
  FEMALE,
  OTHER,
}
//#endregion

//#region rescue
export enum INVOICE_STATUS {
  DRAFT,
  SENT_PROPOSAL_TO_CUSTOMER,
  CUSTOMER_CONFIRMED_PROPOSAL,
  SENT_PROPOSAL_TO_MANAGER,
  SENT_QUOTATION_TO_CUSTOMER,
  CUSTOMER_CONFIRM_PAID,
  STAFF_CONFIRM_PAID,
  CUSTOMER_CONFIRM_REPAIR,
  MANAGER_CONFIRM_REPAIR,
}

export enum REJECT_SIDE {
  CUSTOMER,
  GARAGE,
}

export enum RESCUE_STATUS {
  PENDING,
  ACCEPTED,
  ARRIVING,
  ARRIVED,
  WORKING,
  REJECTED,
  DONE,
  IDLE,
}

export enum CUSTOMER_REPAIR_PROPOSAL_STATUS {
  PENDING,
  ACCEPTED,
  REJECTED,
}

export enum CUSTOMER_PAYMENT_PROPOSAL_STATUS {
  PENDING,
  ACCEPTED,
  REJECTED,
}

export enum MANAGER_PROPOSAL_STATUS {
  PENDING,
  ACCEPTED,
  REJECTED,
}
//#endregion

//#region misc
export const colors = {
  '#ff0000': 'Đỏ',
  '#000000': 'Đen',
  '#ffffff': 'Trắng',
  '#808080': 'Xám',
  '#00ff00': 'Lục',
  '#0000ff': 'Lam',
  'undefined': 'Khác',
};
//#endregion

//#region noti
export const NOTI_TYPE = {
  RESCUE: 'rescue',
  CUSTOMER_CANCEL_REQUEST: 'customer-cancel-request',
  GARAGE_REJECT_REQUEST: 'garage-reject-request',
};
//#endregion
