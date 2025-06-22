"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeFunction = exports.ArgType = void 0;
var ArgType;
(function (ArgType) {
    ArgType["String"] = "String";
    ArgType["Number"] = "Number";
    ArgType["Boolean"] = "Boolean";
    ArgType["Object"] = "Object";
    ArgType["Array"] = "Array";
    ArgType["Guild"] = "Guild";
    ArgType["Channel"] = "Channel";
    ArgType["Member"] = "Member";
    ArgType["User"] = "User";
    ArgType["Role"] = "Role";
    ArgType["Emoji"] = "Emoji";
    ArgType["Attachment"] = "Attachment";
    ArgType["Command"] = "Command";
    ArgType["Event"] = "Event";
    ArgType["Function"] = "Function";
})(ArgType || (exports.ArgType = ArgType = {}));
class NativeFunction {
    name;
    version;
    description;
    unwrap;
    brackets;
    args;
    output;
    data;
    execute;
    constructor(data) {
        this.name = data.name;
        this.version = data.version;
        this.description = data.description;
        this.unwrap = data.unwrap ?? false;
        this.brackets = data.brackets ?? false;
        this.args = data.args ?? [];
        this.output = data.output;
        this.data = data;
        this.execute = data.execute;
    }
    success(value) {
        return { success: true, value };
    }
    error(message) {
        return { success: false, error: message };
    }
    customError(message) {
        return this.error(message);
    }
}
exports.NativeFunction = NativeFunction;
