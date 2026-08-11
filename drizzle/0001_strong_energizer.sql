CREATE TABLE `course_checkout_settings` (
	`course_slug` text PRIMARY KEY NOT NULL,
	`provider` text DEFAULT 'hotmart' NOT NULL,
	`checkout_url` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`updated_at` integer NOT NULL
);
