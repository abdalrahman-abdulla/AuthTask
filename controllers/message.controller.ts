import Validator from "../utility/validation";
import { Request, Response } from "express";

import * as validate from "validate.js";
import { errRes, okRes } from "../utility/util.service";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import CONFIG from "../config";

export default class MessageController {
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async getUsers(req: any, res: Response): Promise<object> {
    let users = await prisma.user.findMany({
      where: {
        NOT: {
          id: {
            equals: req.user.id,
          },
        },
      },
    });
    // return res
    return okRes(res, { users });
  }
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  static async getMessages(req: any, res: Response): Promise<object> {
    let id = parseInt(req.params.id);
    let user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) return errRes(res, `Invalid Reciver`);
    let messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [
              { senderId: { equals: req.user.id } },
              { reciverId: { equals: id } },
            ],
          },
          {
            AND: [
              { senderId: { equals: id } },
              { reciverId: { equals: req.user.id } },
            ],
          },
        ],
      },
    });

    // return res
    return okRes(res, { messages, user });
  }
}
