CREATE TABLE `score` (
	`id` INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`username` VARCHAR(20) NOT NULL DEFAULT 'Anonyme',
	`total_time` INT(10) NOT NULL,
	`difficulty` TINYINT(1) UNSIGNED NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT NOW()
)
COLLATE='utf8_general_ci'
;