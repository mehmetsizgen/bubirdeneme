-- CreateTable
CREATE TABLE `villas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `json` JSON NULL,
    `add_date` VARCHAR(255) NULL,
    `add_member` INTEGER NOT NULL DEFAULT 0,
    `member` JSON NOT NULL,
    `owner` JSON NOT NULL,
    `regions` JSON NOT NULL,
    `categorys` JSON NOT NULL,
    `distances` JSON NOT NULL,
    `prices` JSON NOT NULL,
    `features` JSON NOT NULL,
    `comments` JSON NOT NULL,
    `availability` JSON NOT NULL,
    `reservation` JSON NOT NULL,
    `agency` JSON NOT NULL,
    `order` INTEGER NULL DEFAULT 0,
    `company_slug` VARCHAR(255) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `show_status` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `regions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `json` JSON NULL,
    `add_date` VARCHAR(255) NULL,
    `add_member` INTEGER NOT NULL DEFAULT 0,
    `member` JSON NOT NULL,
    `order` INTEGER NULL DEFAULT 0,
    `company_slug` VARCHAR(255) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `show_status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorys` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `json` JSON NULL,
    `add_date` VARCHAR(255) NULL,
    `add_member` INTEGER NOT NULL DEFAULT 0,
    `member` JSON NOT NULL,
    `order` INTEGER NULL DEFAULT 0,
    `company_slug` VARCHAR(255) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `show_status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `json` JSON NULL,
    `add_date` VARCHAR(255) NULL,
    `add_member` INTEGER NOT NULL DEFAULT 0,
    `member` JSON NOT NULL,
    `order` INTEGER NULL DEFAULT 0,
    `company_slug` VARCHAR(255) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `show_status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `json` JSON NULL,
    `add_date` VARCHAR(255) NULL,
    `add_member` INTEGER NOT NULL DEFAULT 0,
    `member` JSON NOT NULL,
    `order` INTEGER NULL DEFAULT 0,
    `company_slug` VARCHAR(255) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agencys` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `json` JSON NULL,
    `add_date` VARCHAR(255) NULL,
    `add_member` INTEGER NOT NULL DEFAULT 0,
    `member` JSON NOT NULL,
    `bank` JSON NOT NULL,
    `order` INTEGER NULL DEFAULT 0,
    `company_slug` VARCHAR(255) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `show_status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `json` JSON NULL,
    `add_date` VARCHAR(255) NULL,
    `add_member` INTEGER NOT NULL DEFAULT 0,
    `member` JSON NOT NULL,
    `order` INTEGER NULL DEFAULT 0,
    `company_slug` VARCHAR(255) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availabilitys` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `json` JSON NULL,
    `add_date` VARCHAR(255) NULL,
    `add_member` INTEGER NOT NULL DEFAULT 0,
    `member` JSON NOT NULL,
    `order` INTEGER NULL DEFAULT 0,
    `company_slug` VARCHAR(255) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `json` JSON NULL,
    `add_date` VARCHAR(255) NULL,
    `add_member` INTEGER NOT NULL DEFAULT 0,
    `member` JSON NOT NULL,
    `order` INTEGER NULL DEFAULT 0,
    `company_slug` VARCHAR(255) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `json` JSON NULL,
    `add_date` VARCHAR(255) NULL,
    `add_member` INTEGER NOT NULL DEFAULT 0,
    `member` JSON NOT NULL,
    `order` INTEGER NULL DEFAULT 0,
    `company_slug` VARCHAR(255) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `show_status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `json` JSON NULL,
    `add_date` VARCHAR(255) NULL,
    `add_member` INTEGER NOT NULL DEFAULT 0,
    `order` INTEGER NULL DEFAULT 0,
    `company_slug` VARCHAR(255) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `distances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `json` JSON NULL,
    `add_date` VARCHAR(255) NULL,
    `add_member` INTEGER NOT NULL DEFAULT 0,
    `order` INTEGER NULL DEFAULT 0,
    `company_slug` VARCHAR(255) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `show_status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `features` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `json` JSON NULL,
    `add_date` VARCHAR(255) NULL,
    `add_member` INTEGER NOT NULL DEFAULT 0,
    `member` JSON NOT NULL,
    `order` INTEGER NULL DEFAULT 0,
    `company_slug` VARCHAR(255) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `show_status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `json` JSON NULL,
    `add_date` VARCHAR(255) NULL,
    `add_member` INTEGER NOT NULL DEFAULT 0,
    `member` JSON NOT NULL,
    `order` INTEGER NULL DEFAULT 0,
    `company_slug` VARCHAR(255) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `show_status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
