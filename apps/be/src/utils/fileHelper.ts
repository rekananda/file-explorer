import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

export function getFilePath(folderId?: string): string {
  const baseFolder = path.join(__dirname, "../../../../public/uploads");
  return folderId ? path.join(baseFolder, folderId) : baseFolder;
}

export async function createTextFile(fileName: string, content: string, folderId?: string): Promise<string> {
  try {
    const folderPath = getFilePath(folderId);
    await mkdir(folderPath, { recursive: true });
    const filePath = path.join(folderPath, `${fileName}.txt`);
    await writeFile(filePath, content, "utf-8");

    return `${folderId ? folderId + "/" : ""}${fileName}.txt`;
  } catch (error) {
    console.error("Error creating text file:", error);
    throw new Error("Failed to create text file.");
  }
}

export async function modifyTextFile(fileName: string, content: string): Promise<string> {
  try {
    const folderPath = getFilePath();
    const filePath = path.join(folderPath, fileName);
    await writeFile(filePath, content, "utf-8");

    return fileName;
  } catch (error) {
    console.error("Error creating text file:", error);
    throw new Error("Failed to create text file.");
  }
}

export async function saveUploadedFile(file: File, folderId?: string): Promise<string> {
  try {
    const folderPath = getFilePath(folderId);
    await mkdir(folderPath, { recursive: true });
    const filePath = path.join(folderPath, file.name);
    await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    return `${folderId ? folderId + "/" : ""}${file.name}`;
  } catch (error) {
    console.error("Error saving uploaded file:", error);
    throw new Error("Failed to save uploaded file.");
  }
}

export async function deleteFileFromDisk(filePath: string): Promise<void> {
  try {
    await unlink(filePath);
    console.log(`File deleted: ${filePath}`);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.warn(`File not found, skipping: ${filePath}`);
    } else {
      console.error("Error deleting file:", error);
      throw new Error("Failed to delete file.");
    }
  }
}


