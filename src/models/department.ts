export type DepartmentModel = {
  id: number;
  name: string;
  dateCreated?: string;
  dateModified?: string;
};

export type CreateDepartmentModel = {
  name: string;
};

export type UpdateDepartmentModel = {
  id: number;
  name: string;
};
