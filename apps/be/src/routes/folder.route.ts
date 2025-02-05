import { FolderDeleteT, FolderInsertT, FolderUpdateT } from "@database";
import Elysia from "elysia";
import FolderService from "src/services/folder.service";
import { createFolderSchema, deleteFolderSchema, editFolderNameSchema } from "src/utils/folderValidators";
import { validateWithErrorKey } from "src/utils/validationWrapper";

const folderService = new FolderService();

const folderRoutes = (app: Elysia) => {
  app.post('/folder', async ({ body }) => {
    const validatedData = validateWithErrorKey<FolderInsertT>(createFolderSchema, body);
    return folderService.createFolder(validatedData);
  });

  app.patch('/folder/:id', async ({ params, body }) => {
    const { id } = params;
    const validatedData = validateWithErrorKey<FolderUpdateT>(editFolderNameSchema, body);
    return folderService.editFolderName(id, validatedData);
  });

  app.delete('/folder', async ({ body }) => {
    const validatedData = validateWithErrorKey<FolderDeleteT>(deleteFolderSchema, body);
    return folderService.deleteFolder(validatedData.id);
  });

  app.get('/folder/:id?', async ({ params }) => {
    const { id } = params;
    return folderService.getFolderContents(id);
  });

  app.get('/folder/tree/:id?', async ({ params }) => {
    const { id } = params;
    return folderService.getFolderTree(id);
  });
};

export default folderRoutes;
