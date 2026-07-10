import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { IAuthLoginPayload, IAuthRegisterPayload } from "./auth.interface";
const registerFromDB = async (payload: IAuthRegisterPayload) => {
  const { name, email, password, role } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
    omit: {
      password: true,
    },
  });
  return newUser;
};

const loginFromDB = async (payload: IAuthLoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  if (user.status !== "ACTIVE") {
    throw new Error("User is not active");
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid password");
  }
  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const accessToken = await jwt.sign(jwtPayload, config.jwt_access_secret, {
    expiresIn: config.jwt_access_expiration,
  } as SignOptions);

  const refreshToken = await jwt.sign(jwtPayload, config.jwt_refresh_secret, {
    expiresIn: config.jwt_refresh_expiration,
  } as SignOptions);

  return { accessToken, refreshToken };
};

const getCurrentUserFromDB = async (userId: string) => {};

export const authService = {
  registerFromDB,
  loginFromDB,
  getCurrentUserFromDB,
};
