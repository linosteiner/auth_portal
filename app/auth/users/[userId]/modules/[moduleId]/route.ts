import {forwardToBackend} from "@/lib/backend"

// Assigns a module to a user (idempotent). The backend checks with the module_service that the
// module is available first and answers 404 if it is not, 503 if the module_service is down.
export async function PUT(_req: Request, {params}: { params: Promise<{ userId: string; moduleId: string }> }) {
  const {userId, moduleId} = await params
  return forwardToBackend(`/users/${encodeURIComponent(userId)}/modules/${encodeURIComponent(moduleId)}`, "PUT")
}
