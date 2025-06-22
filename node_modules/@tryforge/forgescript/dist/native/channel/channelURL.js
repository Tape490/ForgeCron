"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../../structures");
exports.default = new structures_1.NativeFunction({
    name: "$channelURL",
    description: "Returns the url of a channel",
    brackets: false,
    unwrap: true,
    args: [
        {
            name: "channel ID",
            description: "The id of the channel",
            rest: false,
            type: structures_1.ArgType.Channel,
            required: true,
        },
    ],
    output: structures_1.ArgType.URL,
    execute(ctx, [channel]) {
        return this.success((channel ?? ctx.channel)?.url);
    },
});
//# sourceMappingURL=channelURL.js.map