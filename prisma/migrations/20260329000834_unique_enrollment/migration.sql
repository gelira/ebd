/*
  Warnings:

  - A unique constraint covering the columns `[person_id,classroom_id,term_id]` on the table `enrollments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "enrollments_person_id_classroom_id_term_id_key" ON "enrollments"("person_id", "classroom_id", "term_id");
