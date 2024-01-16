/*
  Warnings:

  - The values [FINDER] on the enum `ERole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ERole_new" AS ENUM ('RELATIVE', 'AUTHORITY', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "ERole_new" USING ("role"::text::"ERole_new");
ALTER TYPE "ERole" RENAME TO "ERole_old";
ALTER TYPE "ERole_new" RENAME TO "ERole";
DROP TYPE "ERole_old";
COMMIT;
