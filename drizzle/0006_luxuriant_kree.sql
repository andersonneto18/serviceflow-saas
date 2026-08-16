CREATE TABLE "job_materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"description" text NOT NULL,
	"quantity" numeric(10, 2) DEFAULT '1' NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_materials" ADD CONSTRAINT "job_materials_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;