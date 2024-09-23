import { User } from "../entities/User";

// Verificar si el correo existe
export const existingEmail = async (email: string) => {
  const existeEmail = await User.findOne({ where: { email } });
  if (email && existeEmail) {
    throw new Error(`El correo: ${email}, ya está registrado`);
  }
};

// Verificar si el correo existe
export const existingUser = async (id: string) => {
  const existeUsuario = await User.findOneBy({ id });
  if (!existeUsuario) {
    throw new Error(`El usuario con el id no existe ${id}`);
  }
};

// Verificar que la contraseña cumpla las condiciones
export const validPassword = async (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]{8,}$/;
  if (!regex.test(password)) {
    throw new Error(
      "La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número"
    );
  }
};
