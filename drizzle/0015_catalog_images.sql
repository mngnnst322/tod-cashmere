ALTER TABLE `catalog_items` ADD `images` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
-- Existing cover photos become each item's first gallery photo.
UPDATE `catalog_items` SET `images` = json_array(`image`) WHERE `image` IS NOT NULL;
