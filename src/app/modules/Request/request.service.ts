import httpStatus from "http-status";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import { RequestDonar, Status } from "./request.interface";

const createRequest = async (user: IAuthUser, payload: RequestDonar) => {
  // Check if donor exists
  const donor = await prisma.user.findUnique({
    where: {
      id: payload.donorId,
    },
  });

  if (!donor) {
    throw new AppError(httpStatus.NOT_FOUND, "Donor not found");
  }

  // Check if requester exists
  const requester = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (!requester) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your are not authorized");
  }

  // Create the request
  const result = await prisma.request.create({
    data: {
      donorId: payload.donorId,
      requesterId: requester.id,
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      dateOfDonation: payload.dateOfDonation,
      hospitalName: payload.hospitalName,
      city: payload.city,
      message: payload.message,
    },
    // include: {
    //   donor: {
    //     select: {
    //       id: true,
    //       name: true,
    //       email: true,
    //       bloodGroup: true,
    //       availability: true,
    //       createdAt: true,
    //       updatedAt: true,
    //       profile: true,
    //     },
    //   },
    // },
  });

  return result;
};

const getMyDonationRequest = async (user: IAuthUser, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const result = await prisma.request.findMany({
    where: {
      donorId: user?.id,
    },
    skip,
    take: limit,
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          password: false,
          bloodGroup: true,
          availability: false,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  const total = await prisma.request.count({
    where: { donorId: user?.id },
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

const getRequestToDonate = async (user: IAuthUser, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const result = await prisma.request.findMany({
    where: {
      requesterId: user?.id,
    },
    skip,
    take: limit,
    include: {
      donor: {
        select: {
          id: true,
          name: true,
          email: true,
          password: false,
          bloodGroup: true,
          availability: false,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  const total = await prisma.request.count({
    where: {
      requesterId: user?.id,
    },
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

const UpdateRequestStatus = async (id: string, payload: Status) => {
  return await prisma.request.update({
    where: {
      id: id,
    },
    data: {
      status: payload.status,
    },
  });
};

export const RequestServices = {
  createRequest,
  getMyDonationRequest,
  getRequestToDonate,
  UpdateRequestStatus,
};
