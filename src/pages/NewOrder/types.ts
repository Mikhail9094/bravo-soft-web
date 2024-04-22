export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface IApplication {
  customerId: number | null;
  document: string;
}
