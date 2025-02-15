import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import ApiError from "../errors/ApiError";

const auth = (...roles: string[]) => {
  return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const verifiedUser = jwtHelpers.verifyToken(token, config.jwt.jwt_secret!);

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
