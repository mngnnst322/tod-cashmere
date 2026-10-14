CREATE TABLE `catalog_types` (
	`id` text PRIMARY KEY NOT NULL,
	`gender` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
-- Start with the women's and men's types from the printed catalog.
INSERT INTO `catalog_types` (`id`, `gender`, `name`, `sort_order`) VALUES
	('58a9717f-132a-40e6-bf38-7ffdbff91f40', 'women', 'Джемпер', 0),
	('fe5fcc30-3266-4ffe-8a80-06305d0d15b3', 'women', 'Свитер', 1),
	('192e82f8-8ac6-49b8-9703-deb4a41a2c2e', 'women', 'Пуловер', 2),
	('0a0f7f3d-5f24-4466-a265-e91c7bfce66b', 'women', 'Кардиган', 3),
	('b531084b-cf66-4091-9705-da95d4d85005', 'women', 'Цамц', 4),
	('36ac7b6d-cbfb-442d-b31a-01d7e44607c9', 'women', 'Майк', 5),
	('e4f0b682-93e9-440f-8dc7-4f8a02375d74', 'women', 'Жилет', 6),
	('a584b505-9683-45c0-8ab1-4d8a10dc48dc', 'women', 'Платье', 7),
	('37c9eb24-73ea-4f16-aff3-552111c0476a', 'women', 'Өмд', 8),
	('99987fb2-1b5b-436b-bcca-28f2b38d8dd6', 'women', 'Шорт', 9),
	('667d97ec-2cac-4daf-aed8-5339970bc157', 'women', 'Юбка', 10),
	('9fbc5cde-7719-4677-83c2-47dd2a131234', 'men', 'Цамц', 0),
	('66096847-78df-4035-86e3-4d0ad43deaec', 'men', 'Джемпер', 1),
	('d07889d5-ec42-4d6a-8927-56c5a7e5b7f8', 'men', 'Свитер', 2),
	('78b97f9f-5f0e-4b80-abb3-d58db71cdb4d', 'men', 'Кардиган', 3),
	('e75e523b-6931-4887-9564-42abdf2915b7', 'men', 'Бомбер', 4),
	('7d34e225-878c-4d64-bbaf-f3641f6ae13e', 'men', 'Поло', 5),
	('bda3dfb3-9506-4800-b29d-80467a773358', 'men', 'Майк', 6),
	('11d3cb88-516f-4d3c-9a9d-7ee30a17f2c5', 'men', 'Өмд', 7);
