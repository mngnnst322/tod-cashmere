CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
-- Launch in "coming soon" mode; an admin opens the site from /admin/settings.
INSERT INTO `site_settings` (`key`, `value`) VALUES ('coming_soon', '1');
