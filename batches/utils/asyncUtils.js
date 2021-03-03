/**
 * promiseを直列実行
 *
 * @param {*} arr
 * @returns
 */
exports.execPromiseInSequence = (arr) => {
  return arr.reduce(
    (chained, func) => chained.then(func).catch(func),
    Promise.resolve()
  );
};
