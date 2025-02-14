import { Prisma, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import { userSearchAbleFields } from "./user.constant";
import httpStatus from "http-status";

const getDonorsList = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { date, searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      availability: true,
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      availability: true,
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  if (params.date) {
    andCondions.push({
      availability: true,
      profile: {
        lastDonationDate: {
          lt: date,
        },
      },
    });
  }

  const whereConditons: Prisma.UserWhereInput =
    andCondions.length > 0
      ? { AND: andCondions }
      : {
          availability: true,
        };

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      bloodGroup: true,
      city: true,
      gender: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      isEmailVerified: true,
      role: true,
      profile: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleDonor = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      bloodGroup: true,
      city: true,
      gender: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      isEmailVerified: true,
      role: true,
      profile: true,
    },
  });
};

const getMyProfile = async (user: IAuthUser) => {
  return await prisma.user.findUnique({
    where: { email: user?.email },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      bloodGroup: true,
      city: true,
      gender: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      isEmailVerified: true,
      role: true,
      profile: true,
    },
  });
};

const updateMyProfile = async (user: IAuthUser, payload: Record<string, string>) => {
  const itsMe = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (!itsMe) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You re not authorized to update your profile");
  }

  const userData = {
    name: payload.name,
    email: payload.email,
    bloodGroup: payload.bloodGroup,
    city: payload.city,
    gender: payload.gender,
    availability: payload.availability,
  };

  const result = await prisma.$transaction(async (transactionClient: any) => {
    // Update existing user
    const { password, ...updatedUser } = await transactionClient.user.update({
      where: { id: user?.id },
      data: userData,
    });

    const profileData = {
      age: payload.age,
      bio: payload.bio,
      photo: payload.photo,
      lastDonationDate: payload.lastDonationDate,
    };

    // Update profile if exists, otherwise create a new one
    const updatedProfile = await transactionClient.profile.upsert({
      where: { userId: user?.id }, // Check if the profile exists
      update: profileData, // Update existing profile
      create: { ...profileData, userId: user?.id }, // Create a new profile if it doesn't exist
    });

    return {
      ...updatedUser,
      profile: updatedProfile,
    };
  });

  return result;
};

const changePassword = async (
  user: IAuthUser,
  payload: {
    oldPassword: string;
    newPassword: string;
  }
) => {
  const userInfo = await prisma.user.findUnique({
    where: { email: user?.email },
  });

  if (!userInfo) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You must be logged in");
  }

  const isMatch = await bcrypt.compare(payload.oldPassword, userInfo.password);
  if (!isMatch) {
    throw new AppError(400, "Old password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

  await prisma.user.update({
    where: { email: user?.email },
    data: { password: hashedPassword },
  });

  return { message: "Password updated successfully" };
};

const makeAdmin = async (user: IAuthUser, payload: { email: string }) => {
  const isAdmin = await prisma.user.findUnique({
    where: { email: user?.email, role: UserRole.ADMIN },
  });

  if (!isAdmin) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your are not authorized !!");
  }

  const userInfo = await prisma.user.findUnique({
    where: { email: payload?.email },
  });

  if (!userInfo) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.user.update({
    where: { email: payload.email },
    data: { role: UserRole.ADMIN },
  });

  return result;
};

const changeUserStatus = async ({ email, status }: { status: UserStatus; email: string }) => {
  const userInfo = await prisma.user.findUnique({
    where: { email },
  });

  if (!userInfo) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.user.update({
    where: { email },
    data: { status: status },
  });

  return result;
};

export const UserServices = {
  getDonorsList,
  getSingleDonor,
  getMyProfile,
  updateMyProfile,
  changePassword,
  makeAdmin,
  changeUserStatus,
};
