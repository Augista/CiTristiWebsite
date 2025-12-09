import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Get user profile
    const { data: userProfile } = await supabase.from("users").select("*").eq("id", data.user.id).single()

    return NextResponse.json({
      success: true,
      user: userProfile,
      session: data.session,
    })
  } catch (error) {
    console.error(" Login error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
