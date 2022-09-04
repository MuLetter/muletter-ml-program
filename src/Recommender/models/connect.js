"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.dbConnect = exports.dbDisconnect = void 0;
const mongoose_1 = require("mongoose");
function dbDisconnect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongoose_1.disconnect)();
            console.log("[mongoose] disconnected :)");
        }
        catch (err) {
            console.error("[mongoose] disconnect Error :(");
            console.error(err);
        }
    });
}
exports.dbDisconnect = dbDisconnect;
function dbConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        const { MONGO_HOST, MONGO_PORT, MONGO_APP } = process.env;
        const connectURL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_APP}`;
        try {
            yield (0, mongoose_1.connect)(connectURL);
            console.log("[mongoose] connected :)");
        }
        catch (err) {
            console.error("[mongoose] connect Error :(");
            console.error(err);
        }
    });
}
exports.dbConnect = dbConnect;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield dbConnect();
    });
}
exports.init = init;
