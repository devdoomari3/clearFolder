import * as fs from 'fs-extra';
import _ from 'lodash';
import { ncp } from 'ncp';
import * as path from 'path';
import {
  ACTIONS,
  clearFs,
  ClearRule,
  DEL,
  KEEP,
  m,
} from '../src';
import {
  rmRf,
} from '../src/rmRf';

export function copyDir(src: string, dest: string) {
  return new Promise((resolve, reject) => {
    ncp(src, dest, err => {
      if (err) { reject(err); }
      resolve();
    });
  });
}

describe('[utils] clearFolder should...', () => {
  let fixturePath: string;
  let fixtureTemplatePath: string;
  beforeEach(async () => {
    fixturePath = path.join(__dirname, 'fixtures', 'clearFolder');
    fixtureTemplatePath = path.join(__dirname, 'fixtures', 'clearFolderTemplate');
    await rmRf(fixturePath);
    await copyDir(fixtureTemplatePath, fixturePath);
  });

  it('clean up properly', async () => {
    const mustSurvivePaths = [
      path.join(fixturePath, 'toDelWithKeep', 'toKeep'),
      path.join(
        fixturePath,
        'toDelWithNestedKeep',
        'folderA',
        'folderB',
        'toSurvive.txt',
      ),
      path.join(fixturePath, 'toKeep'),
    ];
    const mustBeRemovedPaths = [
      path.join(fixturePath, 'toDelWithKeep', 'toDel'),
      path.join(fixturePath, 'toDelWithKeep', 'broken-symlink'),
      path.join(
        fixturePath,
        'toDelWithNestedKeep',
        'folderA',
        'folderB',
        'toDel.txt',
      ),
      path.join(
        fixturePath,
        'toDelWithNestedKeep',
        'toDel',
      ),
    ];
    const clearRules: ClearRule[] = [
      KEEP(m.folder('toKeep')),
      DEL(m.folder('toDelWithKeep'), [
        KEEP(m.folder('toKeep')),
      ]),
      DEL(m.folder('toDelWithNestedKeep'), [
        KEEP(m.nested(m.file('toSurvive.txt'))),
      ]),
    ];
    await clearFs({
      fullPath: fixturePath,
      clearRules,
      action: ACTIONS.DELETE,
    });
    const mustBeRemovedResults = await Promise.all(
      mustBeRemovedPaths.map(
        toRemovePath => fs.pathExists(toRemovePath),
      ),
    );
    expect(
      _(mustBeRemovedResults).every(exists => !exists),
    ).toBeTruthy();
    const mustSurviveResults = await Promise.all(
      mustSurvivePaths.map(
        mustSurvivePath => fs.pathExists(mustSurvivePath),
      ),
    );
    expect(
      _(mustSurviveResults).every(exists => exists),
    );
  });
});
