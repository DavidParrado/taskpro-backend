import { User } from "../entities/User";

declare global {
  namespace Express {
    interface Request {
      user?: User; // Añadimos la propiedad user
    }
  }
}
