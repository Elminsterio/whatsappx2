import { User } from "../../../../Domain/Entities/User";
import { Model } from "mongoose";

export interface UserModelI {
  model: Model<User>;
}