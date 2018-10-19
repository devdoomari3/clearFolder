Error.stackTraceLimit = 10000

module.exports = {
  "roots": [
    "<rootDir>/src",
    "<rootDir>/__tests__"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testMatch": [
    "**/__tests__/*.+(ts|tsx|js)"
  ],
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
}