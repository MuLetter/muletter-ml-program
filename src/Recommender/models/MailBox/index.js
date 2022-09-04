"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailBoxModel = void 0;
const mongoose_1 = require("mongoose");
const MailBoxSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imagePath: { type: String, required: false },
    tracks: [{ type: mongoose_1.Schema.Types.Mixed, required: false }],
}, {
    collection: "MailBox",
    timestamps: true,
});
exports.MailBoxModel = (0, mongoose_1.model)("MailBox", MailBoxSchema);
