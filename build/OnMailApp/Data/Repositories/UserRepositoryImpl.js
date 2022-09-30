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
exports.UserRepositoryImpl = void 0;
class UserRepositoryImpl {
    constructor(_datasource) {
        this.dataSource = _datasource;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dataSource.get();
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dataSource.getById(id);
        });
    }
    getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dataSource.getByEmail(email);
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dataSource.create(user);
        });
    }
    edit(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dataSource.edit(id, user);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dataSource.delete(id);
        });
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;
