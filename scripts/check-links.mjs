import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const outputDirectory = resolve("dist");

if (!existsSync(outputDirectory)) {
  throw new Error("dist does not exist. Run the production build first.");
}

function listFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

const htmlFiles = listFiles(outputDirectory).filter(
  (path) => extname(path).toLowerCase() === ".html"
);
const missing = [];

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, "utf8");
  const attributes = html.matchAll(/(?:href|src)=["']([^"']+)["']/g);

  for (const [, rawTarget] of attributes) {
    if (
      !rawTarget ||
      rawTarget.startsWith("#") ||
      rawTarget.startsWith("http://") ||
      rawTarget.startsWith("https://") ||
      rawTarget.startsWith("mailto:") ||
      rawTarget.startsWith("tel:") ||
      rawTarget.startsWith("data:") ||
      rawTarget.startsWith("/.netlify/")
    ) {
      continue;
    }

    const pathOnly = rawTarget.split(/[?#]/)[0];
    let targetPath;

    if (pathOnly === "/" || pathOnly === "") {
      targetPath = join(outputDirectory, "index.html");
    } else if (pathOnly.startsWith("/")) {
      targetPath = join(outputDirectory, pathOnly.slice(1));
    } else {
      targetPath = resolve(htmlFile, "..", pathOnly);
    }

    if (!existsSync(targetPath)) {
      missing.push(
        `${relative(outputDirectory, htmlFile)} -> ${rawTarget}`
      );
    }
  }
}

if (missing.length) {
  throw new Error(`Missing internal targets:\n${missing.join("\n")}`);
}

console.log(`Validated internal targets across ${htmlFiles.length} HTML pages.`);
