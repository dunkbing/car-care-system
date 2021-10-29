export type CarModel = {
  id: number;
  brandName: string;
  modelName: string;
  year: number;
  color: string;
  licenseNumber: string;
  imageUrl: string | null;
};

export type CarResponseModel = CarModel;

export type CarRequestModel = {
  modelId: number;
  licenseNumber: string;
  color: string;
  year: number;
  imageUrl?: string;
  contentType?: string;
  contentDisposition?: string;
  length?: number;
  name?: string;
  fileName?: string;
};
