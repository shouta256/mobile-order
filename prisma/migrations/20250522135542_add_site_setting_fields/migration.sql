/*
  Warnings:

  - You are about to drop the column `siteTitle` on the `SiteSetting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SiteSetting" DROP COLUMN "siteTitle",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "heroText1" TEXT,
ADD COLUMN     "heroText2" TEXT,
ADD COLUMN     "heroText3" TEXT,
ADD COLUMN     "storeName" TEXT,
ADD COLUMN     "thumbnail" TEXT,
ALTER COLUMN "primaryColor" DROP NOT NULL,
ALTER COLUMN "primaryColor" DROP DEFAULT;
