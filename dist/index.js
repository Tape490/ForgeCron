"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeCron = void 0;
const forgescript_1 = require("@tryforge/forgescript");
class ForgeCron extends forgescript_1.ForgeExtension {
    name = "ForgeCron";
    description = "A forgescript extension for cron job scheduling";
    version = "1.0.0";
    init() {
        this.load(__dirname + "/functions");
    }
}
exports.ForgeCron = ForgeCron;
