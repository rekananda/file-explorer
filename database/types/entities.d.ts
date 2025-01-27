import type { InferInsertModel, InferModelFromColumns, InferSelectModel } from 'drizzle-orm';
import * as schema from '../schema';

export type Folder = InferSelectModel<typeof schema.folderSchema>;
export type FolderInsertT = InferInsertModel<typeof schema.folderSchema>;
export type FolderUpdateT = Partial<FolderInsertT>;
export type FolderDeleteT = { id: string[] };

export type File = InferSelectModel<typeof schema.fileSchema>;
export type FileInsertT = InferInsertModel<typeof schema.fileSchema>;
export type FileCreateT = {name: string, text?: string, folderId?: string};
export type FileUpdateT = Partial<FileInsertT>;
export type FileDeleteT = { id: string[] };

