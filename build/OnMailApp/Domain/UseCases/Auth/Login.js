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
exports.LoginUseCase = void 0;
const Errors_1 = require("../../Entities/Errors");
class LoginUseCase {
    constructor(_userRepository, _authRepository) {
        this.usersRepository = _userRepository;
        this.authRepository = _authRepository;
    }
    invoke(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExist = yield this.usersRepository.getByEmail(email);
            if (!userExist)
                throw new Errors_1.ErrorPwdOrUserNotFound('Password or user is incorrect');
            const correctPassword = yield this.authRepository.compareHashes(password, userExist.password);
            if (!correctPassword)
                throw new Errors_1.ErrorPwdOrUserNotFound('Password or user is incorrect');
            const token = this.authRepository.signToken(userExist);
            return { token, userExist };
        });
    }
}
exports.LoginUseCase = LoginUseCase;
