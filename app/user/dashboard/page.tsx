"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, Heart, MapPin, DollarSign } from "lucide-react"

interface UserSession {
  id: number
  email: string
  name: string
  is_admin: boolean
}

interface Property {
  id: number
  title: string
  location: string
  price: number
  featured_image_url: string
}

export default function UserDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserSession | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const sessionCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_session="))
      ?.split("=")[1]

    if (!sessionCookie) {
      router.push("/auth/login")
      return
    }

    try {
      const session = JSON.parse(decodeURIComponent(sessionCookie))
      setUser(session)
      fetchProperties()
    } catch (error) {
      console.error(" Session error:", error)
      router.push("/auth/login")
    }
  }, [router])

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties")
      if (response.ok) {
        const data = await response.json()
        setProperties(data.slice(0, 6)) // Show first 6 properties
      }
    } catch (error) {
      console.error(" Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    document.cookie = "user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
            <p className="text-primary-foreground/80 mt-1">Selamat datang, {user.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Email</h3>
            <p className="text-lg font-semibold text-foreground">{user.email}</p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Nama Lengkap</h3>
            <p className="text-lg font-semibold text-foreground">{user.name}</p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
            <p className="text-lg font-semibold text-foreground">{user.is_admin ? "Admin" : "User Biasa"}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Properti Tersedia</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg">
              <p className="text-muted-foreground mb-4">Belum ada properti</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}>
                  <div className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative h-40 overflow-hidden bg-muted">
                      <img
                        src={property.featured_image_url || "/placeholder.svg"}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                        }}
                        className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-muted transition-colors"
                      >
                        <Heart className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{property.title}</h3>
                      <div className="flex items-center text-muted-foreground text-sm mb-3">
                        <MapPin className="w-4 h-4 ms-1" />
                        {property.location}
                      </div>
                      <div className="flex items-center text-primary font-bold text-lg">
                        <DollarSign className="w-4 h-4" />
                        Rp {property.price.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/properties">
          <Button className="bg-primary text-primary-foreground hover:bg-accent">Lihat Semua Properti</Button>
        </Link>
      </div>
    </div>
  )
}
