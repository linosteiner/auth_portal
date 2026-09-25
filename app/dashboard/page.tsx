"use client"

import * as React from "react"
import Link from "next/link"
import {BookOpen} from "lucide-react"
import {useCurrentUser} from "@/components/dashboard/current-user"
import {StatusMessage} from "@/components/dashboard/status-message"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Skeleton} from "@/components/ui/skeleton"
import {errorMessage, fetchUserModules} from "@/lib/modules"
import {Module} from "@/models/module"

export default function OverviewPage() {
  const user = useCurrentUser()
  const [modules, setModules] = React.useState<Module[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!user) return
    let cancelled = false

    fetchUserModules(user.id)
      .then((mine) => {
        if (!cancelled) setModules(mine)
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err))
      })

    return () => {
      cancelled = true
    }
  }, [user])

  return (
    <div className="flex max-w-5xl flex-col gap-4">
      <div>
        {user
          ? <h1 className="text-xl font-semibold">Welcome, {user.firstName}</h1>
          : <Skeleton className="h-7 w-48"/>}
        <p className="text-sm text-muted-foreground">Your account and your modules at a glance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Account</CardTitle>
            <CardDescription>Signed in as</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1 text-sm">
            {user ? (
              <>
                <span className="font-medium">{user.firstName} {user.lastName}</span>
                <span className="text-muted-foreground">{user.email}</span>
              </>
            ) : (
              <Skeleton className="h-10 w-56"/>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">My modules</CardTitle>
            <CardDescription>
              {modules ? `${modules.length} assigned` : "Assigned to you"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 text-sm">
            {error && <StatusMessage kind="error">{error}</StatusMessage>}
            {!error && modules === null && <Skeleton className="h-10 w-full"/>}
            {modules?.length === 0 && (
              <span className="text-muted-foreground">No modules assigned yet.</span>
            )}
            {modules && modules.length > 0 && (
              <ul className="grid gap-1">
                {modules.map((m) => (
                  <li key={m.id} className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{m.code}</span>
                    <span>{m.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/dashboard/modules"><BookOpen/> Browse modules</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
