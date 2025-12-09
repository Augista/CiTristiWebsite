"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { MapPin, Home, Maximize2, DollarSign, Phone, Mail, X } from "lucide-react"
import Link from "next/link"
import KPRCalculatorSmall from "@/components/KPRCalculatorSmall"


interface Property {
  id: number
  title: string
  price: number
  location: string
  district: string
  property_type: string
  size_sqm: number
  bedrooms: number
  bathrooms: number
  featured_image_url: string
  gallery_images: string[]
  description: string
  amenities: string[]
  contact_phone: string
  contact_email: string
  social_links?: { [key: string]: string }
  hashtags?: string[]
}


export default function PropertyDetailPage() {
  const params = useParams()
  const propertyId = params.id as string
  const [property, setProperty] = useState<Property | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}`)
        if (response.ok) {
          const data = await response.json()
          setProperty(data)
        } else {
          console.error("Failed to fetch property", response.status)
        }
      } catch (error) {
        console.error(" Fetch property error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!property) return <div className="min-h-screen flex items-center justify-center">Properti tidak ditemukan</div>

  const allImages = [property.featured_image_url, ...(property.gallery_images || [])].filter(Boolean)

  const rawHashtags: any = property?.hashtags ?? [];


  const hashtags =
    Array.isArray(rawHashtags)
      ? rawHashtags
      : typeof rawHashtags === "string"
      ? rawHashtags
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean)
      : [];


const SocialIcon = ({ type }: { type: string }) => {
  const icons: Record<string, string> = {
    tiktok: "/icons/tiktok.png",
    instagram: "/icons/instagram.png",
    youtube: "/icons/youtube.png",
  };

  const src = icons[type] ?? "/icons/default.svg";

  return (
    <img
      src={src}
      alt={type}
      className="w-5 h-5 object-contain"
      draggable={false}
    />
  );
};




  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section with Gallery */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Image */}
        <div className="w-full">
          <img
            src={allImages[activeImage] || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-[300px] md:h-[400px] object-cover rounded-xl shadow-md"
          />
        </div>

        {/* Thumbnail Gallery */}
        <div className="flex md:flex-row flex-row md:mt-4 gap-3 overflow-x-auto mt-4 pb-2">
          {allImages.slice(0, 5).map((img: string, idx: number) => (
            <img
              key={idx}
              src={img || "/placeholder.svg"}
              alt={`Foto ${idx + 1}`}
              className={`w-24 h-24 object-cover rounded-lg border cursor-pointer transition-all shrink-0 ${
                activeImage === idx ? "ring-2 ring-primary" : "opacity-90 hover:opacity-100"
              }`}
              onClick={() => setActiveImage(idx)}
            />
          ))}

          {allImages.length > 5 && (
            <div
              className="relative w-24 h-24 rounded-lg overflow-hidden cursor-pointer shrink-0"
              onClick={() => setShowGallery(true)}
            >
              <img src={allImages[5] || "/placeholder.svg"} alt="Lihat Semua" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-sm">
                +{allImages.length - 5} Foto
              </div>
            </div>
          )}
        </div>

        {/* Modal Gallery */}
        {showGallery && (
          <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-60"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="max-w-5xl w-full px-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-8">
                {allImages.map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img || "/placeholder.svg"}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-56 object-cover rounded-lg border hover:opacity-80 cursor-pointer"
                    onClick={() => {
                      setActiveImage(idx)
                      setShowGallery(false)
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-serif font-bold mb-3">{property.title}</h1>
              <div className="flex items-center text-lg text-primary font-bold mb-4">Rp {property.price.toLocaleString("id-ID")}</div>
              <div className="flex items-center text-muted-foreground text-lg mb-6">
                <MapPin className="w-5 h-5 ms-2" />
                {property.location}, {property.district}
              </div>

              {/* Social links + Hashtags */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  {property.social_links && Object.entries(property.social_links).map(([k, v]) => (
                    v ? (
                      <a
                        key={k}
                        href={v}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-border rounded-md px-3 py-1 text-sm hover:bg-muted"
                      >
                        <SocialIcon type={k} />
                        <span className="truncate max-w-[140px]">{k}</span>
                      </a>
                    ) : null
                  ))}
                </div>

              {hashtags.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-4">
                  {hashtags.map((h) => (
                    <Link
                      key={h}
                      href={`/properties?hashtag=${encodeURIComponent(h)}`}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20"
                    >
                      #{h}
                    </Link>
                  ))}
                </div>
              )}
              </div>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-border">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Kamar Tidur</p>
                <p className="text-2xl font-bold text-foreground">{property.bedrooms}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                  <Maximize2 className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Luas Tanah</p>
                <p className="text-2xl font-bold text-foreground">{property.size_sqm} m²</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Kamar Mandi</p>
                <p className="text-2xl font-bold text-foreground">{property.bathrooms}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Deskripsi</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Fasilitas</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity: string, idx: number) => (
                    <div key={idx} className="flex items-center text-foreground">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center ms-3 shrink-0">
                        <span className="text-primary-foreground text-xs font-bold">✓</span>
                      </div>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Contact & CTA */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-4">
              <h3 className="text-xl font-semibold mb-6">Hubungi Kami</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Telepon</p>
                    <p className="font-semibold text-foreground">{property.contact_phone || "+62 31 2345 6789"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-semibold text-foreground">{property.contact_email || "info@properti-surabaya.com"}</p>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold mb-3">
                Hubungi Agen
              </button>

              <button className="w-full py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold mb-6">
                Ajukan Penawaran
              </button>

              <Link href="/search" className="block text-center text-primary hover:text-accent text-sm font-medium">
                ← Kembali ke Pencarian
              </Link>

              {/* Compact KPR Calculator inserted here */}
              <KPRCalculatorSmall price={property.price} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
