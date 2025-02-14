import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { userFilterableFields } from "./user.constant";
import { UserServices } from "./user.service";

const getDonorsList = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await UserServices.getDonorsList(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users data fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleDonor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await UserServices.getSingleDonor(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User data fetched successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const user = req.user;
  const result = await UserServices.getMyProfile(user as IAuthUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User data fetched successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const result = await UserServices.updateMyProfile(req.user as IAuthUser, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile Updated Successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const result = await UserServices.changePassword(req.user as IAuthUser, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Change Successfully",
    data: result,
  });
});

const makeAdmin = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const result = await UserServices.makeAdmin(req.user as IAuthUser, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Make admin successfully",
    data: result,
  });
});

const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.changeUserStatus(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Change Status Successfully",
    data: result,
  });
});

export const UserControllers = {
  getDonorsList,
  getSingleDonor,
  getMyProfile,
  updateMyProfile,
  changePassword,
  makeAdmin,
  changeUserStatus,
};
