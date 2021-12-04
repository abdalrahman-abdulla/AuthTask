import Validator from "../utility/validation";
import { Request, Response } from "express";

import * as validate from "validate.js";
import { errRes, okRes } from "../utility/util.service";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import CONFIG from "../config";

export default class AuthController {
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async register(req: Request, res: Response): Promise<object> {
    // get the body
    const body = req.body;
    // validate the req
    let notValid = validate(body, Validator.register());
    if (notValid) return errRes(res, notValid);

    // hash the password
    let salt = await bcrypt.genSalt(12);
    let password = await bcrypt.hash(body.password, salt);
    // check if the user already exists
    let user;
    user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    // if exists 
    if (user) {
      return errRes(res, `User ${body.email} is already exist`);
    } else {
      user = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password,
        },
      });
    }

    let token = jwt.sign({ id: user.id }, CONFIG.jwtUserSecret);

    // return res
    return okRes(res, { token,user });
  }

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async login(req: Request, res: Response): Promise<object> {
    // get body
    let body = req.body;
    // verify body
    let notValid = validate(body, Validator.login());
    if (notValid) return errRes(res, notValid);
    let user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) return errRes(res, `Please complete the registration process`);

    // compaire the password
    let check = await bcrypt.compare(body.password, user.password);
    if (!check) return errRes(res, "Incorrect credentials");

    // token
    let token = jwt.sign({ id: user.id }, CONFIG.jwtUserSecret);

    // return token
    return okRes(res, { token, user });
  }
}
