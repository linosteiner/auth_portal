"use client"

import * as React from "react"
import {Check, LoaderCircle, RefreshCw} from "lucide-react"
import {useCurrentUser} from "@/components/dashboard/current-user"
import {StatusMessage} from "@/components/dashboard/status-message"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Skeleton} from "@/components/ui/skeleton"
import {assignModule, errorMessage, fetchModules, fetchUserModules} from "@/lib/modules"
import {Module} from "@/models/module"

type Status = { kind: "error" | "success", text: string }

/**
 * The modules the module_service offers, and which of them the logged-in user has. Every call
 * goes browser -> frontend route handler -> user_mgmt_service -> module_service; the backend
 * checks that a module is available before it assigns it.
 */
export default function ModulesPage() {
  const user = useCurrentUser()
  const [modules, setModules] = React.useState<Module[] | null>(null)
  const [assigned, setAssigned] = React.useState<Set<string>>(new Set())
  const [status, setStatus] = React.useState<Status | null>(null)
  const [pending, setPending] = React.useState<string | null>(null)
  const [attempt, setAttempt] = React.useState(0)

  React.useEffect(() => {
    if (!user) return
    let cancelled = false

    Promise.all([fetchModules(), fetchUserModules(user.id)])
      .then(([all, mine]) => {
        if (cancelled) return
        setModules(all)
        setAssigned(new Set(mine.map((m) => m.id)))
        setStatus(null)
      })
      .catch((err) => {
        if (!cancelled) setStatus({kind: "error", text: errorMessage(err)})
      })

    return () => {
      cancelled = true
    }
  }, [user, attempt])

  const assign = async (module: Module) => {
    if (!user) return
    setPending(module.id)
    setStatus(null)
    try {
      await assignModule(user.id, module.id)
      setAssigned((prev) => new Set(prev).add(module.id))
      setStatus({kind: "success", text: `${module.name} is now assigned to you.`})
    } catch (err) {
      setStatus({kind: "error", text: errorMessage(err)})
    } finally {
      setPending(null)
    }
  }

  const retry = (
    <Button variant="outline" size="sm" onClick={() => setAttempt((n) => n + 1)}>
      <RefreshCw/> Retry
    </Button>
  )

  return (
    <div className="flex max-w-5xl flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Modules</h1>
        <p className="text-sm text-muted-foreground">
          Pick a module to assign it to yourself. {modules && `${assigned.size} of ${modules.length} assigned.`}
        </p>
      </div>

      {status && (
        <StatusMessage kind={status.kind} action={status.kind === "error" && !modules ? retry : undefined}>
          {status.text}
        </StatusMessage>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules === null && status === null && [0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-40 rounded-lg"/>
        ))}

        {modules?.map((module) => {
          const isAssigned = assigned.has(module.id)
          return (
            <Card key={module.id}>
              <CardHeader>
                <CardTitle className="text-sm">{module.name}</CardTitle>
                <CardDescription className="font-mono">{module.code}</CardDescription>
                {isAssigned && (
                  <CardAction>
                    <Badge variant="secondary"><Check/> Assigned</Badge>
                  </CardAction>
                )}
              </CardHeader>
              <CardContent className="flex-1 text-muted-foreground">
                {module.description}
              </CardContent>
              <CardFooter>
                <Button
                  variant={isAssigned ? "outline" : "default"}
                  disabled={isAssigned || pending !== null}
                  onClick={() => assign(module)}
                >
                  {pending === module.id && <LoaderCircle className="animate-spin"/>}
                  {isAssigned ? "Assigned" : pending === module.id ? "Assigning ..." : "Assign to me"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}

        {modules?.length === 0 && (
          <p className="text-sm text-muted-foreground">The module service has no modules yet.</p>
        )}
      </div>
    </div>
  )
}
