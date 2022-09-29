export interface User {
  creationDate?: Date;
  _id?: string;
  name: string;
  email: string;
  password: string;
  active?: boolean;
  tasks?: [];
}