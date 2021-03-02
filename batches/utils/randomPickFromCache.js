/*
 * # usage
 * const pool = randomSampleInCache(array, 5);
 * const elem = pool.pick();
 *
 * TODO: clamp cacheNum in [0 ... list.length]
 */

const _ = require("lodash-es");

module.exports = (list, cacheNum = 1) => {
  if (list.length === 1) cacheNum = 0;
  const cached = new Array(cacheNum);
  const indexes = _.range(list.length);
  function pick() {
    const diffIndexes = _.difference(indexes, cached);
    const pickIndex = _.sample(diffIndexes);
    if (cacheNum > 0) {
      cached.push(pickIndex);
      if (cached.length > cacheNum) cached.shift();
    }
    return list[pickIndex];
  }
  return {
    list,
    pick,
  };
};
