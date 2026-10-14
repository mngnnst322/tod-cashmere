-- One shared photo for every men's catalog item until each gets its own;
-- items that already have a photo keep it.
UPDATE `catalog_items` SET `image` = '/images/katalog-men.jpg' WHERE `gender` = 'men' AND `image` IS NULL;
