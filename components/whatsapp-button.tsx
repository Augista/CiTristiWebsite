"use client"

import { MessageCircle } from "lucide-react"
import { useState } from "react"

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
}

export default function WhatsAppButton({
  phoneNumber = "6281234567890",
  message = "Halo, saya tertarik dengan properti Anda. Bisakah saya mendapat informasi lebih lanjut?",
}: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Hubungi via WhatsApp"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </button>

      {isHovered && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-lg p-3 whitespace-nowrap text-sm font-medium text-foreground border border-border">
          Hubungi Kami via WhatsApp
        </div>
      )}
    </div>
  )
}
