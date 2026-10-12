CREATE TABLE `catalog_items` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`material` text DEFAULT '' NOT NULL,
	`image` text,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` text PRIMARY KEY NOT NULL,
	`title_mn` text NOT NULL,
	`title_en` text,
	`title_ru` text,
	`title_zh` text,
	`body_mn` text NOT NULL,
	`body_en` text,
	`body_ru` text,
	`body_zh` text,
	`image` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
-- Hand-edited: drizzle-kit wanted to rebuild `orders` (DROP + recreate) just to
-- change the status default, which on D1 would cascade-delete order_items.
-- Instead add the column in place; the app always sets `status` explicitly.
ALTER TABLE `orders` ADD `user_id` text;--> statement-breakpoint
UPDATE `orders` SET `status` = 'new' WHERE `status` = 'pending';--> statement-breakpoint
UPDATE `orders` SET `status` = 'confirmed' WHERE `status` = 'paid';--> statement-breakpoint
UPDATE `orders` SET `status` = 'delivered' WHERE `status` = 'fulfilled';--> statement-breakpoint
ALTER TABLE `products` ADD `stock` integer;--> statement-breakpoint
ALTER TABLE `products` ADD `hidden` integer DEFAULT false NOT NULL;