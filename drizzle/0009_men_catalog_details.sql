-- Men's catalog, one item per style code as in the printed catalog.
-- Replaces the name-only men's items from 0006 with these names (no code, no
-- photo yet). Names not in the printed pages so far (поло, майк, ...) stay
-- until their details are known; anything edited in the admin is kept.
DELETE FROM `catalog_items` WHERE `gender` = 'men' AND `code` = '' AND `image` IS NULL AND `name` IN ('Алаг кардиган', 'Битүү кебельтэй свитер', 'Битүү кебельтэй цамц', 'Бомбер', 'Джемпер', 'Кардиган', 'Малгайтай цамц', 'Свитер', 'Товчтой кардиган', 'Цахилгаантай кардиган', 'Цахилгаантай кебельтэй кардиган', 'Өмд');
--> statement-breakpoint
INSERT INTO `catalog_items` (`id`, `type`, `name`, `code`, `material`, `colors`, `sizes`, `gender`, `image`, `sort_order`) VALUES
	('6fda29a3-cad8-4733-9c82-86f43008ad3b', 'Цамц', 'Битүү кебельтэй цамц', '07-01-001', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 0),
	('e840bf3f-785d-4a4c-bb26-6491bba66f44', 'Джемпер', 'Джемпер', '12-01-011', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 1),
	('e9ae5e7c-3370-4223-a474-ab516a7e02da', 'Джемпер', 'Джемпер', '07-01-037', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 2),
	('5b7dd313-f0fa-4b76-b25c-3feae305c7e4', 'Свитер', 'Свитер', '12-01-248', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 3),
	('c84849d0-5668-4d92-81fa-999c892edd7e', 'Свитер', 'Свитер', '12-02-002', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 4),
	('15555d33-51c6-4319-8356-346df7420187', 'Свитер', 'Битүү кебельтэй свитер', '07-02-003', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 5),
	('4843c336-86d3-4f2f-a56d-a6b0543049e5', 'Свитер', 'Свитер', '3.5-02-117', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 6),
	('d9d84bd1-8e03-4670-a008-4306d4867d39', 'Кардиган', 'Цахилгаантай кардиган', '07-03-031', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 7),
	('e015d9ca-a4ae-410b-bff9-e343f6eeedfa', 'Кардиган', 'Цахилгаантай кардиган', '07-03-040', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 8),
	('d8580385-d6f9-401d-8b13-2216420cd56b', 'Кардиган', 'Товчтой кардиган', '12-03-097', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 9),
	('fcb07256-d3d6-49b9-8837-bda5f6673981', 'Кардиган', 'Товчтой кардиган', '12-03-198', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 10),
	('d31ad2ee-34c5-4b8d-977a-40177fdff638', 'Кардиган', 'Цахилгаантай кардиган', '12-03-199', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 11),
	('e0880be7-b35e-497a-8988-c033e6ef08ed', 'Кардиган', 'Товчтой кардиган', '12-03-208', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 12),
	('9b0b0b08-2ff7-4650-b304-2fb7eb443f6c', 'Кардиган', 'Цахилгаантай кебельтэй кардиган', '07-03-230', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 13),
	('7dc8fdac-928c-40e8-9700-9a7a9396beb1', 'Кардиган', 'Кардиган', '07-03-232', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 14),
	('f9befdfc-1eea-43bd-a213-7bb3cbef4680', 'Бомбер', 'Бомбер', '12-03-294', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 15),
	('875e66f1-1680-4c2c-9718-edce00aee145', 'Кардиган', 'Алаг кардиган', '07-03-308', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 16),
	('53b6c3e6-1ebc-4f4c-b5eb-c9f543b6acd3', 'Цамц', 'Малгайтай цамц', '12-04-049', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 17),
	('2586fef4-62f7-4b4f-8235-9fb054921f55', 'Өмд', 'Өмд', '12-10-048', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 18),
	('f5de910e-c5f4-4158-995e-d8b672de8812', 'Өмд', 'Өмд', '12-10-335', '100% Mongolian cashmere', 'Camel, Ivory, Grey, Black', 'S / M / L / XL / 2XL', 'men', NULL, 19);
