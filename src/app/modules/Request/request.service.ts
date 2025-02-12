import { RequestStatus } from "@prisma/client";
import httpStatus from "http-status";

import { paginationHelper } from "../../../helpers/paginationHelper";
import { sendEmail } from "../../../helpers/sendEmail";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import { RequestDonar, Status } from "./request.interface";
import {
  approvalNotificationEmail,
  cancellationNotificationEmail,
  requestConfirmationEmail,
} from "../../../helpers/generateEmail";

const createRequest = async (user: IAuthUser, payload: RequestDonar) => {
  // Check if donor exists
  const donor = await prisma.user.findUnique({
    where: {
      id: payload.donorId,
    },
    include: {
      profile: true,
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
  });

  await prisma.user.update({
    where: {
      id: payload.donorId,
    },
    data: {
      availability: false,
    },
  });

  // 1️⃣ Send confirmation email to the requester
  await sendEmail({
    email: requester.email,
    subject: "Your Blood Donation Request is Submitted",
    message: `Dear ${requester.name}, your blood donation request has been successfully submitted.`,
    htmlMessage: requestConfirmationEmail(
      requester.name, // Requester as recipient
      donor.name, // Donor's name
      donor.bloodGroup!,
      payload.city,
      payload.hospitalName,
      donor.phoneNumber,
      payload.dateOfDonation!,
      result.id!,
      payload.message,
      false // false = email for requester
    ),
  });

  // 2️⃣ Send email notification to the donor
  await sendEmail({
    email: donor.email,
    subject: "You Have Been Selected for Blood Donation",
    message: `Dear ${donor.name}, you have been matched for an urgent blood donation request.`,
    htmlMessage: requestConfirmationEmail(
      donor.name, // Donor as recipient
      requester.name, // Requester's name
      donor.bloodGroup!,
      payload.city,
      payload.hospitalName,
      payload.phoneNumber,
      payload.dateOfDonation!,
      result.id!,
      payload.message,
      true // true = email for donor
    ),
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
          phoneNumber: true,
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
          phoneNumber: true,
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
  const result = await prisma.request.update({
    where: {
      id: id,
    },
    data: {
      status: payload.status,
    },
    include: {
      donor: true,
      requester: true,
    },
  });

  if (payload.status === RequestStatus.APPROVED) {
    // Send email to the donor
    await sendEmail({
      email: result.donor.email,
      subject: "You Approved a Blood Donation Request!",
      htmlMessage: approvalNotificationEmail(
        result.donor.name,
        result.requester.name,
        result.donor.bloodGroup!,
        result.city,
        result.hospitalName,
        result.phoneNumber,
        result.dateOfDonation,
        result.id,
        true
      ),
    });

    // Send email to the requester
    await sendEmail({
      email: result.requester.email,
      subject: "Your Blood Donation Request Has Been Approved!",
      htmlMessage: approvalNotificationEmail(
        result.requester.name,
        result.donor.name,
        result.donor.bloodGroup!,
        result.city,
        result.hospitalName,
        result.donor.phoneNumber,
        result.dateOfDonation,
        result.id,
        false
      ),
    });
  }

  if (payload.status === RequestStatus.CANCEL) {
    await prisma.user.update({
      where: {
        id: result.donor.id,
      },
      data: {
        availability: true,
      },
    });

    await sendEmail({
      email: result.donor.email,
      subject: "You Have Cancelled a Blood Donation Request",
      htmlMessage: cancellationNotificationEmail(
        result.donor.name,
        result.requester.name,
        result.donor.bloodGroup!,
        result.city,
        result.hospitalName,
        result.phoneNumber,
        result.dateOfDonation,
        result.id,
        true
      ),
    });

    await sendEmail({
      email: result.requester.email,
      subject: "Your Blood Donation Request Has Been Cancelled",
      htmlMessage: cancellationNotificationEmail(
        result.requester.name,
        result.donor.name,
        result.donor.bloodGroup!,
        result.city,
        result.hospitalName,
        result.donor.phoneNumber,
        result.dateOfDonation,
        result.id,
        false
      ),
    });
  }

  return result;
};

export const RequestServices = {
  createRequest,
  getMyDonationRequest,
  getRequestToDonate,
  UpdateRequestStatus,
};
