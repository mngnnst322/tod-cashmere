ALTER TABLE `products` ADD `images` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
-- Existing cover photos become each product's first gallery photo.
UPDATE `products` SET `images` = json_array(`image`);
