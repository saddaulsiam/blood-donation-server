import { RequestStatus } from "@prisma/client";
import httpStatus from "http-status";
import { generateApprovalNotificationEmail } from "../../../helpers/generateApprovalNotificationEmail";
import { generateCancellationNotificationEmail } from "../../../helpers/generateCancellationNotificationEmail";
import { generateDonorNotificationEmail } from "../../../helpers/generateDonorNotificationEmail";
import { generateDonationRequestEmail } from "../../../helpers/generateRequestConfirmationEmail";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { sendEmail } from "../../../helpers/sendEmail";
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
  });

  //  Send confirmation email to the requester
  await sendEmail({
    email: requester.email,
    subject: "Your Blood Donation Request is Submitted",
    message: `Dear ${requester.name}, your blood donation request has been submitted successfully.`,
    htmlMessage: generateDonationRequestEmail(
      donor.name!,
      donor.bloodGroup!,
      donor.city!,
      payload.dateOfDonation!,
      result.id!,
      payload.message
    ),
  });

  // 2️⃣ Send email notification to donor
  await sendEmail({
    email: donor.email,
    subject: "You Have Been Selected for Blood Donation",
    message: `Dear ${donor.name}, you have been matched for an urgent blood donation request.`,
    htmlMessage: generateDonorNotificationEmail(
      donor.name,
      requester.name,
      donor.bloodGroup!,
      payload.city,
      payload.hospitalName,
      payload.phoneNumber,
      payload.dateOfDonation,
      result.id,
      payload.message
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
    await sendEmail({
      email: result.donor.email,
      subject: "Your Approved Blood Donation Request!",
      htmlMessage: generateApprovalNotificationEmail(
        result.requester.name,
        result.donor.name,
        result.donor.bloodGroup!,
        result.city,
        result.hospitalName,
        result.phoneNumber,
        result.dateOfDonation,
        result.id
      ),
    });
    await sendEmail({
      email: result.requester.email,
      subject: "Your Blood Donation Request Has Been Approved!",
      htmlMessage: generateApprovalNotificationEmail(
        result.requester.name,
        result.donor.name,
        result.donor.bloodGroup!,
        result.city,
        result.hospitalName,
        result.phoneNumber,
        result.dateOfDonation,
        result.id
      ),
    });
  }

  if (payload.status === RequestStatus.CANCEL) {
    await sendEmail({
      email: result.donor.email,
      subject: "Request Has Been Cancelled",
      htmlMessage: generateCancellationNotificationEmail(
        result.requester.name,
        result.donor.name,
        result.donor.bloodGroup!,
        result.city,
        result.hospitalName,
        result.phoneNumber,
        result.dateOfDonation,
        result.id
      ),
    });
    await sendEmail({
      email: result.requester.email,
      subject: "Your Blood Donation Request Has Been Cancelled",
      htmlMessage: generateCancellationNotificationEmail(
        result.requester.name,
        result.donor.name,
        result.donor.bloodGroup!,
        result.city,
        result.hospitalName,
        result.phoneNumber,
        result.dateOfDonation,
        result.id
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
