
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0b8d24a0c05e49a5ae4a70d9fcf68810)](https://app.codacy.com/app/devtest1mari/clearFolder?utm_source=github.com&utm_medium=referral&utm_content=devdoomari3/clearFolder&utm_campaign=Badge_Grade_Dashboard)

Clear-folder: clears files/folders with rules

## usage

- see `__tests__/clearfolder.spec.ts` file

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

## License
Do whatever you like (copy/fork/resell as-is😒/...) , except:
 - sue me for bugs
 - forget to link to this repo as the original / attribute
