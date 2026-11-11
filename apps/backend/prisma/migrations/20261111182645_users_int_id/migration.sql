-- Switch users.id from a uuid string to an auto-increment integer.
-- One statement, so it applies fully or not at all; existing rows are numbered 1, 2, 3...
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
