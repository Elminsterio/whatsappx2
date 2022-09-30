"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = require("Domain/Entities/Errors");
class UserMongoDataSourceImpl {
    constructor(userModel) {
        this.userModel = userModel.model;
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserOnDB = yield this.userModel.find({ email: user.email });
            if (isUserOnDB.length)
                throw new Errors_1.ErrorBDEntityFound('Username already exists on database');
            const newUser = new this.userModel(user);
            return yield newUser.save();
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userModel.find({});
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserOnDB = yield this.userModel.findById({ _id: id });
            if (!isUserOnDB)
                throw new Errors_1.ErrorBDEntityNotFound('');
            return isUserOnDB;
        });
    }
    getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserOnDB = yield this.userModel.find({ email });
            if (!isUserOnDB.length)
                throw new Errors_1.ErrorBDEntityNotFound('');
            return isUserOnDB[0];
        });
    }
    edit(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userModel.findByIdAndUpdate(id, user, { new: true, runValidators: true });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userModel.findByIdAndDelete(id, { runValidators: true });
        });
    }
}
exports.default = UserMongoDataSourceImpl;
