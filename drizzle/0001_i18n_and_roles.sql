ALTER TABLE `categories` ADD `name_ru` text;--> statement-breakpoint
ALTER TABLE `categories` ADD `name_zh` text;--> statement-breakpoint
ALTER TABLE `categories` ADD `meta_mn` text;--> statement-breakpoint
ALTER TABLE `categories` ADD `meta_ru` text;--> statement-breakpoint
ALTER TABLE `categories` ADD `meta_zh` text;--> statement-breakpoint
ALTER TABLE `products` ADD `title_ru` text;--> statement-breakpoint
ALTER TABLE `products` ADD `title_zh` text;--> statement-breakpoint
ALTER TABLE `products` ADD `color_en` text;--> statement-breakpoint
ALTER TABLE `products` ADD `color_ru` text;--> statement-breakpoint
ALTER TABLE `products` ADD `color_zh` text;--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'user' NOT NULL;--> statement-breakpoint
-- Translations for the seeded catalog rows already in the database.
UPDATE `categories` SET `name_ru` = 'Женские топы', `name_zh` = '女士上衣', `meta_mn` = 'Кардиган · Свитер · Даашинз', `meta_ru` = 'Кардиганы · Свитеры · Платья', `meta_zh` = '开衫 · 毛衣 · 连衣裙' WHERE `slug` = 'women';--> statement-breakpoint
UPDATE `categories` SET `name_ru` = 'Верхняя одежда', `name_zh` = '外套', `meta_mn` = 'Пальто · Куртка', `meta_ru` = 'Пальто · Куртки', `meta_zh` = '大衣 · 夹克' WHERE `slug` = 'outerwear';--> statement-breakpoint
UPDATE `categories` SET `name_ru` = 'Мужские топы', `name_zh` = '男士上衣', `meta_mn` = 'Пуловер · Hoodie', `meta_ru` = 'Пуловеры · Худи', `meta_zh` = '套头衫 · 连帽衫' WHERE `slug` = 'men';--> statement-breakpoint
UPDATE `categories` SET `name_ru` = 'Обувь', `name_zh` = '鞋履', `meta_mn` = 'Ноолууран гутал · Шаахай', `meta_ru` = 'Кашемировые ботинки · Тапочки', `meta_zh` = '羊绒靴 · 拖鞋' WHERE `slug` = 'shoes';--> statement-breakpoint
UPDATE `products` SET `title_ru` = 'Мужской пуловер', `title_zh` = '男士套头衫', `color_en` = 'Navy', `color_ru` = 'Тёмно-синий', `color_zh` = '藏青色' WHERE `slug` = 'mens-crew-1';--> statement-breakpoint
UPDATE `products` SET `title_ru` = 'Кашемировое пальто с запахом', `title_zh` = '裹身羊绒大衣', `color_en` = 'Charcoal', `color_ru` = 'Графитовый', `color_zh` = '炭灰色' WHERE `slug` = 'coat-1';--> statement-breakpoint
UPDATE `products` SET `title_ru` = 'Трикотажное платье миди', `title_zh` = '针织中长连衣裙', `color_en` = 'Light Grey', `color_ru` = 'Светло-серый', `color_zh` = '浅灰色' WHERE `slug` = 'dress-1';--> statement-breakpoint
UPDATE `products` SET `title_ru` = 'Кардиган с узором', `title_zh` = '提花开衫', `color_en` = 'Camel', `color_ru` = 'Верблюжий', `color_zh` = '驼色' WHERE `slug` = 'cardi-1';--> statement-breakpoint
UPDATE `products` SET `title_ru` = 'Классический свитер', `title_zh` = '经典圆领衫', `color_en` = 'Oatmeal', `color_ru` = 'Овсяный', `color_zh` = '燕麦色' WHERE `slug` = 'crew-1';--> statement-breakpoint
UPDATE `products` SET `title_ru` = 'Куртка с запахом и поясом', `title_zh` = '系带裹身夹克', `color_en` = 'Sand', `color_ru` = 'Песочный', `color_zh` = '沙色' WHERE `slug` = 'wrap-1';--> statement-breakpoint
UPDATE `products` SET `title_ru` = 'Мужское кашемировое худи', `title_zh` = '男士羊绒连帽衫', `color_en` = 'Dark Grey', `color_ru` = 'Тёмно-серый', `color_zh` = '深灰色' WHERE `slug` = 'mens-hoodie-1';--> statement-breakpoint
UPDATE `products` SET `title_ru` = 'Ботинки на кашемировой подкладке', `title_zh` = '羊绒内衬靴', `color_en` = 'Tan', `color_ru` = 'Светло-коричневый', `color_zh` = '棕褐色' WHERE `slug` = 'boots-1';--> statement-breakpoint
UPDATE `products` SET `title_ru` = 'Перчатки на кашемировой подкладке', `title_zh` = '羊绒内衬手套', `color_en` = 'Black', `color_ru` = 'Чёрный', `color_zh` = '黑色' WHERE `slug` = 'gloves-1';--> statement-breakpoint
UPDATE `products` SET `title_ru` = 'Шапка тонкой вязки', `title_zh` = '细针织帽', `color_en` = 'Ivory', `color_ru` = 'Слоновая кость', `color_zh` = '象牙白' WHERE `slug` = 'beanie-1';--> statement-breakpoint
UPDATE `products` SET `title_ru` = 'Объёмный кашемировый шарф', `title_zh` = '超大羊绒围巾', `color_en` = 'Rose', `color_ru` = 'Розовый', `color_zh` = '玫瑰色' WHERE `slug` = 'scarf-1';
