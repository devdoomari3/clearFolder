"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// FIXME: move to external library?
var fs_extra_1 = __importDefault(require("fs-extra"));
var flatten_1 = __importDefault(require("lodash/flatten"));
var last_1 = __importDefault(require("lodash/last"));
var omit_1 = __importDefault(require("lodash/omit"));
var path_1 = __importDefault(require("path"));
var matchers_1 = require("./matchers");
exports.m = matchers_1.m;
var ACTIONS;
(function (ACTIONS) {
    ACTIONS[ACTIONS["DELETE"] = 0] = "DELETE";
    ACTIONS[ACTIONS["KEEP"] = 1] = "KEEP";
})(ACTIONS = exports.ACTIONS || (exports.ACTIONS = {}));
function KEEP(matcher, children) {
    return {
        action: ACTIONS.KEEP,
        matcher: matcher,
        children: children,
    };
}
exports.KEEP = KEEP;
function DEL(matcher, children) {
    return {
        action: ACTIONS.DELETE,
        matcher: matcher,
        children: children,
    };
}
exports.DEL = DEL;
var CLEAR_RESULT;
(function (CLEAR_RESULT) {
    CLEAR_RESULT[CLEAR_RESULT["NOT_EMPTY"] = 0] = "NOT_EMPTY";
    CLEAR_RESULT[CLEAR_RESULT["EMPTIED"] = 1] = "EMPTIED";
})(CLEAR_RESULT = exports.CLEAR_RESULT || (exports.CLEAR_RESULT = {}));
function clearFs(args) {
    return __awaiter(this, void 0, void 0, function () {
        var fullPath, _stat, matchEntries, action, stat, _a, children, childrenResult, notEmptied;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fullPath = args.fullPath, _stat = args.stat, matchEntries = args.matchEntries, action = args.action;
                    _a = _stat;
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, fs_extra_1.default.stat(fullPath)];
                case 1:
                    _a = (_b.sent());
                    _b.label = 2;
                case 2:
                    stat = _a;
                    if (!stat.isDirectory()) return [3 /*break*/, 8];
                    return [4 /*yield*/, fs_extra_1.default.readdir(fullPath)];
                case 3:
                    children = _b.sent();
                    return [4 /*yield*/, Promise.all(children.map(function (childPath) { return __awaiter(_this, void 0, void 0, function () {
                            var childFullPath, childStat, parsedPath, matchResults, matchingEntries, nestedEntries, effective, childMatchEntries, childAction, childResult;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        childFullPath = path_1.default.join(fullPath, childPath);
                                        return [4 /*yield*/, fs_extra_1.default.stat(childFullPath)];
                                    case 1:
                                        childStat = _a.sent();
                                        parsedPath = path_1.default.parse(childFullPath);
                                        matchResults = matchEntries.map(function (matchEntry) { return (__assign({}, matchEntry, { result: matchEntry.matcher({
                                                fullPath: childFullPath,
                                                stat: childStat,
                                                parsedPath: parsedPath,
                                            }) })); });
                                        matchingEntries = matchResults
                                            .filter(function (mr) {
                                            return mr.result === matchers_1.MatcherResult.isMatch;
                                        });
                                        nestedEntries = matchResults
                                            .filter(function (mr) { return mr.result === matchers_1.MatcherResult.toChildren; })
                                            .map(function (mr) { return omit_1.default(mr, 'result'); });
                                        effective = last_1.default(matchingEntries);
                                        childMatchEntries = flatten_1.default(matchingEntries
                                            .filter(function (me) { return me.children; })
                                            .map(function (me) { return me.children; }));
                                        childAction = (effective &&
                                            effective.action) || action;
                                        return [4 /*yield*/, clearFs({
                                                fullPath: childFullPath,
                                                stat: childStat,
                                                action: childAction,
                                                matchEntries: nestedEntries.concat(childMatchEntries),
                                            })];
                                    case 2:
                                        childResult = _a.sent();
                                        return [2 /*return*/, {
                                                childResult: childResult,
                                                childFullPath: childFullPath,
                                                childStat: childStat,
                                            }];
                                }
                            });
                        }); }))];
                case 4:
                    childrenResult = _b.sent();
                    if (!(action === ACTIONS.DELETE)) return [3 /*break*/, 7];
                    notEmptied = childrenResult.find(function (cr) { return cr.childResult === CLEAR_RESULT.NOT_EMPTY; });
                    if (!!notEmptied) return [3 /*break*/, 6];
                    return [4 /*yield*/, fs_extra_1.default.rmdir(fullPath)];
                case 5:
                    _b.sent();
                    return [2 /*return*/, CLEAR_RESULT.EMPTIED];
                case 6: return [2 /*return*/, CLEAR_RESULT.NOT_EMPTY];
                case 7: return [2 /*return*/, CLEAR_RESULT.NOT_EMPTY];
                case 8:
                    if (action === ACTIONS.KEEP) {
                        return [2 /*return*/, CLEAR_RESULT.NOT_EMPTY];
                    }
                    if (!stat.isFile()) return [3 /*break*/, 10];
                    return [4 /*yield*/, fs_extra_1.default.unlink(fullPath)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10: return [2 /*return*/, CLEAR_RESULT.EMPTIED];
            }
        });
    });
}
exports.clearFs = clearFs;