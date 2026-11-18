CREATE TABLE `lookbook_layers` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`model_id` text NOT NULL,
	`slot` text NOT NULL,
	`image` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`model_id`) REFERENCES `lookbook_models`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `lookbook_models` (
	`id` text PRIMARY KEY NOT NULL,
	`gender` text NOT NULL,
	`image` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `products` ADD `lookbook_gender` text;--> statement-breakpoint
ALTER TABLE `products` ADD `lookbook_type` text;