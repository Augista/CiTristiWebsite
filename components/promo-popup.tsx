"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Link from "next/link"

interface PromoPopupProps {
  displayFrequency?: "once_per_session" | "always" | "once_per_day"
}

export default function PromoPopup({ displayFrequency = "once_per_session" }: PromoPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [promo, setPromo] = useState<null | {
    id: number
    title: string
    description?: string
    featured_image_url?: string
  }>(null)

  // Fetch promo property
useEffect(() => {
  const fetchPromo = async () => {
    try {
      const res = await fetch("/api/properties")
      const data: {
        id: number
        title: string
        description?: string
        featured_image_url?: string
        is_popup_promo?: boolean
      }[] = await res.json()
      console.log("Promo data fetched:", data) 

      const promoProperties = data.filter((p) => p.is_popup_promo)

      if (promoProperties.length > 0) {
        // Urutkan dari terbaru berdasarkan id
        promoProperties.sort((a, b) => b.id - a.id) // sekarang TS ngerti tipe a dan b
        setPromo(promoProperties[0])
      } else {
        setPromo({
          id: 999,
          title: "Promo Test",
          description: "Ini adalah promo test",
          featured_image_url: "/placeholder.svg",
        })
      }
    } catch (err) {
      console.error("Failed to fetch promo property:", err)
    }
  }
  fetchPromo()
}, [])




  // Handle visibility with session storage
  useEffect(() => {
  if (!promo) return

  if (displayFrequency === "always") {
    // Selalu munculkan popup setelah 1.5 detik
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1500)

    return () => clearTimeout(timer)
  }

  const storageKey = `promo_${promo.id}_${displayFrequency}`
  const wasShown = sessionStorage.getItem(storageKey)

  if (!wasShown) {
    const timer = setTimeout(() => {
      setIsVisible(true)
      sessionStorage.setItem(storageKey, "true")
    }, 1500)
    return () => clearTimeout(timer)
  }
}, [promo, displayFrequency])


  if (!isVisible || !promo) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {promo.featured_image_url && (
          <div className="relative w-full h-48 overflow-hidden bg-gray-100">
            <img src={promo.featured_image_url} alt={promo.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-3">{promo.title}</h2>
          {promo.description && <p className="text-muted-foreground mb-6 text-base leading-relaxed">{promo.description}</p>}

          <Link
            href={`/properties/${promo.id}`}
            onClick={() => setIsVisible(false)}
            className="block w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold text-center mb-3"
          >
            Lihat Properti
          </Link>

          <button
            onClick={() => setIsVisible(false)}
            className="w-full py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
