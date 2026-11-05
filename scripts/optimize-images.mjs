
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const dir = "public/projects";
const files = (await readdir(dir)).filter((f) => /\.(png|jpe?g)$/i.test(f));

if (!files.length) {
  console.log("No PNG or JPG files found in", dir);
}

for (const f of files) {
  const out = path.join(dir, f.replace(/\.\w+$/, ".webp"));
  const info = await sharp(path.join(dir, f))
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  console.log(`${f} -> ${path.basename(out)}  ${Math.round(info.size / 1024)} KB  (${info.width}x${info.height})`);
}