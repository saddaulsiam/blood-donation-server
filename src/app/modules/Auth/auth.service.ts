import { UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { Request } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import { resetPasswordEmail, verificationEmail } from "../../../helpers/generateEmail";
import { generateVerificationCode } from "../../../helpers/generateVerificationCode";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { sendEmail } from "../../../helpers/sendEmail";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";

const registerUser = async (req: Request) => {
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  const verificationCode = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email: req.body.email,
      isEmailVerified: false,
    },
    include: {
      profile: true,
    },
  });

  if (userAlreadyExists) {
    // sand verification email to user
    await sendEmail({
      email: userAlreadyExists.email,
      subject: "Your Verification Code",
      message: `Your verification code is ${verificationCode}.`,
      htmlMessage: verificationEmail(verificationCode),
    });

    await prisma.emailVerification.upsert({
      where: {
        userId: userAlreadyExists.id,
      },
      update: {
        code: verificationCode,
        expiresAt: expiresAt,
      },
      create: {
        userId: userAlreadyExists.id,
        code: verificationCode,
        expiresAt: expiresAt,
      },
    });

    return userAlreadyExists;
  }

  const userData = {
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: hashedPassword,
    bloodGroup: req.body.bloodGroup,
    city: req.body.city,
    gender: req.body.gender,
  };

  const result = await prisma.$transaction(async (transactionClient: any) => {
    const { password, ...others } = await transactionClient.user.create({
      data: userData,
    });

    const profileData = {
      userId: others.id,
      age: req.body.age,
      bio: req.body.bio || "",
      photo: req.body.photo || "",
      lastDonationDate: req.body.lastDonationDate || "",
    };

    const createdProfile = await transactionClient.profile.create({
      data: profileData,
    });

    await transactionClient.emailVerification.create({
      data: {
        userId: others.id,
        code: verificationCode,
        expiresAt: expiresAt,
      },
    });

    // sand verification email to user
    await sendEmail({
      email: others.email,
      subject: "Your Verification Code",
      message: `Your verification code is ${verificationCode}.`,
      htmlMessage: verificationEmail(verificationCode),
    });

    return {
      ...others,
      profile: createdProfile,
    };
  });

  return result;
};

const verifyEmail = async (payload: { email: string; code: string }) => {
  const { email, code } = payload;

  // Fetch the user along with its EmailVerification record
  const user = await prisma.user.findUnique({
    where: { email },
    include: { EmailVerification: true, profile: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if the user is already verified
  if (user.isEmailVerified) {
    return { success: true, message: "Email is already verified", user };
  }

  const emailVerification = user.EmailVerification;

  if (!emailVerification) {
    throw new AppError(httpStatus.BAD_REQUEST, "No verification record found");
  }

  // Check if the provided code matches and hasn't expired
  if (emailVerification.code !== code || new Date() > emailVerification.expiresAt) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired verification code");
  }

  // Atomically update the user as verified and remove the verification record
  const result = await prisma.$transaction(async (tx) => {
    const { password, ...updatedUser } = await tx.user.update({
      where: { email },
      data: { isEmailVerified: true, status: "ACTIVE" },
      include: { profile: true },
    });
    await tx.emailVerification.delete({
      where: { userId: user.id },
    });

    return updatedUser;
  });

  return result;
};

const resendVerificationCode = async ({ email }: { email: string }) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
    include: { EmailVerification: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Generate new verification code
  const newCode = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  if (user.EmailVerification) {
    // Update existing verification code
    await prisma.emailVerification.update({
      where: { userId: user.id },
      data: { code: newCode, expiresAt },
    });
  } else {
    // Create new verification entry
    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        code: newCode,
        expiresAt,
      },
    });
  }

  // Send email with new code
  await sendEmail({
    email: user.email,
    subject: "Your Verification Code",
    message: `Your verification code is ${newCode}.`,
    htmlMessage: verificationEmail(newCode),
  });

  return { success: true, message: "Verification code resent" };
};

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    include: {
      profile: true,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password incorrect!");
  }

  const verificationCode = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  if (!userData.isEmailVerified) {
    // sand verification email to user
    await sendEmail({
      email: userData.email,
      subject: "Your Verification Code",
      message: `Your verification code is ${verificationCode}.`,
      htmlMessage: verificationEmail(verificationCode),
    });

    await prisma.emailVerification.upsert({
      where: {
        userId: userData.id,
      },
      update: {
        code: verificationCode,
        expiresAt: expiresAt,
      },
      create: {
        userId: userData.id,
        code: verificationCode,
        expiresAt: expiresAt,
      },
    });

    throw new AppError(httpStatus.FORBIDDEN, "Verify your account first");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      role: userData.role,
      email: userData.email,
    },
    config.jwt.jwt_secret!,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      role: userData.role,
      email: userData.email,
    },
    config.jwt.refresh_token_secret!,
    config.jwt.refresh_token_expires_in as string
  );
  const { password, ...restOfUserData } = userData;

  return {
    userData: restOfUserData,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as string);
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      role: userData.role,
      email: userData.email,
    },
    config.jwt.jwt_secret!,
    config.jwt.expires_in!
  );

  return {
    accessToken,
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const resetPassToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.reset_pass_secret!,
    config.jwt.reset_pass_token_expires_in!
  );

  const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

  await sendEmail({
    email: userData.email,
    subject: "Reset Your Password",
    message: `Click the link to reset your password: ${resetPassLink}`,
    htmlMessage: resetPasswordEmail(resetPassLink),
  });
};

const resetPassword = async (token: string, payload: { id: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = jwtHelpers.verifyToken(token, config.jwt.reset_pass_secret!);

  if (!isValidToken) {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden!");
  }

  // hash password
  const password = await bcrypt.hash(payload.password, 12);

  // update into database
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });

  return null;
};

export const AuthServices = {
  registerUser,
  verifyEmail,
  resendVerificationCode,
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
};
