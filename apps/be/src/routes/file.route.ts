import { FileCreateT, FileDeleteT, FileModifyT, FileUpdateT, FileUploadT } from "@database";
import Elysia, { t } from "elysia";
import FileService from "src/services/file.service";
import { createTextFileSchema, deleteFileSchema, editFileNameSchema, modifyTextFileSchema, uploadFileSchema } from "src/utils/fileValidators";
import { validateWithErrorKey } from "src/utils/validationWrapper";

const fileService = new FileService();

const fileRoutes = (app: Elysia) => {
  app.post('/file/text', async ({ body }) => {
    const validatedData = validateWithErrorKey<FileCreateT>(createTextFileSchema, body);
    return fileService.writeTextFile(validatedData);
  });

  app.post('/file/upload', async ({ body }) => {
    const validatedData = validateWithErrorKey<FileUploadT>(uploadFileSchema, body);
    return fileService.uploadFile(validatedData);
  })

  app.patch('/file/:id', async ({ params, body }) => {
    const { id } = params;
    const validatedData = validateWithErrorKey<FileUpdateT>(editFileNameSchema, body);
    return fileService.editFileName(id, validatedData);
  });

  app.patch('/file/modify/:id', async ({ params, body }) => {
    const { id } = params;
    const validatedData = validateWithErrorKey<FileModifyT>(modifyTextFileSchema, body);
    return fileService.editTextFile(id, validatedData.text);
  });

  app.delete('/file', async ({ body }) => {
    const validatedData = validateWithErrorKey<FileDeleteT>(deleteFileSchema, body);
    return fileService.deleteFile(validatedData.id);
  });
};

export default fileRoutes;
