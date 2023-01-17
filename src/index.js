"use strict";
exports.__esModule = true;
var Matrix_1 = require("./Matrix");
var FRAMES_PER_SECOND = 1;
function getPixelId(x, y) {
    var id = 0;
    if (x % 2 === 0) {
        id = x / 2 + y * (width + 1);
    }
    else {
        id = width + 1 - x + x / 2 + y * (width + 1);
    }
    return Math.floor(id);
}
var height = 5;
var width = 17;
var matrix = new Matrix_1.Matrix({
    height: height,
    width: width,
    ledCount: 90,
    getPixelId: getPixelId
});
function fillScreen(color) {
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            matrix.setPixel(x, y, color);
            matrix.render();
        }
    }
}
function colorwheel(pos) {
    pos = 255 - pos;
    if (pos < 85) {
        return rgbToInt(255 - pos * 3, 0, pos * 3);
    }
    else if (pos < 170) {
        pos -= 85;
        return rgbToInt(0, pos * 3, 255 - pos * 3);
    }
    else {
        pos -= 170;
        return rgbToInt(pos * 3, 255 - pos * 3, 0);
    }
}
function rgbToInt(r, g, b) {
    return (r << 16) | (g << 8) | b;
}
console.log("Starting...");
console.log("Press Ctrl+C to exit.");
var offset = 0;
setInterval(function () {
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            matrix.setPixel(x, y, colorwheel((x + y + offset) % 256));
            matrix.render();
            offset++;
        }
    }
}, 1000 / FRAMES_PER_SECOND);
