import * as express from "express";
import AuthController from "../controllers/auth.controller";
import MessageController from "../controllers/message.controller";
const route = express.Router();
import auth from "../middlewares/web/auth";

route.post("/login", AuthController.login);
route.post("/register", AuthController.register);

route.use(auth);
route.get("/users", MessageController.getUsers);
route.get("/messages/:id", MessageController.getMessages);
export default route;
