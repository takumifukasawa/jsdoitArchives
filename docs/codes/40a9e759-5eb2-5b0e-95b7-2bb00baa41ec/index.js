function copyText () {
  var $target = document.querySelector('.copyTarget');
  if (!$target) {
    return false;
  }
  var range = document.createRange();
  range.selectNode($target);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand('copy');
  return false;
}
document.querySelector('.copyBtn').addEventListener('click', copyText, false);