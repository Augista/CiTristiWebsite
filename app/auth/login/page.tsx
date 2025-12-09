"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message || "Login failed")
        return
      }

      // Get user profile to check admin status
      const { data: userProfile } = await supabase.from("users").select("*").eq("id", data.user.id).single()

      if (userProfile?.is_admin) {
        router.push("/admin/dashboard")
      } else {
        router.push("/user/dashboard")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(" Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = async () => {
    setEmail("admin@cristiproperty.com")
    setPassword("admin123")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-serif font-bold text-primary">cristiProperty</h1>
            </Link>
            <p className="text-muted-foreground mt-2">Masuk ke Akun Anda</p>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 items-start mb-6">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm">Pendaftaran berhasil! Silakan masuk dengan akun Anda.</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-accent"
            >
              {loading ? "Masuk..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">Belum punya akun?</p>
              <Link href="/auth/register" className="text-primary font-medium hover:underline">
                Daftar sekarang
              </Link>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-3 text-center">Demo credentials:</p>
              <button
                type="button"
                onClick={demoLogin}
                className="w-full px-3 py-2 text-xs bg-muted hover:bg-secondary rounded text-foreground transition-colors"
              >
                Fill Demo Credentials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
