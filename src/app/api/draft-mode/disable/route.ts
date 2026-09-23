import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { clearPreview } from '@/lib/preview/cookies'
import { isSafeRedirectUrl } from '@/lib/preview/session'

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('redirect') || '/'
  if (!isSafeRedirectUrl(target)) return new Response('URL must be relative!', { status: 422 })
  await clearPreview()
  redirect(target)
}
