/*
  Warnings:

  - You are about to drop the column `clerk_id` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `clerk_id` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `carts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `carts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "carts_clerk_id_key";

-- AlterTable
ALTER TABLE "carts" DROP COLUMN "clerk_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "clerk_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");
