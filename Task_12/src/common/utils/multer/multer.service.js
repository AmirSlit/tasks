import { mkdir, readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { fileTypeFromBuffer } from "file-type";
import { BadRequestExceptions } from "../../exceptions/app.exceptions.js";
import { randomUUID } from "crypto";
import { unlink } from "fs/promises";

export async function processFile({
  file,
  acceptedFileTypes = [],
  folderName = "General",
}) {
  let fileContent;

  if (file.path) {
    const filePath = file.path;
    fileContent = await readFile(resolve(filePath));
  } else {
    fileContent = file.buffer;
  }

  const actualFileType = await fileTypeFromBuffer(fileContent);

  if (
    !actualFileType ||
    (acceptedFileTypes.length &&
      !acceptedFileTypes.includes(actualFileType.mime))
  ) {
    if (file.path) await unlink(file.path);
    throw BadRequestExceptions({ errMsg: "Invalid Actual File Format" });
  }

  if (!file.path) {
    const dirPath = `./assets/${folderName}`;
    const finalPath = `${dirPath}/${randomUUID()}.${actualFileType.ext}`;
    await mkdir(dirPath, { recursive: true });
    await writeFile(resolve(finalPath), fileContent);
    file.finalPath = finalPath;
  } else {
    file.finalPath = file.path;
  }
}
// req.files => [{},{}]
export async function processFiles({ files, acceptedFileTypes, folderName }) {
  for (const file of files) {
    await processFile({ file, acceptedFileTypes, folderName });
  }
}
// req.files => {profile-pic:[{},{}],cover-pic:[{},{}]}
export async function processFields({ fields, acceptedFileTypes, folderName }) {
  for (const key of Object.keys(fields)) {
    await processFiles({ files: fields[key], acceptedFileTypes, folderName });
  }
}
