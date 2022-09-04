"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomColor = void 0;
function generateRandomColor(length) {
    const colors = [];
    for (let i = 0; i < length; i++) {
        let color = Math.floor(Math.random() * 16777215).toString(16);
        while (color in colors) {
            color = Math.floor(Math.random() * 16777215).toString(16);
            console.log(color in colors);
        }
        colors.push(color);
    }
    return colors;
}
exports.generateRandomColor = generateRandomColor;
