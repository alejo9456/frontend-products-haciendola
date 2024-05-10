export interface User {
  id: number;
  email: string;
  password?: string;
  fullname: string;
  roles: string[];
}

export interface GetDataEspecificUserByIdrResult {
  data: User;
  message: string;
}
