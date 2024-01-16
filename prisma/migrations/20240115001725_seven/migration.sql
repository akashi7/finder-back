-- CreateEnum
CREATE TYPE "EStatus" AS ENUM ('VIEWED', 'NOT_VIEWED');

-- CreateEnum
CREATE TYPE "ENotification" AS ENUM ('NOTIFIED', 'NOT_NOTIFIED');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "notified" "ENotification" NOT NULL DEFAULT 'NOT_NOTIFIED',
ADD COLUMN     "status" "EStatus" NOT NULL DEFAULT 'NOT_VIEWED';
