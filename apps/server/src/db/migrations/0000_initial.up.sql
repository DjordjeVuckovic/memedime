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
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE INDEX `idx_coins_mode` ON `coins` (`mode`);--> statement-breakpoint
CREATE INDEX `idx_coins_created_at` ON `coins` (`created_at`);