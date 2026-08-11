CREATE TABLE `course_access_grants` (
	`id` text PRIMARY KEY NOT NULL,
	`token_hash` text NOT NULL,
	`buyer_name` text NOT NULL,
	`buyer_email` text NOT NULL,
	`course_slug` text NOT NULL,
	`invoice_url` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `course_access_grants_token_hash_unique` ON `course_access_grants` (`token_hash`);