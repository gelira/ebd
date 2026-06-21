/*
  Warnings:

  - A unique constraint covering the columns `[lesson_id,classroom_id]` on the table `lesson_reports` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "lesson_reports_lesson_id_classroom_id_key" ON "lesson_reports"("lesson_id", "classroom_id");
