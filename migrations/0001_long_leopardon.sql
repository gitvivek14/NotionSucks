ALTER TABLE "files" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "workspace_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "folder_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "folders" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "folders" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "folders" ALTER COLUMN "workspace_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "files" DROP COLUMN IF EXISTS "workspace_owner";--> statement-breakpoint
ALTER TABLE "files" DROP COLUMN IF EXISTS "logo";--> statement-breakpoint
ALTER TABLE "folders" DROP COLUMN IF EXISTS "workspace_owner";--> statement-breakpoint
ALTER TABLE "folders" DROP COLUMN IF EXISTS "logo";