-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "file" TEXT,
    "description" TEXT,
    "price" TEXT,
    "created_at" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "title" TEXT,
    "directions" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_file_key" ON "Post"("file");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
