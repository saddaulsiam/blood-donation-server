import * as bcrypt from "bcrypt";
import { Request } from "express";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";

const registerUser = async (req: Request) => {
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    name: req.body.name,
    email: req.body.email,
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

    return {
      ...others,
      profile: createdProfile,
    };
  });

  return result;
};

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      // status: UserStatus.ACTIVE,
    },
    include: {
      profile: true,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      id: userData.id,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      // role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );
  const { password, ...restOfUserData } = userData;

  return {
    userData: restOfUserData,
    accessToken,
    refreshToken,
  };
};

// const refreshToken = async (token: string) => {
//   let decodedData;
//   try {
//     decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret);
//   } catch (err) {
//     throw new Error("You are not authorized!");
//   }

//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: decodedData.email,
//       status: UserStatus.ACTIVE,
//     },
//   });

//   const accessToken = jwtHelpers.generateToken(
//     {
//       email: userData.email,
//       role: userData.role,
//     },
//     config.jwt.jwt_secret as Secret,
//     config.jwt.expires_in as string
//   );

//   return {
//     accessToken,
//     needPasswordChange: userData.needPasswordChange,
//   };
// };

// const changePassword = async (user: any, payload: any) => {
//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: user.email,
//       status: UserStatus.ACTIVE,
//     },
//   });

//   const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

//   if (!isCorrectPassword) {
//     throw new Error("Password incorrect!");
//   }

//   const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

//   await prisma.user.update({
//     where: {
//       email: userData.email,
//     },
//     data: {
//       password: hashedPassword,
//       needPasswordChange: false,
//     },
//   });

//   return {
//     message: "Password changed successfully!",
//   };
// };

// const forgotPassword = async (payload: { email: string }) => {
//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: payload.email,
//       status: UserStatus.ACTIVE,
//     },
//   });

//   const resetPassToken = jwtHelpers.generateToken(
//     { email: userData.email, role: userData.role },
//     config.jwt.reset_pass_secret as Secret,
//     config.jwt.reset_pass_token_expires_in as string
//   );
//   //console.log(resetPassToken)

//   const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

//   await emailSender(
//     userData.email,
//     `
//         <div>
//             <p>Dear User,</p>
//             <p>Your password reset link
//                 <a href=${resetPassLink}>
//                     <button>
//                         Reset Password
//                     </button>
//                 </a>
//             </p>

//         </div>
//         `
//   );
//   //console.log(resetPassLink)
// };

// const resetPassword = async (token: string, payload: { id: string; password: string }) => {
//   console.log({ token, payload });

//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       id: payload.id,
//       status: UserStatus.ACTIVE,
//     },
//   });

//   const isValidToken = jwtHelpers.verifyToken(token, config.jwt.reset_pass_secret as Secret);

//   if (!isValidToken) {
//     throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
//   }

//   // hash password
//   const password = await bcrypt.hash(payload.password, 12);

//   // update into database
//   await prisma.user.update({
//     where: {
//       id: payload.id,
//     },
//     data: {
//       password,
//     },
//   });
// };

export const AuthServices = {
  registerUser,
  loginUser,
  // refreshToken,
  // changePassword,
  // forgotPassword,
  // resetPassword,
};
