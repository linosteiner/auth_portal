import {cn} from "@/lib/utils";

/**
 * Marks which environment the app is running in.
 *
 * A server component on purpose: it reads APP_ENV_LABEL at RUNTIME from the frontend
 * ConfigMap, so the same image shows "Staging" in the staging namespace and nothing in
 * prod. A NEXT_PUBLIC_ variable would be inlined at build time and would bake one
 * environment's identity into the image -- the exact coupling that BACKEND_API_URL
 * replaced.
 *
 * No label means no banner, which is why prod needs no override: an unset value fails
 * towards the quiet, production-looking state rather than towards a stray banner.
 */

// Whitelisted, not interpolated: the value comes from a ConfigMap, and mapping it to
// fixed class strings keeps that value from reaching the class attribute directly.
const TONES = {
    warning: "bg-amber-400 text-amber-950 dark:bg-amber-500 dark:text-amber-950",
    neutral: "bg-muted text-muted-foreground border-b",
} as const

type Tone = keyof typeof TONES

export function EnvironmentBanner() {
    const label = process.env.APP_ENV_LABEL?.trim()

    if (!label) {
        return null
    }

    const requested = process.env.APP_ENV_TONE?.trim()
    const tone: Tone = requested && requested in TONES ? (requested as Tone) : "warning"

    return (
        <div
            role="status"
            // shrink-0 because body is a flex column -- without it the banner would be
            // squeezed away by a tall page.
            className={cn(
                "shrink-0 py-1 text-center text-xs font-medium uppercase tracking-widest",
                TONES[tone],
            )}
        >
            {label}
        </div>
    )
}
