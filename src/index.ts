// FIXME: move to external library?
import fs from 'fs-extra'
import flatten from 'lodash/flatten'
import last from 'lodash/last'
import omit from 'lodash/omit'
import path from 'path'
import {
  m,
  MatcherResult,
  MatchFuncType,
} from './matchers'

export {
  m,
}

/* eslint-disable no-use-before-define */
export type MatchEntry = {
  action: ACTIONS;
  matcher: MatchFuncType;
  children?: MatchEntry[];
}

export enum ACTIONS {
  DELETE,
  KEEP,
}

export function KEEP (
  matcher: MatchFuncType,
  children?: MatchEntry[],
): MatchEntry {
  return {
    action: ACTIONS.KEEP,
    matcher,
    children,
  }
}

export function DEL (
  matcher: MatchFuncType,
  children?: MatchEntry[],
): MatchEntry {
  return {
    action: ACTIONS.DELETE,
    matcher,
    children,
  }
}

export enum CLEAR_RESULT {
  NOT_EMPTY,
  EMPTIED,
}

export async function clearFs (args: {
  fullPath: string;
  stat?: fs.Stats;
  matchEntries: MatchEntry[];
  action: ACTIONS;
}): Promise<CLEAR_RESULT> {
  const {
    fullPath,
    stat: _stat,
    matchEntries,
    action,
  } = args
  const stat = _stat || await fs.stat(fullPath)

  if (stat.isDirectory()) {
    // maybe: move to 'clearFolder'
    const children = await fs.readdir(fullPath)
    const childrenResult = await Promise.all(
      children.map(async childPath => {
        const childFullPath = path.join(fullPath, childPath)
        const childStat = await fs.stat(childFullPath)
        const parsedPath = path.parse(childFullPath)
        const matchResults = matchEntries.map(matchEntry => ({
          ...matchEntry,
          result: matchEntry.matcher({
            fullPath: childFullPath,
            stat: childStat,
            parsedPath,
          }),
        }))

        const matchingEntries = matchResults
          .filter(
            mr =>
              mr.result === MatcherResult.isMatch,
          )
        const nestedEntries = matchResults
          .filter(
            mr => mr.result === MatcherResult.toChildren,
          )
          .map(mr => omit(mr, 'result') as MatchEntry)
        const effective = last(matchingEntries)
        const childMatchEntries = flatten(
          matchingEntries
            .filter(me => me.children)
            .map(me => me.children!),
        )
        const childAction = (effective &&
                            effective.action) || action

        const childResult = await clearFs({
          fullPath: childFullPath,
          stat: childStat,
          action: childAction,
          matchEntries: nestedEntries.concat(childMatchEntries),
        })

        return {
          childResult,
          childFullPath,
          childStat,
        }
      }),
    )
    if (action === ACTIONS.DELETE) {
      const notEmptied = childrenResult.find(
        cr => cr.childResult === CLEAR_RESULT.NOT_EMPTY,
      )
      if (!notEmptied) {
        await fs.rmdir(fullPath)

        return CLEAR_RESULT.EMPTIED
      }

      return CLEAR_RESULT.NOT_EMPTY
    }

    return CLEAR_RESULT.NOT_EMPTY
  }
  if (action === ACTIONS.KEEP) {
    return CLEAR_RESULT.NOT_EMPTY
  }

  if (stat.isFile()) {
    await fs.unlink(fullPath)
  }

  return CLEAR_RESULT.EMPTIED
}
