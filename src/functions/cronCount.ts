import { ArgType, NativeFunction } from "@tryforge/forgescript"

export default new NativeFunction({
  name: "$cronCount",
  version: "1.0.0",
  description: "Returns the total number of active cron jobs",
  unwrap: true,
  brackets: false,
  args: [],
  output: ArgType.Number,
  execute(ctx: any) {
    try {
      // Initialize crons map if it doesn't exist
      if (!(ctx.client as any).crons) {
        ;(ctx.client as any).crons = new Map()
        return this.success(0)
      }

      // Return the count of active cron jobs
      const count = (ctx.client as any).crons.size
      return this.success(count)
    } catch (error) {
      // Return 0 on error
      return this.success(0)
    }
  },
})
