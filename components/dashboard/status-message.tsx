import {Check, CircleAlert} from "lucide-react"
import {cn} from "@/lib/utils"

/** A one-line result under a page title: red for an error, green for a success. */
export function StatusMessage({kind, children, action}: {
  kind: "error" | "success"
  children: React.ReactNode
  action?: React.ReactNode
}) {
  const Icon = kind === "error" ? CircleAlert : Check
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn(
        "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
        kind === "error"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
      )}
    >
      <Icon className="size-4 shrink-0"/>
      <span className="flex-1">{children}</span>
      {action}
    </div>
  )
}
