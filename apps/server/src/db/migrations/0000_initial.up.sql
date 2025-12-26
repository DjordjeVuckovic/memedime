CREATE TABLE `coins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`ticker` text NOT NULL,
	`tagline` text,
	`description` text,
	`supply` text,
	`marketing` text,
	`lp_burned_percentage` text,
	`dev_percentage` text,
	`marketing_fee_percentage` text,
	`community_fee_percentage` text,
	`mode` text NOT NULL,
	`combos` text,
	`prompt` text,
	`wallet_address` text DEFAULT '1nc1nerator11111111111111111111111111111111',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE INDEX `idx_mode` ON `coins` (`mode`);
