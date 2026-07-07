/*
  Warnings:

  - You are about to drop the column `createAt` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `createBy` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `postertUrl` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Movie` table. All the data in the column will be lost.
  - The `runtime` column on the `Movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createAt` on the `WatchlistItem` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `WatchlistItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,movieId]` on the table `WatchlistItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdBy` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WatchlistItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_createBy_fkey";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "createAt",
DROP COLUMN "createBy",
DROP COLUMN "postertUrl",
DROP COLUMN "updateAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "posterUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "runtime",
ADD COLUMN     "runtime" INTEGER;

-- AlterTable
ALTER TABLE "WatchlistItem" DROP COLUMN "createAt",
DROP COLUMN "updateAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_userId_movieId_key" ON "WatchlistItem"("userId", "movieId");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
