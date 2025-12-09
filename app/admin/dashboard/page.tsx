"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit, LogOut } from "lucide-react"

interface Property {
  id: number
  title: string
  location: string
  district: string
  property_type: string
  price: number
  size_sqm: number
  featured_image_url: string
  created_at: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setError(null)
      const response = await fetch("/api/properties")
      if (!response.ok) {
        if (response.status === 500) {
          setError("Database not initialized. Please run the migration script first.")
          return
        }
        throw new Error("Failed to fetch")
      }
      const data = await response.json()
      setProperties(data || [])
    } catch (error) {
      console.error(" Fetch error:", error)
      setError("Failed to load properties. Please check your database setup.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    router.push("/admin/dashboard")
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus properti ini?")) return

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setProperties(properties.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error(" Delete error:", error)
    }
  }

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-serif font-bold">Ci Tristi Property</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <p className="text-yellow-800 mb-4">{error}</p>
            <a
              href="/setup-db"
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go to Setup Instructions →
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold">Ci Tristi Property</h1>
            <p className="text-primary-foreground/80 mt-1">Kelola properti Anda</p>
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
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 max-w-md">
            <Input placeholder="Cari properti..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Link href="/admin/properties/new">
            <Button className="bg-primary text-primary-foreground hover:bg-accent ml-4">
              <Plus className="w-4 h-4 ms-2" />
              Tambah Properti
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg">
            <p className="text-muted-foreground mb-4">Belum ada properti</p>
            <Link href="/admin/properties/new">
              <Button className="bg-primary text-primary-foreground">Tambah Properti Pertama</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-card rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row"
              >
                <div className="w-full md:w-48 h-40 md:h-32 flex-shrink-0 bg-muted overflow-hidden">
                  <img
                    src={property.featured_image_url || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {property.location} • {property.district}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-block px-2 py-1 bg-muted text-xs font-medium rounded">
                      {property.property_type}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      Rp {property.price.toLocaleString("id-ID")}
                    </span>
                    {property.size_sqm && <span className="text-sm text-muted-foreground">{property.size_sqm} m²</span>}
                  </div>
                </div>

                <div className="flex gap-2 p-4 border-t md:border-t-0 md:border-l md:flex-col md:justify-center">
                  <Link href={`/admin/properties/${property.id}/edit`} className="flex-1 md:flex-auto">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="flex-1 md:flex-auto px-3 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
