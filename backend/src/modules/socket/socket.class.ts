import { Socket } from "socket.io";
import { User } from "../user/user.entity";

export class SocketClass extends Socket {
  public user: User;
}