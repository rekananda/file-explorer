import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  pgTable,
  uuid,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

export const folderSchema = pgTable("folder", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  parentId: uuid("parent_id").default(sql`null`).references(() : AnyPgColumn => folderSchema.id, { onDelete: "cascade" }),
  status: boolean("status").default(true).notNull(),
});

export const fileSchema = pgTable("file", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  size: bigint({ mode: 'number' }).notNull(),
  asset: varchar("asset", { length: 255 }).notNull(),
  folderId: uuid("folder_id").references(() => folderSchema.id, { onDelete: "cascade" }),
  status: boolean("status").notNull().default(true),
});

export const folderRelations = relations(folderSchema, ({ one, many }) => ({
  parent: one(folderSchema, {
    fields: [folderSchema.parentId],
    references: [folderSchema.id],
    relationName: "folders",
  }),
  childs: many(folderSchema, {
    relationName: "folders",
  }),
  files: many(fileSchema),
}));

export const fileRelations = relations(fileSchema, ({ one }) => ({
  folder: one(folderSchema, {
    fields: [fileSchema.folderId],
    references: [folderSchema.id],
  }),
}));

