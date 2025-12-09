"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Link from "next/link"
import { DollarSign, Home, Percent, Clock } from "lucide-react"

export default function KPRCalculator() {
  const [homePrice, setHomePrice] = useState(500_000_000)
  const [downPayment, setDownPayment] = useState(100_000_000)
  const [interestRate, setInterestRate] = useState(5.5)
  const [loanTerm, setLoanTerm] = useState(20)
  const [monthlyIncome, setMonthlyIncome] = useState(30_000_000)
  const [otherInstallments, setOtherInstallments] = useState(0)

  const [results, setResults] = useState({
    loanAmount: 0,
    monthlyPayment: 0,
    paymentRatio: 0,
    totalInterest: 0,
    totalPayment: 0,
  })

  useEffect(() => {
    calculateKPR()
  }, [homePrice, downPayment, interestRate, loanTerm, monthlyIncome, otherInstallments])

  const calculateKPR = () => {
    const principal = homePrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    let monthlyPayment = 0
    if (monthlyRate > 0) {
      monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    }

    const totalPayment = monthlyPayment * numberOfPayments
    const totalInterest = totalPayment - principal
    const totalInstallments = monthlyPayment + otherInstallments
    const paymentRatio = (totalInstallments / monthlyIncome) * 100

    setResults({
      loanAmount: principal,
      monthlyPayment,
      paymentRatio,
      totalInterest,
      totalPayment,
    })
  }

  // Format currency: Rp 500.000.000
  const formatCurrency = (value: number) => {
    return "Rp " + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Format number: 500.000.000
  const formatNumber = (value: number) => {
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Input handlers to allow formatting while typing
  const handleHomePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\./g, "")
    if (!isNaN(Number(value))) {
      setHomePrice(Number(value))
    }
  }

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\./g, "")
    if (!isNaN(Number(value))) {
      setDownPayment(Number(value))
    }
  }

  const handleMonthlyIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\./g, "")
    if (!isNaN(Number(value))) {
      setMonthlyIncome(Number(value))
    }
  }

  const handleOtherInstallmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\./g, "")
    if (!isNaN(Number(value))) {
      setOtherInstallments(Number(value))
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">Kalkulator KPR</h1>
            <p className="text-lg text-muted-foreground">
              Hitung cicilan KPR Anda dengan mudah. Masukkan data properti dan data keuangan Anda untuk mendapatkan
              estimasi cicilan bulanan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calculator Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-8">Input Data</h2>

                {/* Harga Rumah */}
                <div className="mb-8">
                  <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Home className="w-4 h-4 text-primary" />
                    Harga Rumah
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      min={100_000_000}
                      max={5_000_000_000}
                      step={50_000_000}
                      value={homePrice}
                      onChange={(e) => setHomePrice(Number(e.target.value))}
                      className="flex-1"
                    />
                    <input
                      type="text"
                      value={formatNumber(homePrice)}
                      onChange={handleHomePriceChange}
                      className="w-32 px-3 py-2 border border-border rounded-lg text-sm"
                    />
                  </div>
                  <p className="text-lg font-bold text-primary mt-2">{formatCurrency(homePrice)}</p>
                </div>

                {/* Uang Muka */}
                <div className="mb-8">
                  <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <DollarSign className="w-4 h-4 text-primary" />
                    Uang Muka (DP)
                  </label>
                  <div className="flex gap-2 items-center mb-3">
                    <input
                      type="range"
                      min={0}
                      max={homePrice * 0.5}
                      step={10_000_000}
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="flex-1"
                    />
                    <input
                      type="text"
                      value={formatNumber(downPayment)}
                      onChange={handleDownPaymentChange}
                      className="w-32 px-3 py-2 border border-border rounded-lg text-sm"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {((downPayment / homePrice) * 100).toFixed(1)}% dari harga rumah
                  </p>
                </div>

                {/* Bunga */}
                <div className="mb-8">
                  <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Percent className="w-4 h-4 text-primary" />
                    Suku Bunga per Tahun (%)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      min={2}
                      max={12}
                      step={0.1}
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-20 px-3 py-2 border border-border rounded-lg text-sm"
                      step={0.1}
                    />
                  </div>
                </div>

                {/* Jangka Waktu */}
                <div className="mb-8">
                  <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Clock className="w-4 h-4 text-primary" />
                    Jangka Waktu Kredit (Tahun)
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {[5, 10, 15, 20, 25, 30].map((year) => (
                      <button
                        key={year}
                        onClick={() => setLoanTerm(year)}
                        className={`py-2 px-3 rounded-lg border transition-colors font-medium text-sm ${
                          loanTerm === year
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {year} Th
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="my-8" />

                {/* Penghasilan */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <DollarSign className="w-4 h-4 text-primary" />
                    Total Penghasilan Bulanan (Gabungan Suami-Istri)
                  </label>
                  <input
                    type="text"
                    value={formatNumber(monthlyIncome)}
                    onChange={handleMonthlyIncomeChange}
                    className="w-full px-4 py-2 border border-border rounded-lg"
                  />
                </div>

                {/* Cicilan Lain */}
                <div className="mb-6">
                  <label className="text-sm font-semibold mb-3 block">Cicilan Aktif Lainnya (per Bulan)</label>
                  <input
                    type="text"
                    value={formatNumber(otherInstallments)}
                    onChange={handleOtherInstallmentsChange}
                    placeholder="Contoh: mobil, motor, kartu kredit"
                    className="w-full px-4 py-2 border border-border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-1">
              <div className="bg-primary text-primary-foreground rounded-lg p-8 sticky top-24">
                <h3 className="text-xl font-semibold mb-6">Hasil Kalkulasi</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm opacity-90">Limit Kredit</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.loanAmount)}</p>
                  </div>

                  <div className="border-t border-primary-foreground/20 pt-4">
                    <p className="text-sm opacity-90">Cicilan per Bulan</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.monthlyPayment)}</p>
                  </div>

                  <div className="border-t border-primary-foreground/20 pt-4">
                    <p className="text-sm opacity-90">Persentase Cicilan / Pendapatan</p>
                    <p className="text-2xl font-bold">{results.paymentRatio.toFixed(1)}%</p>
                    <p className={`text-xs mt-1 ${results.paymentRatio < 40 ? "text-green-300" : "text-red-300"}`}>
                      {results.paymentRatio < 40
                        ? "✓ Pengajuan kemungkinan diterima"
                        : "✗ Pengajuan kemungkinan ditolak"}
                    </p>
                  </div>

                  <div className="border-t border-primary-foreground/20 pt-4 text-sm">
                    <p className="opacity-90 mb-1">Total Bunga: {formatCurrency(results.totalInterest)}</p>
                    <p className="opacity-90">Total Bayar: {formatCurrency(results.totalPayment)}</p>
                  </div>
                </div>

                <Link
                  href="/kpr/consultation"
                  className="w-full mt-8 py-2 bg-background text-foreground rounded-lg hover:bg-muted transition-colors font-medium text-center text-sm block"
                >
                  Konsultasi KPR
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-muted rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Catatan:</strong> Kalkulator ini hanya untuk estimasi. Perhitungan sebenarnya mungkin berbeda
              tergantung pada kebijakan bank dan faktor-faktor lainnya. Pengajuan KPR kemungkinan besar diterima apabila
              persentase cicilan lebih rendah dari 40%. Hubungi agen kami untuk konsultasi lebih detail.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
