import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const result = await query("SELECT * FROM admin_users WHERE email = $1", [email])

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = result[0]

    // Simple password check (for production, use bcrypt)
    if (user.password_hash !== password && !verifyDemoPassword(password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })

    // Set session cookie
    response.cookies.set(
      "admin_session",
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        timestamp: new Date().getTime(),
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
    )

    return response
  } catch (error) {
    console.error(" Login error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

function verifyDemoPassword(password: string): boolean {
  // Demo: allow "admin123" as password
  return password === "admin123"
}
