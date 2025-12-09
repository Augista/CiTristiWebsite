"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { ChevronRight, MapPin } from "lucide-react"
import Link from "next/link"
import {Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

interface Property {
  id: number;
  title: string;
  description?: string;
  location: string;
  district: string;
  price: number;
  property_type: string;
  size_sqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  featured_image_url?: string;
  amenities?: string;
  contact_phone?: string;
  contact_email?: string;
  badge?: string;                
  hashtags?: string;             
  social_links?: {                   
    tiktok?: string;
    instagram?: string;
    [key: string]: string | undefined; 
  };
  is_popup_promo?: boolean;          
}

const fallbackProperties = [
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
  },
]

function PropertiesPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [allHashtags, setAllHashtags] = useState<string[]>([])
  const [activeHashtag, setActiveHashtag] = useState<string>("") // hashtag filter

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

      // Ambil semua hashtags dari properti
      const hashtagsSet = new Set<string>()
      data.forEach((prop) => {
        prop.hashtags?.split(",").forEach((tag) => hashtagsSet.add(tag.trim()))
      })
      setAllHashtags(Array.from(hashtagsSet))
    } catch (error) {
      console.error("Fetch error:", error)
      setProperties(fallbackProperties)
      const hashtagsSet = new Set<string>()
      fallbackProperties.forEach((prop) => {
        prop.hashtags?.split(",").forEach((tag) => hashtagsSet.add(tag.trim()))
      })
      setAllHashtags(Array.from(hashtagsSet))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(activeHashtag)
  }, [query, activeHashtag])

  const handleHashtagClick = (tag: string) => {
    if (activeHashtag === tag) {
      setActiveHashtag("") // klik lagi untuk reset filter
    } else {
      setActiveHashtag(tag)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Page Header */}
      <section className="bg-muted py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Semua Properti</h1>
          <p className="text-muted-foreground mb-4">
            Jelajahi koleksi lengkap properti kami di Surabaya
          </p>

          {/* Hashtags */}
          {allHashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allHashtags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleHashtagClick(tag)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    activeHashtag === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={property.featured_image_url || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                      {property.property_type}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-semibold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-muted-foreground text-sm mb-3">
                      <MapPin className="w-4 h-4 ms-1 shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-border text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Harga</p>
                        <p className="font-bold text-primary text-sm">Rp {property.price.toLocaleString("id-ID")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Luas</p>
                        <p className="font-bold text-foreground text-sm">{property.size_sqm} m²</p>
                      </div>
                    </div>

                    {property.social_links && (
                  <div className="mt-2 text-sm text-muted-foreground flex flex-col gap-2 pb-3">
                    {property.social_links.tiktok && (
                      <a
                        href={property.social_links.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-3 py-1 border rounded-lg text-primary hover:bg-primary hover:text-white transition"
                      >
                        TikTok Link
                      </a>
                    )}
                    {property.social_links.instagram && (
                      <a
                        href={property.social_links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-3 py-1 border rounded-lg text-primary hover:bg-primary hover:text-white transition"
                      >
                        Instagram Feed
                      </a>
                    )}
                  </div>
                    )}

                    <Link
                      href={`/properties/${property.id}`}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-muted hover:bg-primary hover:text-primary-foreground text-foreground rounded-lg transition-colors font-medium text-xs"
                    >
                      Detail
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}


export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <PropertiesPage />
    </Suspense>
  )
}