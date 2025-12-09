"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin } from "lucide-react"

export default function SearchBar() {
  const router = useRouter()
  const [keyword, setKeyword] = useState("")

  const handleSearch = () => {
    if (!keyword.trim()) return
    router.push(`/properties?q=${encodeURIComponent(keyword)}`)
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-4 md:p-6 flex items-center gap-4">
      <div className="flex items-center gap-2 flex-1 border rounded-lg px-3 py-2">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari lokasi atau tipe: Contoh: Rumah Citraland"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full bg-transparent placeholder:text-muted-foreground text-sm outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <button
        onClick={handleSearch}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors font-medium"
      >
        <Search className="w-3 h-3" />
        Cari
      </button>
    </div>
  )
}
