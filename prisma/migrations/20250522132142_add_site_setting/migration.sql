-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL,
    "heroImage" TEXT,
    "siteTitle" TEXT NOT NULL DEFAULT 'MyRestaurant',
    "primaryColor" TEXT NOT NULL DEFAULT '#ff6b00',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);
