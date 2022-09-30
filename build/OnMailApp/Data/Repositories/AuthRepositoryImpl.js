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
exports.AuthRepositoryImpl = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Errors_1 = require("Domain/Entities/Errors");
class AuthRepositoryImpl {
    genSalt() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.genSalt(13);
        });
    }
    hash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield this.genSalt();
            return yield bcryptjs_1.default.hash(password, salt);
        });
    }
    compareHashes(passwordIn, passwordKept) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compare(passwordIn, passwordKept);
        });
    }
    signToken(user) {
        // TODO: Decidir donde se deben filtrar los datos que sean payload.
        return jsonwebtoken_1.default.sign(Object.assign({}, user), 'secret', { expiresIn: 300 });
    }
    verifyToken(bearerToken) {
        if (!bearerToken)
            throw new Errors_1.UnathorizedError('Bearer token is not provided or is invalid');
        const rawToken = bearerToken.split(' ');
        const token = rawToken[0];
        return jsonwebtoken_1.default.verify(token, 'secret', (error, decoded) => {
            return decoded;
        });
    }
}
exports.AuthRepositoryImpl = AuthRepositoryImpl;
