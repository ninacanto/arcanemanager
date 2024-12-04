-- CreateTable
CREATE TABLE "Password" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Password_pkey" PRIMARY KEY ("id")
);
