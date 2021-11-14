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

//#region others
export enum INVOICE_STATUS {
  DRAFT,
  PENDING,
  CUSTOMER_CONFIRM_PAID,
  STAFF_CONFIRM_PAID,
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
//#endregion
