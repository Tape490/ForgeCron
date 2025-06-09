import { ForgeExtension } from "@tryforge/forgescript"

export class ForgeCron extends ForgeExtension {
  name = "ForgeCron"
  description = "A cron-based scheduler extension for ForgeScript"
  version = "1.0.0"

  public init() {
    this.load(__dirname + "/functions")
  }
}

export default ForgeCron
