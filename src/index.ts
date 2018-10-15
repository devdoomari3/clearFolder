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
export type ClearRule = {
  action: ACTIONS;
  matcher: MatchFuncType;
  children?: ClearRule[];
}

export enum ACTIONS {
  DELETE,
  KEEP,
}

export function KEEP (
  matcher: MatchFuncType,
  children?: ClearRule[],
): ClearRule {
  return {
    action: ACTIONS.KEEP,
    matcher,
    children,
  }
}

export function DEL (
  matcher: MatchFuncType,
  children?: ClearRule[],
): ClearRule {
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
  clearRules: ClearRule[];
  action: ACTIONS;
}): Promise<CLEAR_RESULT> {
  const {
    fullPath,
    stat: _stat,
    clearRules,
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
        const ruleMatchResults = clearRules.map(clearRule => ({
          ...clearRule,
          result: clearRule.matcher({
            fullPath: childFullPath,
            stat: childStat,
            parsedPath,
          }),
        }))

        const matchingRules = ruleMatchResults
          .filter(
            mr =>
              mr.result === MatcherResult.isMatch,
          )
        const nestedRules = ruleMatchResults
          .filter(
            mr => mr.result === MatcherResult.toChildren,
          )
          .map(mr => omit(mr, 'result') as ClearRule)
        const effective = last(matchingRules)
        const childClearRules = flatten(
          matchingRules
            .filter(me => me.children)
            .map(me => me.children!),
        )
        const childAction = (effective &&
                            effective.action) || action

        const childResult = await clearFs({
          fullPath: childFullPath,
          stat: childStat,
          action: childAction,
          clearRules: nestedRules.concat(childClearRules),
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
