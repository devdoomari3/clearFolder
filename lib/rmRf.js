"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rimraf_1 = __importDefault(require("rimraf"));
function rmRf(src) {
    return new Promise(function (resolve, reject) {
        rimraf_1.default(src, resolve);
    });
}
exports.rmRf = rmRf;
