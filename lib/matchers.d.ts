/// <reference types="node" />
import fs from 'fs';
import path from 'path';
export declare enum MatcherResult {
    isMatch = 0,
    isNotMatch = 1,
    toChildren = 2
}
export declare type MatchFuncType = (args: {
    fullPath: string;
    parsedPath: path.ParsedPath;
    stat: fs.Stats;
}) => MatcherResult;
export declare const m: {
    file: typeof matchFile;
    folder: typeof matchFolder;
    ext: typeof matchExtension;
    nested: typeof matchNested;
    startsWith: typeof matchStartsWith;
    endsWith: typeof matchEndsWith;
};
export declare function matchFolder(folderName: string): MatchFuncType;
export declare function matchExtension(extension: string): MatchFuncType;
export declare function matchStartsWith(str: string): MatchFuncType;
export declare function matchEndsWith(str: string): MatchFuncType;
export declare function matchNested(childMatchFunc: MatchFuncType): MatchFuncType;
export declare function matchFile(fileName: string): MatchFuncType;
