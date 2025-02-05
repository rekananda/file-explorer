import { z } from "zod";

export const editFolderNameSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(255, "Folder name is too long"),
});

export const createFolderSchema = editFolderNameSchema.merge(z.object({
  parentId: z.string().uuid({ message: "Parent ID must be a valid UUID" }).optional(),
}));

export const deleteFolderSchema = z.object({
  id: z.array(z.string().uuid({ message: "ID must be a valid UUID" })),
});
