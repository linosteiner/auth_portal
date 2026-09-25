import {forwardToBackend} from "@/lib/backend"

// The modules assigned to a user. The backend decides who may read them.
export async function GET(_req: Request, {params}: { params: Promise<{ userId: string }> }) {
  const {userId} = await params
  return forwardToBackend(`/users/${encodeURIComponent(userId)}/modules`)
}
