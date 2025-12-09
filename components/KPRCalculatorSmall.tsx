"use client";

import { useState, useEffect } from "react";

export default function KPRCalculatorSmall({ price }: { price: number }) {
  // state
  const [homePrice, setHomePrice] = useState(price);
  const [downPayment, setDownPayment] = useState(Math.floor(price * 0.2));
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(20);
  const [monthlyIncome, setMonthlyIncome] = useState(30_000_000);
  const [otherInstallments, setOtherInstallments] = useState(0);

  const [results, setResults] = useState({
    loanAmount: 0,
    monthlyPayment: 0,
    paymentRatio: 0,
    totalInterest: 0,
    totalPayment: 0,
  });

  // formatting
  const formatCurrency = (value: number) =>
    "Rp " + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const formatNumber = (value: number) =>
    value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // handle input formatted text
  const parseInput = (value: string) => Number(value.replace(/\./g, "") || "0");

  const calculateKPR = () => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    const totalInstallments = monthlyPayment + otherInstallments;
    const paymentRatio = (totalInstallments / monthlyIncome) * 100;

    setResults({
      loanAmount: principal,
      monthlyPayment,
      paymentRatio,
      totalInterest,
      totalPayment,
    });
  };

  useEffect(() => {
    calculateKPR();
  }, [homePrice, downPayment, interestRate, loanTerm, monthlyIncome, otherInstallments]);

  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4">
      <h3 className="text-lg font-semibold">Simulasi KPR</h3>

      {/* Harga Rumah */}
      <div>
        <label className="text-sm font-medium">Harga Rumah</label>
        <input
          type="text"
          value={formatNumber(homePrice)}
          onChange={(e) => setHomePrice(parseInput(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg mt-1"
        />
      </div>

      {/* DP */}
      <div>
        <label className="text-sm font-medium">Uang Muka (DP)</label>
        <input
          type="text"
          value={formatNumber(downPayment)}
          onChange={(e) => setDownPayment(parseInput(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          {(downPayment / homePrice * 100).toFixed(1)}% dari harga rumah
        </p>
      </div>

      {/* Bunga */}
      <div>
        <label className="text-sm font-medium">Suku Bunga (%)</label>
        <input
          type="number"
          step="0.1"
          value={interestRate}
          onChange={(e) => setInterestRate(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg mt-1"
        />
      </div>

      {/* Tenor */}
      <div>
        <label className="text-sm font-medium">Tenor (Tahun)</label>
        <select
          className="w-full px-3 py-2 border rounded-lg mt-1"
          value={loanTerm}
          onChange={(e) => setLoanTerm(Number(e.target.value))}
        >
          {[5, 10, 15, 20, 25, 30].map((y) => (
            <option key={y} value={y}>{y} Tahun</option>
          ))}
        </select>
      </div>

      {/* Penghasilan */}
      <div>
        <label className="text-sm font-medium">Penghasilan Bulanan</label>
        <input
          type="text"
          value={formatNumber(monthlyIncome)}
          onChange={(e) => setMonthlyIncome(parseInput(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg mt-1"
        />
      </div>

      {/* Cicilan aktif */}
      <div>
        <label className="text-sm font-medium">Cicilan Lain per Bulan</label>
        <input
          type="text"
          value={formatNumber(otherInstallments)}
          onChange={(e) => setOtherInstallments(parseInput(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg mt-1"
        />
      </div>

      {/* Output */}
      <div className="p-4 rounded-lg bg-primary text-white space-y-3">
        <div>
          <p className="text-sm opacity-80">Limit Kredit</p>
          <p className="text-xl font-bold">{formatCurrency(results.loanAmount)}</p>
        </div>

        <div>
          <p className="text-sm opacity-80">Cicilan / Bulan</p>
          <p className="text-xl font-bold">{formatCurrency(results.monthlyPayment)}</p>
        </div>

        <div>
          <p className="text-sm opacity-80">% Cicilan / Penghasilan</p>
          <p className="text-xl font-bold">{results.paymentRatio.toFixed(1)}%</p>

          <p
            className={`text-xs mt-1 ${
              results.paymentRatio < 40 ? "text-green-300" : "text-red-300"
            }`}
          >
            {results.paymentRatio < 40
              ? "✓ Pengajuan kemungkinan diterima"
              : "✗ Pengajuan kemungkinan ditolak"}
          </p>
        </div>

        <div className="text-xs opacity-80 pt-2 border-t border-white/30">
          <p>Total Bunga: {formatCurrency(results.totalInterest)}</p>
          <p>Total Bayar: {formatCurrency(results.totalPayment)}</p>
        </div>
      </div>
    </div>
  );
}
