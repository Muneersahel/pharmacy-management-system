import { Role } from './role.interface';

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: Role;
}

export interface loginPayload {
  email: string;
  password: string;
}

export interface loginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}
// export interface RegisterPayload {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   roleName: string;
//   marketName?: string;
// }

// export interface RegisterUserResponse {
//   message: string;
//   accessToken: string;
// }

// export interface UserResponse {
//   message: string;
//   data: User;
// }
