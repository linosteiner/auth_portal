import {Module} from "@/models/module"

/** A failed module call, with the text to show the user. */
export class ModuleRequestError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
  }
}

// The backend's answers (see user_mgmt_ops docs/module-service.md, "Error mapping"): 404 for a
// module the module_service does not know, 503 + Retry-After while the module_service is down
// or the circuit breaker is open.
function messageFor(res: Response): string {
  switch (res.status) {
    case 503:
      return `The module service is temporarily unavailable. Please try again in ${res.headers.get("Retry-After") ?? "15"} seconds.`
    case 404:
      return "This module is not available."
    case 403:
      return "You are not allowed to do this."
    case 401:
      return "Your session has expired. Please log in again."
    default:
      return `Something went wrong (HTTP ${res.status}).`
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {credentials: "include", cache: "no-store", ...init})
  if (!res.ok) {
    throw new ModuleRequestError(res.status, messageFor(res))
  }
  return res.json() as Promise<T>
}

export function errorMessage(err: unknown): string {
  return err instanceof ModuleRequestError ? err.message : "The server could not be reached."
}

export const fetchModules = () => request<Module[]>("/auth/modules")

export const fetchUserModules = (userId: string) =>
  request<Module[]>(`/auth/users/${userId}/modules`)

export const assignModule = (userId: string, moduleId: string) =>
  request<{ userId: string, module: Module }>(`/auth/users/${userId}/modules/${moduleId}`, {method: "PUT"})
