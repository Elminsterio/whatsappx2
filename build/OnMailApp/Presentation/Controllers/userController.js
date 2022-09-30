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
exports.UserController = void 0;
const express_validator_1 = require("express-validator");
const Errors_1 = require("Domain/Entities/Errors");
class UserController {
    constructor(_getUserUseCase, _createUserUseCase, _updateUserUseCase, _deleteUserUseCase, _getUserByIdUseCase) {
        this.getUserUseCase = _getUserUseCase;
        this.createUserUseCase = _createUserUseCase;
        this.updateUserUseCase = _updateUserUseCase;
        this.deleteUserUseCase = _deleteUserUseCase;
        this.getUserByIdUseCase = _getUserByIdUseCase;
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getUserUseCase.invoke();
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            return yield this.getUserByIdUseCase.invoke(id);
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            const messageError = JSON.stringify(errors.array());
            if (!errors.isEmpty())
                throw new Errors_1.MultipleValidationDataError(messageError);
            const { id } = req.params;
            const { name, email, password } = req.body;
            const user = { name, email, password };
            return yield this.updateUserUseCase.invoke(id, user);
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            return yield this.deleteUserUseCase.invoke(id);
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            const messageError = JSON.stringify(errors.array());
            if (!errors.isEmpty())
                throw new Errors_1.MultipleValidationDataError(messageError);
            const { creationDate, name, email, verified, img, offer, password } = req.body;
            const user = { creationDate, name, email, verified, img, offer, password };
            return yield this.createUserUseCase.invoke(user);
        });
    }
}
exports.UserController = UserController;
