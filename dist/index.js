"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeCron = void 0;
const forgescript_1 = require("@tryforge/forgescript");
class ForgeCron extends forgescript_1.ForgeExtension {
    constructor() {
        super(...arguments);
        this.name = "ForgeCron";
        this.description = "A cron-based scheduler extension for ForgeScript";
        this.version = "1.0.0";
    }
    init() {
        this.load(__dirname + "/functions");
    }
}
exports.ForgeCron = ForgeCron;
exports.default = ForgeCron;
