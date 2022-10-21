import { User } from "../../../../OnMailApp/Domain/Entities/User";
import { Model } from "mongoose";

export interface UserModelI {
  model: Model<User>;
}