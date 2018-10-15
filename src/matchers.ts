import fs from 'fs'
import path from 'path'
import endsWith from 'lodash/endsWith'
import startsWith from 'lodash/startsWith'

export enum MatcherResult {
  isMatch,
  isNotMatch,
  toChildren,
}
export type MatchFuncType = (args: {
  fullPath: string;
  parsedPath: path.ParsedPath;
  stat: fs.Stats;
}) => MatcherResult

export const m = {
  file: matchFile,
  folder: matchFolder,
  ext: matchExtension,
  nested: matchNested,
  startsWith: matchStartsWith,
  endsWith: matchEndsWith,
}

export function matchFolder (
  folderName: string,
): MatchFuncType {
  return ({ parsedPath, stat }) =>
    stat.isDirectory() && folderName === parsedPath.base
      ? MatcherResult.isMatch
      : MatcherResult.isNotMatch
}

export function matchExtension (
  extension: string,
): MatchFuncType {
  return ({ fullPath, stat }) =>
    stat.isFile() && endsWith(fullPath, extension)
      ? MatcherResult.isMatch
      : MatcherResult.isNotMatch
}

export function matchStartsWith (
  str: string,
): MatchFuncType {
  return ({ parsedPath }) =>
    startsWith(parsedPath.base, str)
      ? MatcherResult.isMatch
      : MatcherResult.isNotMatch
}

export function matchEndsWith (
  str: string,
): MatchFuncType {
  return ({ parsedPath }) =>
    endsWith(parsedPath.base, str)
      ? MatcherResult.isMatch
      : MatcherResult.isNotMatch
}

export function matchNested (
  childMatchFunc: MatchFuncType,
): MatchFuncType {
  return matchFuncArgs => (
    childMatchFunc(matchFuncArgs) === MatcherResult.isMatch
      ? MatcherResult.isMatch
      : MatcherResult.toChildren
  )
}

export function matchFile (
  fileName: string,
): MatchFuncType {
  return ({ parsedPath, stat }) =>
    stat.isFile() && fileName === parsedPath.base
      ? MatcherResult.isMatch
      : MatcherResult.isNotMatch
}
