/*
  Warnings:

  - You are about to alter the column `userId` on the `Auth` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(36)`.
  - You are about to alter the column `name` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the column `createdAt` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Ingredient` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `recipeId` on the `Ingredient` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(36)`.
  - You are about to drop the column `time` on the `Recipe` table. All the data in the column will be lost.
  - You are about to alter the column `categoryId` on the `Recipe` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(36)`.
  - You are about to drop the column `createdAt` on the `Step` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Step` table. All the data in the column will be lost.
  - You are about to alter the column `recipeId` on the `Step` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(36)`.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Step` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Auth` DROP FOREIGN KEY `Auth_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Ingredient` DROP FOREIGN KEY `Ingredient_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `Recipe` DROP FOREIGN KEY `Recipe_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Step` DROP FOREIGN KEY `Step_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `Tag` DROP FOREIGN KEY `Tag_recipeId_fkey`;

-- DropIndex
DROP INDEX `Ingredient_recipeId_fkey` ON `Ingredient`;

-- DropIndex
DROP INDEX `Step_recipeId_fkey` ON `Step`;

-- AlterTable
ALTER TABLE `Auth` MODIFY `userId` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `Category` MODIFY `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `Ingredient` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `quantity` VARCHAR(50) NULL,
    ADD COLUMN `unit` VARCHAR(50) NULL,
    MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `recipeId` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `Recipe` DROP COLUMN `time`,
    ADD COLUMN `authorId` CHAR(36) NOT NULL,
    ADD COLUMN `cookTime` INTEGER NULL,
    ADD COLUMN `difficulty` VARCHAR(20) NULL,
    ADD COLUMN `prepTime` INTEGER NULL,
    ADD COLUMN `servings` INTEGER NULL,
    MODIFY `title` VARCHAR(200) NOT NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `image` LONGTEXT NULL,
    MODIFY `categoryId` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `Step` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `order` INTEGER NOT NULL,
    MODIFY `description` TEXT NOT NULL,
    MODIFY `recipeId` CHAR(36) NOT NULL;

-- DropTable
DROP TABLE `Tag`;

-- CreateIndex
CREATE INDEX `Recipe_authorId_idx` ON `Recipe`(`authorId`);

-- CreateIndex
CREATE INDEX `Recipe_title_idx` ON `Recipe`(`title`);

-- AddForeignKey
ALTER TABLE `Auth` ADD CONSTRAINT `Auth_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ingredient` ADD CONSTRAINT `Ingredient_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Step` ADD CONSTRAINT `Step_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Recipe` RENAME INDEX `Recipe_categoryId_fkey` TO `Recipe_categoryId_idx`;
