import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { RequestDonar } from "./request.interface";
import { RequestServices } from "./request.service";

const createRequest = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const result = await RequestServices.createRequest(req.user as IAuthUser, req.body as RequestDonar);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Request Successful",
    data: result,
  });
});

const getMyDonationRequest = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const options = pick(req.query, ["limit", "page"]);
  const result = await RequestServices.getMyDonationRequest(req.user as IAuthUser, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Success Message",
    data: result,
  });
});

const getRequestToDonate = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const options = pick(req.query, ["limit", "page"]);
  const result = await RequestServices.getRequestToDonate(req.user as IAuthUser, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Success Message",
    data: result,
  });
});

const UpdateRequestStatus = catchAsync(async (req, res) => {
  const result = await RequestServices.UpdateRequestStatus(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Success Message",
    data: result,
  });
});

export const RequestControllers = {
  createRequest,
  getMyDonationRequest,
  getRequestToDonate,
  UpdateRequestStatus,
};
