"use strict";
exports.__esModule = true;
exports.Matrix = void 0;
var rpi_ws281x_native_1 = require("rpi-ws281x-native");
var Matrix = /** @class */ (function () {
    function Matrix(options) {
        this.height = options.height;
        this.width = options.width;
        this.getPixelId = options.getPixelId;
        this.ledCount = options.ledCount;
        this.channel = (0, rpi_ws281x_native_1["default"])(this.ledCount, {
            gpio: 18,
            invert: false,
            brightness: 255,
            stripType: rpi_ws281x_native_1["default"].stripType.WS2812
        });
    }
    Object.defineProperty(Matrix.prototype, "Height", {
        get: function () {
            return this.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "Width", {
        get: function () {
            return this.width;
        },
        enumerable: false,
        configurable: true
    });
    Matrix.prototype.setPixel = function (x, y, color) {
        var index = this.getPixelId(x, y);
        this.channel.array[index] = color;
    };
    Matrix.prototype.getPixel = function (x, y) {
        var index = this.getPixelId(x, y);
        return this.channel.array[index];
    };
    Matrix.prototype.render = function () {
        rpi_ws281x_native_1["default"].render();
    };
    Matrix.prototype.clear = function () {
        rpi_ws281x_native_1["default"].reset();
    };
    return Matrix;
}());
exports.Matrix = Matrix;
