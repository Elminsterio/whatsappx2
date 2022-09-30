"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
class UserModel {
    constructor() {
        this.userSchema = new mongoose_1.Schema({
            creationDate: { type: Date, default: Date.now },
            email: { type: String, required: true },
            name: { type: String, required: true },
            password: { type: String, required: true },
            active: { type: Boolean, default: true },
        });
        this.userSchema.methods.toJSON = function () {
            let user = this;
            let userObject = user.toObject();
            delete userObject.password;
            return userObject;
        };
        this.model = (0, mongoose_1.model)("User", this.userSchema);
    }
}
exports.UserModel = UserModel;
