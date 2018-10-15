Clear-folder: clears files/folders with rules

Usage:

- see __tests__/clearfolder.spec.ts file

```typescript

const clearRules: ClearRule[] = [
  KEEP(m.folder('toKeep')),
  DEL(m.folder('toDelWithKeep'), [
    KEEP(m.folder('toKeep')),
  ]),
  DEL(m.folder('toDelWithNestedKeep'), [
    KEEP(m.nested(m.file('toSurvive.txt'))),
  ])
]
await clearFs({
  fullPath: fixturePath,
  clearRules,
  action: ACTIONS.DELETE,
})
```