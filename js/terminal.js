var terminal = document.getElementById('terminal');
var command = document.getElementById('command');
var sizeComputeText = document.getElementById('size-compute');
window.addEventListener('resize', function () { resizeFont(); });
document.addEventListener('readystatechange', function () { resizeFont(); });
function getOptimalFontSize() {
    var precision = 100;
    sizeComputeText.style.fontSize = precision + "px";
    var currentWidth = sizeComputeText.clientWidth;
    var desiredWidth = terminal.clientWidth;
    var targetWidth = desiredWidth - (desiredWidth / sizeComputeText.innerText.length * 2);
    var ratio = targetWidth / currentWidth;
    return precision * ratio;
}
function resizeFont() {
    setTimeout(function () {
        document.body.style.fontSize = getOptimalFontSize() + "px";
    });
}
function animateDisplay() {
}
function onType(el) {
    var value = el.value;
    el.value = "";
    // TODO split text and highlight it
}
