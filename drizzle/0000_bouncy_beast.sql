CREATE TABLE "file" (
	"id" uuid PRIMARY KEY DEFAULT 'gen_random_uuid()' NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"size" varchar(50) NOT NULL,
	"asset" varchar(255) NOT NULL,
	"folder_id" uuid,
	"status" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "folder" (
	"id" uuid PRIMARY KEY DEFAULT 'gen_random_uuid()' NOT NULL,
	"name" varchar(255) NOT NULL,
	"parent_id" uuid DEFAULT null,
	"status" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_folder_id_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folder"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder" ADD CONSTRAINT "folder_parent_id_folder_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folder"("id") ON DELETE cascade ON UPDATE no action;