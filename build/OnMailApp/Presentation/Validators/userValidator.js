"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const createUserValidator = [
    (0, express_validator_1.check)('email', 'Enter a valid username').trim().escape(),
    (0, express_validator_1.check)('password', 'Password must be a minimum of 8 characters').isLength({
        min: 8,
        max: 20
    }).trim().escape(),
    (0, express_validator_1.check)('age', 'Enter a number').optional().isNumeric().escape(),
    (0, express_validator_1.check)('DNI', 'Please check the DNI or NIE introduced').optional().trim().escape(),
    (0, express_validator_1.check)('name', 'Enter a pseudonym').optional().trim().escape(),
    (0, express_validator_1.check)('verified', 'You cannot modify this attribute, please contact with an admin').optional().isBoolean().custom(bool => !bool)
];
exports.default = createUserValidator;
