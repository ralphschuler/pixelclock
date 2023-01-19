"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpi_ws281x_native_1 = __importDefault(require("rpi-ws281x-native"));
const Matrix_1 = require("../../src/matrix/Matrix");
const FRAMES_PER_SECOND = 15;
function getPixelIdByXY(x, y) {
    let id = 0;
    if (x % 2 === 0) {
        id = x / 2 + y * (width + 1);
    }
    else {
        id = width + 1 - x + x / 2 + y * (width + 1);
    }
    return Math.floor(id);
}
function getPixelXYById(id) {
    const x = Math.floor(id / (height + 1)) * 2;
    const y = id % (height + 1);
    return { x, y };
}
function intToRgb(color) {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    return { r, g, b };
}
function floodFill(colors, floodSpeed = 1) {
    const colorCount = colors.length;
    const interval = (y = 0) => {
        for (let x = 0; x < width; x++) {
            matrix.setPixel(x, y, colors[Math.floor(Math.random() * colorCount)]);
        }
        matrix.render();
        y++;
        if (y < height) {
            setTimeout(() => interval(y), 1000 / FRAMES_PER_SECOND / floodSpeed);
        }
    };
    interval();
}
function blendColors(from, to, blendAmount) {
    const fromColor = intToRgb(from);
    const toColor = intToRgb(to);
    const r = Math.floor(fromColor.r + (toColor.r - fromColor.r) * (blendAmount / 100));
    const g = Math.floor(fromColor.g + (toColor.g - fromColor.g) * (blendAmount / 100));
    const b = Math.floor(fromColor.b + (toColor.b - fromColor.b) * (blendAmount / 100));
    return rgbToInt(r, g, b);
}
const height = 5;
const width = 17;
const matrix = new Matrix_1.Matrix({
    height: height,
    width: width,
    ledCount: 90,
    getPixelId: getPixelIdByXY,
});
function fillScreen(color, blendAmount = 2) {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const currentColor = matrix.getPixel(x, y);
            matrix.setPixel(x, y, blendColors(currentColor, color, blendAmount));
        }
    }
    matrix.render();
}
function colorWheel(pos) {
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
function hexToInt(hex) {
    return parseInt(hex.replace("#", ""), 16);
}
function intToHex(color) {
    return "#" + color.toString(16);
}
function hexToHsl(hex) {
    const rgb = hexToRgb(hex);
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
}
function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}
function rgbToHsl(r, g, b) {
    (r /= 255), (g /= 255), (b /= 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let hue = 0, saturation = 0, lightness = (max + min) / 2;
    if (max == min) {
        hue = saturation = 0; // achromatic
    }
    else {
        const d = max - min;
        saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                hue = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                hue = (b - r) / d + 2;
                break;
            case b:
                hue = (r - g) / d + 4;
                break;
        }
        hue /= 6;
    }
    return { h: hue, s: saturation, l: lightness };
}
function hslToInt(h, s, l) {
    let r, g, b;
    if (s == 0) {
        r = g = b = l; // achromatic
    }
    else {
        const hue2rgb = (p, q, t) => {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return rgbToInt(r * 255, g * 255, b * 255);
}
function getDarkerVariant(color, amount) {
    const rgb = intToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.h -= amount / 100;
    return hslToInt(hsl.h, hsl.s, hsl.l);
}
function getLighterVariant(color, amount) {
    const rgb = intToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.h += amount / 100;
    return hslToInt(hsl.h, hsl.s, hsl.l);
}
function randomFloodFill() {
    const color = colorWheel(Math.floor(Math.random() * 256));
    const colors = [
        ...Array(10)
            .fill(null)
            .map((_, i) => getLighterVariant(color, i * 2)),
        ...Array(10)
            .fill(null)
            .map((_, i) => getDarkerVariant(color, i * 2))
    ];
    floodFill(colors, 3);
}
function exitSafely() {
    fillScreen(rgbToInt(0, 0, 0));
    rpi_ws281x_native_1.default.reset();
    rpi_ws281x_native_1.default.finalize();
    process.nextTick(function () { process.exit(0); });
}
function main() {
    process.on('SIGINT', exitSafely);
    process.on('SIGTERM', exitSafely);
    process.on('SIGQUIT', exitSafely);
    process.on('SIGHUP', exitSafely);
    process.on('SIGBREAK', exitSafely);
    process.on('uncaughtException', exitSafely);
    randomFloodFill();
    console.log("Starting...");
    console.log("Press Ctrl+C to exit.");
    let offset = 0;
    setInterval(() => {
        fillScreen(rgbToInt(0, 0, 0), 5);
        if (offset % 100 === 0) {
            randomFloodFill();
        }
        const actionsCount = Math.floor(Math.random() * 10);
        for (let i = actionsCount; i < 1; i++) {
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);
            const currentColor = matrix.getPixel(x, y);
            const wheelColor = colorWheel(Math.floor(Math.random() * 256));
            const newColor = blendColors(currentColor, wheelColor, 5);
            matrix.setPixel(x, y, newColor);
            matrix.render();
            offset++;
        }
        matrix.render();
    }, 1000 / FRAMES_PER_SECOND);
    (process === null || process === void 0 ? void 0 : process.send) && process.send('ready');
}
console.time("main");
main();
console.timeEnd("main");
