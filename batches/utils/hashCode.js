// refs: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
module.exports = (s) =>
  s.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
