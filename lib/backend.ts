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
