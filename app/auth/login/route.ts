import { NextResponse } from "next/server"
import { backendUrl } from "@/lib/backend"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const res = await fetch(backendUrl("/users/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      return NextResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
      )
    }

    const authHeader = res.headers.get("authorization")

    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 500 })
    }

    const response = NextResponse.json({ success: true })

    response.cookies.set("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    })

    return response
  } catch (err) {
    // Without this the caller only ever sees "Server error" and the pod logs stay silent,
    // which makes a misconfigured BACKEND_API_URL practically undiagnosable.
    console.error("login route failed:", err)

    return NextResponse.json(
        { message: "Server error" },
        { status: 500 }
    )
  }
}