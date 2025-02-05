import { db, FolderInsertT, FolderTreeT, FolderUpdateT, schema } from '@database';
import { and, eq, inArray, isNull, like, ne } from 'drizzle-orm';
import { ApiReturnWrapper } from 'src/utils/validationWrapper';
import { fileSchema } from '../../../../database/schema';

const { folderSchema } = schema;

export default class FolderService {

  async getFolderHierarchy(folderId?: string) {
    const folders: any[] = await db
      .select()
      .from(folderSchema)
      .where(folderId ? eq(folderSchema.parentId, folderId) : isNull(folderSchema.parentId));

    const foldersWithChildren: any[] = await Promise.all(
      folders.map(async (folder) => {
        const children = await this.getFolderTree(folder.id);
        return {
          ...folder,
          ...(children.data.length > 0 ? { childs: children.data } : {}),
        };
      })
    );
    return foldersWithChildren;
  }

  async getFolderPath(path: string = "/", parentId?: string) {
    let result: string = path;
    if (parentId) {
      const parent = await db.query.folderSchema.findFirst({
        where: and(eq(folderSchema.id, parentId), eq(folderSchema.status, true)),
      })
      result = `/${parent?.name}${result}`;
      if (parent?.parentId) {
        result = await this.getFolderPath(result, parent.parentId);
      }
    }

    return result;
  }

  async createFolder(values: FolderInsertT) {
    const existData = await db.query.folderSchema.findMany({
      where: and(
        like(folderSchema.name, `${values.name}%`), 
        eq(folderSchema.status, true), 
        values.parentId ? eq(folderSchema.parentId, values.parentId) : isNull(folderSchema.parentId))
    });
    if (existData.length > 0) {
      values.name = `${values.name} (${existData.length + 1})`;
    }
    return ApiReturnWrapper(await db.insert(folderSchema).values(values).returning().then(([data]) => data));
  }

  async editFolderName(id: string, values: FolderUpdateT) {
    const existData = await db.query.folderSchema.findMany({
      where: and(ne(folderSchema.id, id), like(folderSchema.name, `%${values.name}`)),
    });
    if (existData.length > 0) {
      values.name = `${values.name} (${existData.length + 2})`;
    }
    return ApiReturnWrapper(await db.update(folderSchema).set(values).where(eq(folderSchema.id, id)).returning().then(([data]) => data));
  }

  async deleteFolder(ids: string[]) {
    const datas = await db.query.folderSchema.findMany({
      where: and(inArray(folderSchema.id, ids), eq(folderSchema.status, true)),
      orderBy: (folderSchema, { asc }) => [asc(folderSchema.name)],
    });
    try {
      await db.update(folderSchema).set({status: false}).where(inArray(folderSchema.id, ids)).returning();

      return ApiReturnWrapper([], 
        datas.length > 1 ? `${datas.length} Folder deleted successfully` : 
        datas.length === 1 ? `Folder '${datas[0].name}' deleted successfully` : "Deleted successfully", 200);
    } catch (error) {
      return ApiReturnWrapper(null, "Failed to delete", 500);
    }
  }

  async getFolderContents(folderId?: string) {
    let data:any = null;
    let path: string = "/";
    if (folderId) {
      data = await db.query.folderSchema.findFirst({
        where: and(eq(folderSchema.id, folderId), eq(folderSchema.status, true)),
      })
      path = await this.getFolderPath(path, folderId);
    }

    const folders = await db.query.folderSchema.findMany({
      where: and(folderId ? eq(folderSchema.parentId, folderId) : isNull(folderSchema.parentId), eq(folderSchema.status, true)),
      orderBy: (folderSchema, { asc }) => [asc(folderSchema.name)],
    })

    const files = await db.query.fileSchema.findMany({
      where: and(folderId ? eq(fileSchema.folderId, folderId) : isNull(fileSchema.folderId), eq(fileSchema.status, true)),
      orderBy: (fileSchema, { asc }) => [asc(fileSchema.name)],
    })

    return ApiReturnWrapper({
      folder:data, 
      folders, 
      files,
      path,
    });
  }
  
  async getFolderTree(folderId?: string) {
    return ApiReturnWrapper(await this.getFolderHierarchy(folderId));
  }
}

