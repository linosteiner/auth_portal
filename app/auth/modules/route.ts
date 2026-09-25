import {forwardToBackend} from "@/lib/backend"

// The modules a user can be assigned (the backend asks the module_service).
export async function GET() {
  return forwardToBackend("/modules")
}
