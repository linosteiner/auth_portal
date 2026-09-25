/** A module as the backend returns it (GET /modules, GET /users/{id}/modules). */
export interface Module {
  id: string
  code: string
  name: string
  description: string | null
}
