import { Avatar } from './common';

export type CarModel = {
  id: number;
  brandName: string;
  modelName: string;
  year: number;
  color: string;
  licenseNumber: string;
  imageUrl: string | null;
};

export type CreateCarRequestModel = {
  modelId: number;
  licenseNumber: string;
  color: string;
  year: number;
  imageUrl?: string;
  contentType?: string;
  contentDisposition?: string;
  length?: number;
  name?: string;
  avatar?: Avatar;
};

export type UpdateCarRequestModel = CreateCarRequestModel & { id: number };

export type CarDetailModel = {
  id: number;
  brand: {
    id: number;
    name: string;
  };
  model: {
    id: number;
    name: string;
  };
  year: number;
  color: string;
  licenseNumber: string;
  imageUrl: string | null;
  avatar?: Avatar;
};

export type CarResponseModel = CarModel;
