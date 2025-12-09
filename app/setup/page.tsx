"use client"

import { useState, useEffect } from "react"

export default function SetupPage() {
  const [status, setStatus] = useState({
    supabaseConnected: false,
    tablesExist: false,
    authReady: false,
    error: null as string | null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          setStatus((prev) => ({
            ...prev,
            error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
            supabaseConnected: false,
          }))
          setLoading(false)
          return
        }

        setStatus((prev) => ({ ...prev, supabaseConnected: true }))

        // Try to fetch properties to check if tables exist
        const response = await fetch("/api/properties")

        if (response.ok) {
          setStatus((prev) => ({ ...prev, tablesExist: true }))
        } else if (response.status === 404) {
          setStatus((prev) => ({
            ...prev,
            tablesExist: false,
            error: "Tables not created yet. Run SQL migration in Supabase.",
          }))
        }

        setLoading(false)
      } catch (error) {
        setStatus((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Unknown error",
        }))
        setLoading(false)
      }
    }

    checkSetup()
  }, [])

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Setup Guide</h1>

        {loading ? (
          <div className="text-lg">Checking setup status...</div>
        ) : (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg ${status.supabaseConnected ? "bg-green-50" : "bg-red-50"}`}>
              <p className="font-semibold">
                {status.supabaseConnected ? "✓ Supabase Connected" : "✗ Supabase Not Connected"}
              </p>
              {status.supabaseConnected && (
                <p className="text-sm text-gray-600 mt-2">Environment variables are properly set</p>
              )}
            </div>

            <div className={`p-4 rounded-lg ${status.tablesExist ? "bg-green-50" : "bg-yellow-50"}`}>
              <p className="font-semibold">
                {status.tablesExist ? "✓ Database Tables Exist" : "⚠ Database Tables Not Found"}
              </p>
              {!status.tablesExist && (
                <div className="mt-4 space-y-4">
                  <p className="text-sm text-gray-700">You need to run the migration SQL in your Supabase dashboard:</p>
                  <ol className="text-sm text-gray-700 list-decimal list-inside space-y-2">
                    <li>
                      Go to{" "}
                      <a
                        href="https://app.supabase.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Supabase Dashboard
                      </a>
                    </li>
                    <li>Select your project</li>
                    <li>Go to SQL Editor</li>
                    <li>Click "New Query"</li>
                    <li>
                      Copy and paste the SQL from{" "}
                      <code className="bg-gray-200 px-2 py-1 rounded">scripts/03-setup-supabase.sql</code>
                    </li>
                    <li>Click "Run"</li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              )}
            </div>

            {status.error && (
              <div className="p-4 rounded-lg bg-red-50">
                <p className="font-semibold text-red-900">Error: {status.error}</p>
              </div>
            )}

            {status.tablesExist && status.supabaseConnected && (
              <div className="p-4 rounded-lg bg-green-50">
                <p className="font-semibold text-green-900">✓ Setup Complete!</p>
                <p className="text-sm text-green-800 mt-2">You can now:</p>
                <ul className="text-sm text-green-800 mt-2 list-disc list-inside space-y-1">
                  <li>
                    Sign up at{" "}
                    <a href="/auth/register" className="underline">
                      /auth/register
                    </a>
                  </li>
                  <li>
                    Login at{" "}
                    <a href="/auth/login" className="underline">
                      /auth/login
                    </a>
                  </li>
                  <li>Create admin in Supabase (set is_admin=true)</li>
                  <li>
                    Upload properties at{" "}
                    <a href="/admin/dashboard" className="underline">
                      /admin/dashboard
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
