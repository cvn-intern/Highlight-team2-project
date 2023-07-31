import { Socket } from "socket.io";
import { User } from "../user/user.entity";

export class SocketClient extends Socket {
  public user: User;
}