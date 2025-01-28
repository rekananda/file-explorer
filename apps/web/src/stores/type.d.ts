import type { FolderT, FolderTreeT } from "@database";

export interface MainStore {
  currentFolder: FolderT | null,
  folderTree: FolderTreeT[],
  displayFolder: {
    folders: FolderT[],
    files: FileT[],
  },
  path: string;
}