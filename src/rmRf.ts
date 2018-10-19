import rimraf from 'rimraf';

export function rmRf(src: string) {
  return new Promise((resolve, reject) => {
    rimraf(src, resolve);
  });
}
