/// <reference types="node" />
import fs from 'fs-extra';
import { m, MatchFuncType } from './matchers';
export { m, };
export declare type ClearRule = {
    action: ACTIONS;
    matcher: MatchFuncType;
    children?: ClearRule[];
};
export declare enum ACTIONS {
    DELETE = 0,
    KEEP = 1
}
export declare function KEEP(matcher: MatchFuncType, children?: ClearRule[]): ClearRule;
export declare function DEL(matcher: MatchFuncType, children?: ClearRule[]): ClearRule;
export declare enum CLEAR_RESULT {
    NOT_EMPTY = 0,
    EMPTIED = 1
}
export declare function clearFs(args: {
    fullPath: string;
    stat?: fs.Stats;
    clearRules: ClearRule[];
    action: ACTIONS;
}): Promise<CLEAR_RESULT>;
