"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isKPROpen, setIsKPROpen] = useState(false)
  const kprRef = useRef<HTMLDivElement>(null)

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-serif font-bold text-primary tracking-wide">CI TRISTI</span>
            <span className="text-sm font-light text-muted-foreground ml-1">PROPERTY</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Beranda
            </Link>
            <Link
              href="/properties"
              className="text-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              Properti
            </Link>
            <Link href="/search" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Cari Properti
            </Link>

            <div className="relative" ref={kprRef}>
              <button
                onClick={() => setIsKPROpen(!isKPROpen)}
                className="flex items-center gap-1 text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                KPR
                <ChevronDown className="w-4 h-4" />
              </button>

              {isKPROpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2">
                  <Link
                    href="/kpr/calculator"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                  >
                    Kalkulator KPR
                  </Link>
                  <Link
                    href="/kpr/consultation"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                  >
                    Konsultasi KPR
                  </Link>
                  <Link
                    href="/kpr/interest-rates"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                  >
                    Suku Bunga KPR
                  </Link>
                </div>
              )}
            </div>

            <a href="#contact" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Kontak
            </a>

            {/* Admin link for demo mode */}
            <Link
              href="/admin/dashboard"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-accent transition-colors text-sm font-medium"
            >
              Admin
            </Link>
          </div>

          {/* Right side - Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-md hover:bg-muted">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="/" className="block text-foreground hover:text-primary py-2 text-sm">
              Beranda
            </Link>
            <Link href="/properties" className="block text-foreground hover:text-primary py-2 text-sm">
              Properti
            </Link>
            <Link href="/search" className="block text-foreground hover:text-primary py-2 text-sm">
              Cari Properti
            </Link>

            <div className="space-y-2">
              <p className="text-foreground py-2 text-sm font-medium">KPR</p>
              <Link href="/kpr/calculator" className="block text-foreground hover:text-primary py-2 text-sm ml-4">
                Kalkulator KPR
              </Link>
              <Link href="/kpr/consultation" className="block text-foreground hover:text-primary py-2 text-sm ml-4">
                Konsultasi KPR
              </Link>
              <Link href="/kpr/interest-rates" className="block text-foreground hover:text-primary py-2 text-sm ml-4">
                Suku Bunga KPR
              </Link>
            </div>

            <a href="#contact" className="block text-foreground hover:text-primary py-2 text-sm">
              Kontak
            </a>

            {/* Admin link for demo mode */}
            <Link
              href="/admin/dashboard"
              className="block w-full px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-accent transition-colors text-sm font-medium text-center"
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
