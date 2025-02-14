import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { requestFilterableFields } from "./request.constant";
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

const getRequestsList = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, requestFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await RequestServices.getRequestsList(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Requests data fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleRequest = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await RequestServices.getSingleRequest(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Request data fetched successfully",
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

const updateRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await RequestServices.updateRequestStatus(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Success Message",
    data: result,
  });
});

const compleatRemainder = catchAsync(async (req: Request, res: Response) => {
  const result = await RequestServices.compleatRemainder(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Remainder send successfully",
    data: result,
  });
});

export const RequestControllers = {
  createRequest,
  getRequestsList,
  getSingleRequest,
  getMyDonationRequest,
  getRequestToDonate,
  updateRequestStatus,
  compleatRemainder,
};
