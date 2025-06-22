"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../../structures");
exports.default = new structures_1.NativeFunction({
    name: "$channelManageable",
    description: "Returns whether the channel is manageable",
    unwrap: true,
    brackets: false,
    args: [
        {
            name: "channel ID",
            description: "The id of the channel",
            rest: false,
            type: structures_1.ArgType.Channel,
            required: true,
        },
    ],
    output: structures_1.ArgType.Boolean,
    execute(ctx, [ch]) {
        const chan = ch ?? ctx.channel;
        return this.success(chan && "manageable" in chan ? chan.manageable : false);
    },
});
//# sourceMappingURL=channelManageable.js.map