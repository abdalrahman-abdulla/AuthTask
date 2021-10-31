import * as express from "express";
import { PrismaClient } from "@prisma/client";
import v1 from "../route/v1";
const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.use(v1);
app.listen(process.env.PORT || 3000, () => console.log(`Running on 3000`));
