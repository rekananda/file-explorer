import { db, FileCreateT, FileInsertT, FileUpdateT, FileUploadT, schema } from '@database';
import { randomBytes } from 'crypto';
import { and, eq, inArray, like, ne } from 'drizzle-orm';
import { writeFile } from 'fs/promises';
import path from 'path';
import { createTextFile, modifyTextFile, saveUploadedFile } from 'src/utils/fileHelper';
import { ApiReturnWrapper } from 'src/utils/validationWrapper';

const { fileSchema } = schema;

export default class FileService {
  async createFile(values: FileInsertT) {
    const existData = await db.query.fileSchema.findMany({
      where: and(like(fileSchema.name, `${values.name}%`), eq(fileSchema.status, true))
    });
    if (existData.length > 0) {
      values.name = `${values.name} (${existData.length + 1})`;
    }
    return ApiReturnWrapper(await db.insert(fileSchema).values(values).returning().then(([data]) => data));
  }

  async editFileName(id: string, values: FileUpdateT) {
    const existData = await db.query.fileSchema.findMany({
      where: and(ne(fileSchema.id, id), like(fileSchema.name, `%${values.name}`)),
    });
    if (existData.length > 0) {
      values.name = `${values.name} (${existData.length + 2})`;
    }
    return ApiReturnWrapper(await db.update(fileSchema).set(values).where(eq(fileSchema.id, id)).returning().then(([data]) => data));
  }

  async deleteFile(ids: string[]) {
    const datas = await db.query.fileSchema.findMany({
      where: and(inArray(fileSchema.id, ids), eq(fileSchema.status, true)),
      orderBy: (fileSchema, { asc }) => [asc(fileSchema.name)],
    });
    try {
      await db.update(fileSchema).set({status: false}).where(inArray(fileSchema.id, ids)).returning();

      return ApiReturnWrapper([], 
        datas.length > 1 ? `${datas.length} Files deleted successfully` : 
        datas.length === 1 ? `File '${datas[0].name}' deleted successfully` : "Deleted successfully", 200);
    } catch (error) {
      return ApiReturnWrapper(null, "Failed to delete", 500);
    }
  }

  async writeTextFile(values: FileCreateT) {
    const randomString = randomBytes(30).toString('hex');
    const filePath = await createTextFile(randomString, values.text ?? "", values.folderId);

    return await this.createFile({
      name: `${values.name}`,
      type: "text",
      size: values.text ? Buffer.byteLength(values.text) : 0,
      asset: filePath,
      folderId: values.folderId,
    })
  }

  async editTextFile(id: string, value: string) {
    const fileData = await db.query.fileSchema.findFirst({
      where: eq(fileSchema.id, id),
    });
    if (!fileData) {
      return ApiReturnWrapper(null, "File not found", 404);
    }

    await modifyTextFile(fileData.asset, value);

    return ApiReturnWrapper(await db.update(fileSchema).set({size: value ? Buffer.byteLength(value) : 0,}).where(eq(fileSchema.id, id)).returning().then(([data]) => data));
  }

  async uploadFile(values: FileUploadT) {
    for (const file of values.files) {
      const filePath = await saveUploadedFile(file, values.folderId);

      await this.createFile({
        name: `${file.name.split('.').slice(0, -1).join('.')}`,
        type: file.type.includes('image') ? 'image' : file.type.includes('pdf') || file.type.includes('word') ? 'document' : 'other',
        size: file.size,
        asset: filePath,
        folderId: values.folderId,
      })
    }
    return ApiReturnWrapper(null, "Uploaded successfully", 200);
  }
}
