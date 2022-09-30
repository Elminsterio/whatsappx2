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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const UserRepositoryImpl_1 = require("Data/Repositories/UserRepositoryImpl");
const UserMongoDataSource_1 = __importDefault(require("Data/DataSources/Mongodb/UserMongoDataSource"));
const UserSchema_1 = require("Data/DataSources/Mongodb/MongoModels/UserSchema");
const userValidator_1 = __importDefault(require("../../Validators/userValidator"));
class UserRoutes {
    constructor(_userController) {
        this.userController = _userController;
    }
    registerRoutes() {
        const router = (0, express_1.Router)();
        const installGetUsersRoute = (req, res, next) => this.getUsers(req, res, next);
        router.get('/', installGetUsersRoute);
        const installCreateUsersRoute = (req, res, next) => this.createUser(req, res, next);
        router.post('/', userValidator_1.default, installCreateUsersRoute);
        const installUpdateUsersRoute = (req, res, next) => this.updateUser(req, res, next);
        router.patch('/:id', userValidator_1.default, installUpdateUsersRoute);
        const installDeleteUsersRoute = (req, res, next) => this.deleteUser(req, res, next);
        router.delete('/:id', installDeleteUsersRoute);
        const installGetUsersByIdRoute = (req, res, next) => this.getUserById(req, res, next);
        router.get('/:id', installGetUsersByIdRoute);
        return router;
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userController.getUsers(req, res);
                return res.json({ results: users });
            }
            catch (error) {
                return next(error);
            }
        });
    }
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userController.createUser(req, res);
                return res.json({ result: user });
            }
            catch (error) {
                return next(error);
            }
        });
    }
    getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userController.getUserById(req, res);
                return res.json({ result: user });
            }
            catch (error) {
                return next(error);
            }
        });
    }
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userController.updateUser(req, res);
                return res.json({ result: user });
            }
            catch (error) {
                return next(error);
            }
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userController.deleteUser(req, res);
                return res.json({});
            }
            catch (error) {
                return next(error);
            }
        });
    }
}
exports.UserRoutes = UserRoutes;
UserRoutes.userRepo = new UserRepositoryImpl_1.UserRepositoryImpl(new UserMongoDataSource_1.default(new UserSchema_1.UserModel()));
