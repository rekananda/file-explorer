import { z } from "zod";

export const createTextFileSchema = z.object({
  name: z.string().min(1, "File name is required").max(255, "File name is too long"),
  text: z.string().optional(),
  folderId: z.string().uuid().optional(),
});

export const uploadFileSchema = z.object({
  files: z.array(z.any()),
  folderId: z.string().uuid().optional(),
});

export const editFileNameSchema = z.object({
  name: z.string().min(1, "New file name is required").max(255, "File name is too long"),
});

export const modifyTextFileSchema = z.object({
  text: z.string(),
});

export const moveCopyFileSchema = z.object({
  id: z.string().uuid("Invalid file ID"),
  targetFolderId: z.string().uuid("Invalid target folder ID"),
  copy: z.boolean().optional(),
});

export const deleteFileSchema = z.object({
  id: z.array(z.string().uuid({ message: "ID must be a valid UUID" })),
});
