-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "displayName" TEXT,
    "headline" TEXT,
    "bio" TEXT,
    "avatarKey" TEXT,
    "location" TEXT,
    "company" TEXT,
    "jobTitle" TEXT,
    "pronouns" TEXT,
    "availableForWork" BOOLEAN NOT NULL DEFAULT false,
    "interests" TEXT[],
    "skills" TEXT[],
    "website" TEXT,
    "twitter" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "medium" TEXT,
    "youtube" TEXT,
    "instagram" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

