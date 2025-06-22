import { generateMetadata } from "@tryforge/forgescript"
import * as path from "path"

// Generate metadata for the extension functions
generateMetadata(path.join(__dirname, "../dist/functions"))
  .then(() => {
    console.log("Documentation generated successfully!")
  })
  .catch((error: any) => {
    console.error("Error generating documentation:", error)
  })
