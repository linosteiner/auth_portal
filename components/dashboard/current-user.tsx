"use client"

import * as React from "react"
import {useRouter} from "next/navigation"
import {User} from "@/models/user"

const CurrentUserContext = React.createContext<User | null>(null)

/**
 * Loads the logged-in user once for the whole dashboard (sidebar and pages).
 *
 * The jwt cookie outlives the token inside it (7 days vs. 1 hour), and the backend answers an
 * expired token with 401/403. That used to leave the dashboard standing with an
 * "undefined undefined" user; now it drops the cookie and goes back to the login.
 */
export function CurrentUserProvider({children}: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    const load = async () => {
      const res = await fetch("/auth/me", {credentials: "include"})
      if (res.status === 401 || res.status === 403) {
        await fetch("/auth/logout", {method: "POST"})
        router.push("/login")
        router.refresh()
        return
      }
      if (!res.ok) {
        console.error(`GET /auth/me answered ${res.status}`)
        return
      }
      setUser(await res.json())
    }

    load().catch(console.error)
  }, [router])

  return <CurrentUserContext.Provider value={user}>{children}</CurrentUserContext.Provider>
}

/** The logged-in user, or null while it is still loading. */
export function useCurrentUser(): User | null {
  return React.useContext(CurrentUserContext)
}
