import { dbGetClassroom } from '@/app/_lib/db/classroom'
import { dbCreateEnrollments } from '@/app/_lib/db/enrollment'
import prisma from '@/app/_lib/db/prisma'
import { getAuthenticatedUser } from '@/app/_lib/services/auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const PostSchema = z.object({
  termId: z.number().int().positive(),
  classroomId: z.number().int().positive(),
  personIdList: z.array(z.number().int().positive()).min(1)
})

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({}, { status: 401 })
    }

    const body = await request.json()

    const validation = PostSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        z.treeifyError(validation.error),
        { status: 400 }
      )
    }

    const { termId, classroomId, personIdList } = validation.data

    const term = await prisma.term.findFirst({
      where: {
        id: termId,
        churchId: user.churchId,
      },
    })

    if (!term || term.completed) {
      return NextResponse.json(
        { message: 'Período não encontrado' },
        { status: 400 }
      )
    }

    const classroom = await dbGetClassroom({ id: classroomId, userId: user.id })
    
    if (!classroom) {
      return NextResponse.json(
        { message: 'Classe não encontrada' },
        { status: 400 }
      )
    }

    await dbCreateEnrollments({
      termId,
      classroomId,
      personIdList,
      churchId: user.churchId,
    })
  
    return NextResponse.json({}, { status: 200 })

  } catch {
    return NextResponse.json(
      { message: 'error to process this request'},
      { status: 500 }
    )
  }
}