import { UserRole } from "../utils/enums";

export interface JwtPayload {
  user: {
    id: string;
    email: string;
    name: string;
    roles: UserRole[];
  };
  iat: number;
  exp: number;
}
