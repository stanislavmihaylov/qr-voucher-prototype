/*
  Warnings:

  - You are about to drop the column `line1` on the `BillingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `line2` on the `BillingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `postcode` on the `BillingAddress` table. All the data in the column will be lost.
  - Added the required column `addressLine1` to the `BillingAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postCode` to the `BillingAddress` table without a default value. This is not possible if the table is not empty.
  - Made the column `county` on table `BillingAddress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BillingAddress" DROP COLUMN "line1",
DROP COLUMN "line2",
DROP COLUMN "postcode",
ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "postCode" TEXT NOT NULL,
ALTER COLUMN "county" SET NOT NULL;
