-- Point the shared catalog photos at the files added to public/images.
UPDATE `catalog_items` SET `image` = '/images/emegtei.png' WHERE `image` = '/images/katalog-women.jpg';
--> statement-breakpoint
UPDATE `catalog_items` SET `image` = '/images/eregtei.png' WHERE `image` = '/images/katalog-men.jpg';
