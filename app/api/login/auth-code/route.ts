import { generateAuthCode } from '@/app/_lib/services/auth-code'
import { responseHandlingCustomError } from '@/app/_lib/utils/custom-error'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')

  if (!email) {
    return Response.json({ error: 'Email is required' }, {
      status: 400
    })
  }

  try {
    const authCode = await generateAuthCode({ email })
    
    return Response.json({ authCodeId: authCode.id.toString() }, {
      status: 200
    })

  } catch (err) {
    return responseHandlingCustomError(err)
  }
}
