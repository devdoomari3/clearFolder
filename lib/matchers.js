"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var endsWith_1 = __importDefault(require("lodash/endsWith"));
var startsWith_1 = __importDefault(require("lodash/startsWith"));
var MatcherResult;
(function (MatcherResult) {
    MatcherResult[MatcherResult["isMatch"] = 0] = "isMatch";
    MatcherResult[MatcherResult["isNotMatch"] = 1] = "isNotMatch";
    MatcherResult[MatcherResult["toChildren"] = 2] = "toChildren";
})(MatcherResult = exports.MatcherResult || (exports.MatcherResult = {}));
exports.m = {
    file: matchFile,
    folder: matchFolder,
    ext: matchExtension,
    nested: matchNested,
    startsWith: matchStartsWith,
    endsWith: matchEndsWith,
};
function matchFolder(folderName) {
    return function (_a) {
        var parsedPath = _a.parsedPath, stat = _a.stat;
        return stat.isDirectory() && folderName === parsedPath.base
            ? MatcherResult.isMatch
            : MatcherResult.isNotMatch;
    };
}
exports.matchFolder = matchFolder;
function matchExtension(extension) {
    return function (_a) {
        var fullPath = _a.fullPath, stat = _a.stat;
        return stat.isFile() && endsWith_1.default(fullPath, extension)
            ? MatcherResult.isMatch
            : MatcherResult.isNotMatch;
    };
}
exports.matchExtension = matchExtension;
function matchStartsWith(str) {
    return function (_a) {
        var parsedPath = _a.parsedPath;
        return startsWith_1.default(parsedPath.base, str)
            ? MatcherResult.isMatch
            : MatcherResult.isNotMatch;
    };
}
exports.matchStartsWith = matchStartsWith;
function matchEndsWith(str) {
    return function (_a) {
        var parsedPath = _a.parsedPath;
        return endsWith_1.default(parsedPath.base, str)
            ? MatcherResult.isMatch
            : MatcherResult.isNotMatch;
    };
}
exports.matchEndsWith = matchEndsWith;
function matchNested(childMatchFunc) {
    return function (matchFuncArgs) { return (childMatchFunc(matchFuncArgs) === MatcherResult.isMatch
        ? MatcherResult.isMatch
        : MatcherResult.toChildren); };
}
exports.matchNested = matchNested;
function matchFile(fileName) {
    return function (_a) {
        var parsedPath = _a.parsedPath, stat = _a.stat;
        return stat.isFile() && fileName === parsedPath.base
            ? MatcherResult.isMatch
            : MatcherResult.isNotMatch;
    };
}
exports.matchFile = matchFile;
