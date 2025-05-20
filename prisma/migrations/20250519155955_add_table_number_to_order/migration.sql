/*
  Warnings:

  - You are about to drop the column `deliveryAddress` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryAddress",
ADD COLUMN     "tableNumber" TEXT NOT NULL DEFAULT '';
