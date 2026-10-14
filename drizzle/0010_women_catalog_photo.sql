-- One shared photo for every women's catalog item until each gets its own;
-- items that already have a photo keep it.
UPDATE `catalog_items` SET `image` = '/images/katalog-women.jpg' WHERE `gender` = 'women' AND `image` IS NULL;
