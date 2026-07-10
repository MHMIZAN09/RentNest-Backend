import { Role } from "../../../generated/prisma/enums";
export interface IAuthRegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface IAuthLoginPayload {
  email: string;
  password: string;
}
