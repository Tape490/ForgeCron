import { generateMetadata } from "@tryforge/forgescript"

// Generate metadata for the extension functions
generateMetadata(__dirname + "/../dist/functions")
  .then(() => {
    console.log("Documentation generated successfully!")
  })
  .catch((error) => {
    console.error("Error generating documentation:", error)
  })
