import { errRes } from "../../utility/util.service";
import * as jwt from "jsonwebtoken";
import CONFIG from "../../config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async (req, res, next) => {
  // get the token
  const token = req.headers.token;
  if (!token) return errRes(res, "You need to register");
  // verify token
  try {
    let payload: any;
    payload = jwt.verify(token, CONFIG.jwtUserSecret);

    // get user
    let user = await prisma.user.findUnique({ where: { id: payload.id } });

    // check user isVerified
    if (!user) return errRes(res, `Please verify your account`);
    req.user = user;
    // next
    return next();
  } catch (error) {
    return errRes(res, error, 401);
  }
};
