"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
// Generate metadata for the extension functions
(0, forgescript_1.generateMetadata)(__dirname + "/../dist/functions")
    .then(() => {
    console.log("Documentation generated successfully!");
})
    .catch((error) => {
    console.error("Error generating documentation:", error);
});
