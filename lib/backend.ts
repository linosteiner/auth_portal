import {cookies} from "next/headers"

/**
 * Base url of the backend, for SERVER-SIDE calls only -- the route handlers under
 * app/auth/ that run inside the frontend pod.
 *
 * Injected at runtime from the frontend ConfigMap in the Helm chart, so every environment
 * resolves to the backend Service in its own namespace (staging talks to staging, prod to
 * prod). Deliberately not prefixed NEXT_PUBLIC_: Next.js inlines those into the bundle at
 * build time, which would bake one environment's endpoint into the image and make the
 * chart unable to vary it.
 *
 * Client components must NOT use this. They call the api under a relative /api path on
 * whatever host served the page, which resolves per environment on its own.
 */
export function backendUrl(path: string): string {
    const base = process.env.BACKEND_API_URL

    if (!base) {
        throw new Error(
            "BACKEND_API_URL is not set. In the cluster it comes from the frontend " +
            "ConfigMap; for local development set it in .env.local, e.g. " +
            "BACKEND_API_URL=http://localhost:8080/api"
        )
    }

    return `${base}${path}`
}

/**
 * Calls the backend on behalf of the logged-in user and hands its answer back unchanged:
 * status, JSON body and Retry-After (the backend sends one with every 503). For the route
 * handlers that only relay a call. The jwt cookie is httpOnly, so the browser cannot attach
 * the token itself.
 */
export async function forwardToBackend(path: string, method: "GET" | "PUT" = "GET"): Promise<Response> {
    const token = (await cookies()).get("jwt")?.value

    if (!token) {
        return Response.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        const res = await fetch(backendUrl(path), {
            method,
            headers: {Authorization: `Bearer ${token}`},
            cache: "no-store",
        })
        const headers = new Headers()
        const retryAfter = res.headers.get("retry-after")
        if (retryAfter) headers.set("Retry-After", retryAfter)
        const body = await res.text()
        if (body) headers.set("Content-Type", "application/json")

        return new Response(body || null, {status: res.status, headers})
    } catch (err) {
        console.error(`${method} ${path} failed:`, err)
        return Response.json({error: "Backend not reachable"}, {status: 502})
    }
}
