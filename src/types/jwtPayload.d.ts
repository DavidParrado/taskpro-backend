import { UserRole } from "../utils/enums";

export interface JwtPayload {
  id: string;
  roles: UserRole[];
  iat: number;
  exp: number;
}
