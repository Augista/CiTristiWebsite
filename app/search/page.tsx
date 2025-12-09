"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { ChevronRight, MapPin } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface Property {
  id: number
  title: string
  location: string
  district: string
  price: number
  property_type: string
  size_sqm?: number
  featured_image_url?: string
  hashtags?: string
}

const fallbackProperties: Property[] = [
  {
    id: 1,
    title: "Rumah Modern Darmo",
    location: "Darmo",
    price: 2500000000,
    property_type: "Rumah",
    size_sqm: 250,
    district: "Darmo",
    featured_image_url: "/modern-house.png",
    hashtags: "modern,luxury",
  }
]

const districts = ["Darmo", "Dinoyo", "Jambangan", "Tegalsari", "Genteng", "Bulak", "Gubeng"]
const propertyTypes = ["Rumah", "Apartemen", "Ruko"]

function SearchPropertyPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")?.toLowerCase().trim() ?? ""

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    district: "",
    type: "",
    minSize: "",
    maxSize: "",
    minPrice: "",
    maxPrice: "",
  })

  const [allHashtags, setAllHashtags] = useState<string[]>([])
  const [activeHashtag, setActiveHashtag] = useState("")

  // -----------------------
  // FETCH PROPERTIES
  // -----------------------
  const fetchProperties = async (hashtag?: string) => {
    setLoading(true)

    try {
      let url = `/api/properties?q=${encodeURIComponent(query)}`
      if (hashtag) url += `&hashtag=${encodeURIComponent(hashtag)}`

      const response = await fetch(url)
      let data: Property[] = []

      if (response.ok) {
        data = await response.json()
        if (!data || data.length === 0) data = fallbackProperties
      } else {
        data = fallbackProperties
      }

      setProperties(data)

      // extract hashtag list
      const setTags = new Set<string>()
      data.forEach((p) => {
        p.hashtags?.split(",").forEach((tag) => setTags.add(tag.trim()))
      })
      setAllHashtags(Array.from(setTags))
    } catch (e) {
      console.error("Error:", e)
      setProperties(fallbackProperties)
    } finally {
      setLoading(false)
    }
  }

  // fetch data whenever query or hashtag changes
  useEffect(() => {
    fetchProperties(activeHashtag)
  }, [query, activeHashtag])

  const handleHashtagClick = (tag: string) => {
    setActiveHashtag((prev) => (prev === tag ? "" : tag))
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  // -----------------------
  // FILTERING LOGIC
  // -----------------------
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // search keywords
      const keywords = query.split(" ").filter(Boolean)
      const matchesQuery = keywords.every((k) =>
        prop.title.toLowerCase().includes(k) ||
        prop.location.toLowerCase().includes(k) ||
        prop.district.toLowerCase().includes(k) ||
        prop.property_type.toLowerCase().includes(k)
      )

      if (query && !matchesQuery) return false

      if (filters.district && prop.district !== filters.district) return false
      if (filters.type && prop.property_type !== filters.type) return false

      if (filters.minSize && (prop.size_sqm ?? 0) < Number(filters.minSize)) return false
      if (filters.maxSize && (prop.size_sqm ?? 0) > Number(filters.maxSize)) return false

      if (filters.minPrice && prop.price < Number(filters.minPrice)) return false
      if (filters.maxPrice && prop.price > Number(filters.maxPrice)) return false

      return true
    })
  }, [properties, filters, query])

  const formatPrice = (price: number) => {
    if (price >= 1000000000) return `Rp ${(price / 1_000_000_000).toFixed(1)}M`
    return `Rp ${(price / 1_000_000).toFixed(0)}J`
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* HEADER */}
      <section className="bg-muted py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Cari Properti</h1>
          <p className="text-muted-foreground">Temukan properti impian dengan filter lengkap</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* SIDEBAR FILTER */}
        <div className="bg-card border rounded-lg p-6 sticky top-4 h-fit">
          <h2 className="text-lg font-semibold mb-6">Filter Pencarian</h2>

          {/* District */}
          <div className="mb-6">
            <label className="text-sm font-medium">Daerah</label>
            <select
              value={filters.district}
              onChange={(e) => handleFilterChange("district", e.target.value)}
              className="w-full mt-2 px-3 py-2 border rounded-lg bg-background"
            >
              <option value="">Semua Daerah</option>
              {districts.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="mb-6">
            <label className="text-sm font-medium">Jenis Properti</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="w-full mt-2 px-3 py-2 border rounded-lg bg-background"
            >
              <option value="">Semua Jenis</option>
              {propertyTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div className="mb-6">
            <label className="text-sm font-medium">Ukuran (m²)</label>
            <div className="space-y-2 mt-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minSize}
                onChange={(e) => handleFilterChange("minSize", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxSize}
                onChange={(e) => handleFilterChange("maxSize", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <label className="text-sm font-medium">Harga (Rp)</label>
            <div className="space-y-2 mt-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>
          </div>

          <button
            onClick={() =>
              setFilters({ district: "", type: "", minSize: "", maxSize: "", minPrice: "", maxPrice: "" })
            }
            className="w-full py-2 bg-muted rounded-lg mt-4"
          >
            Reset Filter
          </button>
        </div>

        {/* PROPERTY LIST */}
        <div className="lg:col-span-3">
          <p className="text-sm text-muted-foreground mb-6">
            Menampilkan{" "}
            <span className="font-semibold text-foreground">{filteredProperties.length}</span> properti
          </p>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {filteredProperties.map((p) => (
                <div key={p.id} className="border rounded-lg bg-card overflow-hidden hover:shadow-lg transition">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={p.featured_image_url || "/placeholder.svg"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{p.title}</h3>

                    <div className="flex items-center mt-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {p.location}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-4 text-sm border-b pb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Harga</p>
                        <p className="font-bold text-primary">{formatPrice(p.price)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Luas</p>
                        <p className="font-bold">{p.size_sqm ?? "-"} m²</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tipe</p>
                        <p className="font-bold">{p.property_type}</p>
                      </div>
                    </div>

                    <Link
                      href={`/properties/${p.id}`}
                      className="w-full mt-4 py-2 flex justify-center bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition"
                    >
                      Detail <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Tidak ada hasil ditemukan</p>
              <button
                onClick={() =>
                  setFilters({ district: "", type: "", minSize: "", maxSize: "", minPrice: "", maxPrice: "" })
                }
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg mt-4"
              >
                Reset Filter
              </button>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <SearchPropertyPage />
    </Suspense>
  )
}