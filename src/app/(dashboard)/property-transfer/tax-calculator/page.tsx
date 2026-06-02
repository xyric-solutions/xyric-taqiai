"use client";

import { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Calculator, Info, Plus, Trash2, Printer,
  ChevronDown, ChevronUp, CheckCircle2,
  LandPlot, Home, Sprout,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PropertyType   = "plot" | "house" | "agriculture";
type TransactionType = "sale" | "gift" | "inheritance" | "mortgage";
type FilerStatus    = "filer" | "non-filer";
type DcRateMode     = "per-marla" | "per-sqft";

interface OtherFee { id: string; label: string; amount: string; }

interface SizeInput { acre: string; kanal: string; marla: string; sqft: string; }

interface TaxResult {
  // Size
  totalSqft: number;
  totalMarla: number;
  totalKanal: number;
  totalAcre: number;
  remainingKanal: number;
  remainingMarla: number;
  remainingSqft: number;
  // Valuation
  dcRatePerSqft: number;
  dcRatePerMarla: number;
  landValueDC: number;
  malbaValue: number;
  totalDCValuation: number;
  marketValue: number;
  higherValue: number;
  // Taxes
  stampDuty: number;
  cvt: number;
  registrationFee: number;
  plraTax: number;
  whtBuyer: number;
  whtSeller: number;
  capitalGainTax: number;
  localCommission: number;
  otherFeesTotal: number;
  grandTotal: number;
  stampDutyRate: number;
  cvtRate: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STAMP_DUTY: Record<string, number> = {
  punjab: 0.05, sindh: 0.02, kpk: 0.04, balochistan: 0.04, islamabad: 0.04,
};

const CVT_RATES: Record<string, number> = {
  punjab: 0.02, sindh: 0.02, kpk: 0.02, balochistan: 0.02, islamabad: 0.02,
};

const COURTS = [
  "Lahore High Court", "Islamabad High Court", "Sindh High Court",
  "Peshawar High Court", "Balochistan High Court", "Supreme Court of Pakistan",
  "Sessions Court",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcSize(s: SizeInput, sqftPerMarla: number) {
  const acre  = Math.max(0, parseFloat(s.acre)  || 0);
  const kanal = Math.max(0, parseFloat(s.kanal) || 0);
  const marla = Math.max(0, parseFloat(s.marla) || 0);
  const sqft  = Math.max(0, parseFloat(s.sqft)  || 0);

  const totalSqft =
    acre  * 8 * 20 * sqftPerMarla +
    kanal * 20 * sqftPerMarla     +
    marla * sqftPerMarla          +
    sqft;

  const totalMarla = totalSqft / sqftPerMarla;

  // breakdown
  const totalAcre      = Math.floor(totalMarla / (8 * 20));
  const rem1           = totalMarla - totalAcre * 8 * 20;
  const remainingKanal = Math.floor(rem1 / 20);
  const rem2           = rem1 - remainingKanal * 20;
  const remainingMarla = Math.floor(rem2);
  const remainingSqft  = Math.round((rem2 - remainingMarla) * sqftPerMarla);

  return {
    totalSqft,
    totalMarla,
    totalKanal: totalMarla / 20,
    totalAcre,
    remainingKanal,
    remainingMarla,
    remainingSqft,
  };
}

const fmt = (n: number) =>
  `PKR ${n.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const fmtNum = (n: number, dec = 2) => n.toFixed(dec);

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepBadge({ n }: { n: number }) {
  return (
    <div className="w-6 h-6 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
      {n}
    </div>
  );
}

function StepCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center gap-2.5">
        <StepBadge n={step} />
        <h2 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wide">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

const inputCls  = "w-full px-3 py-2 border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/40 bg-[var(--bg-surface-1)] text-[var(--text-primary)] text-sm placeholder-[var(--text-tertiary)]";
const labelCls  = "block text-xs font-semibold text-[var(--text-secondary)] mb-1";
const selectCls = "w-full px-3 py-2 border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/40 bg-[var(--bg-surface-1)] text-[var(--text-primary)] text-sm";

function SegBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold border transition-all ${
        active
          ? "border-primary-500 bg-primary-500/10 text-primary-400"
          : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-secondary)]"
      }`}
    >
      {children}
    </button>
  );
}

function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-4 h-4 rounded-full border border-[var(--border-default)] text-[var(--text-tertiary)] text-[10px] font-bold leading-none hover:border-primary-500/50 hover:text-primary-400 transition-colors">
        ?
      </button>
      {open && (
        <div className="absolute left-5 top-0 z-10 w-56 bg-[var(--bg-surface-4)] border border-[var(--border-strong)] text-[var(--text-primary)] text-[11px] rounded-lg p-2.5 shadow-xl">
          {text}
          <button onClick={() => setOpen(false)} className="ml-1 text-[var(--text-secondary)] hover:text-white">✕</button>
        </div>
      )}
    </span>
  );
}

function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-1.5 border-b border-[var(--bg-surface-2)] last:border-0 ${bold ? "font-bold" : ""} ${highlight ? "bg-primary-500/10 -mx-3 px-3 rounded-lg" : ""}`}>
      <span className="text-[var(--text-secondary)] text-xs">{label}</span>
      <span className={`font-semibold text-sm ${highlight ? "text-primary-400" : "text-[var(--text-primary)]"}`}>{value}</span>
    </div>
  );
}

function TotalRow({ label, value, color }: { label: string; value: string; color: "blue" | "orange" | "emerald" }) {
  const cls =
    color === "blue"    ? "bg-info-500/10 text-info-500"        :
    color === "orange"  ? "bg-warning-500/10 text-warning-500"  :
                          "bg-primary-500/10 text-primary-400";
  return (
    <div className={`flex justify-between items-center py-2 px-3 rounded-lg mt-2 ${cls}`}>
      <span className="font-bold text-xs uppercase tracking-wide">{label}</span>
      <span className="font-bold text-sm">{value}</span>
    </div>
  );
}

function CollapsibleCard({ title, badge, color, children }: {
  title: string; badge?: string; color: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[var(--bg-surface-2)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <span className="text-sm font-bold text-[var(--text-secondary)]">{title}</span>
          {badge && <span className="text-xs bg-[var(--bg-surface-2)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full font-medium">{badge}</span>}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-[var(--text-tertiary)]" /> : <ChevronDown className="h-4 w-4 text-[var(--text-tertiary)]" />}
      </button>
      {open && <div className="px-5 pb-4 space-y-1.5 border-t border-[var(--bg-surface-2)] pt-3">{children}</div>}
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TaxCalculatorPage() {
  // Size
  const [size, setSize]               = useState<SizeInput>({ acre: "", kanal: "", marla: "", sqft: "" });
  const [sqftPerMarla, setSqftPerMarla] = useState<272.25 | 225>(272.25);

  // Property
  const [propertyType, setPropertyType]       = useState<PropertyType>("plot");
  const [province, setProvince]               = useState("punjab");
  const [transactionType, setTransactionType] = useState<TransactionType>("sale");

  // DC Valuation
  const [dcRateMode, setDcRateMode]     = useState<DcRateMode>("per-marla");
  const [dcRateMarla, setDcRateMarla]   = useState("");
  const [dcRateSqft, setDcRateSqft]     = useState("");
  const [malbaRate, setMalbaRate]       = useState("");
  const [malbaRateMode, setMalbaRateMode] = useState<"per-marla" | "per-sqft">("per-sqft");
  const [landRateVisible, setLandRateVisible] = useState(false);

  // Market value
  const [marketValue, setMarketValue] = useState("");

  // FBR
  const [buyerFilerStatus, setBuyerFilerStatus]   = useState<FilerStatus>("filer");
  const [sellerFilerStatus, setSellerFilerStatus] = useState<FilerStatus>("filer");
  const [whtBuyerRate, setWhtBuyerRate]   = useState("3");
  const [whtSellerRate, setWhtSellerRate] = useState("3");

  // CGT
  const [purchasePrice, setPurchasePrice] = useState("");
  const [cgtRate, setCgtRate]             = useState("");

  // Fees
  const [localCommission, setLocalCommission] = useState("");
  const [otherFees, setOtherFees]             = useState<OtherFee[]>([]);

  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError]   = useState("");

  // ── Live size preview ──────────────────────────────────────────────────────
  const liveSize = useMemo(() => calcSize(size, sqftPerMarla), [size, sqftPerMarla]);
  const hasSize  = liveSize.totalSqft > 0;

  // ── Live Land Rate preview (for "Find Land Rate" box) ─────────────────────
  const liveLandRate = useMemo(() => {
    const dcPerSqft  = dcRateMode === "per-marla"
      ? (parseFloat(dcRateMarla) || 0) / sqftPerMarla
      : (parseFloat(dcRateSqft)  || 0);
    const dcPerMarla = dcPerSqft * sqftPerMarla;
    const landValue  = liveSize.totalSqft * dcPerSqft;
    const malbaVal   = parseFloat(malbaRate) || 0;
    const malbaValue = propertyType === "house"
      ? malbaRateMode === "per-sqft"
        ? liveSize.totalSqft  * malbaVal
        : liveSize.totalMarla * malbaVal
      : 0;
    return { dcPerSqft, dcPerMarla, landValue, malbaValue, totalValue: landValue + malbaValue };
  }, [dcRateMode, dcRateMarla, dcRateSqft, sqftPerMarla, liveSize, malbaRate, malbaRateMode, propertyType]);

  // ── Other fee helpers ──────────────────────────────────────────────────────
  const addOtherFee    = () => setOtherFees(p => [...p, { id: Date.now().toString(), label: "", amount: "" }]);
  const removeOtherFee = (id: string) => setOtherFees(p => p.filter(f => f.id !== id));
  const updateOtherFee = (id: string, k: "label" | "amount", v: string) =>
    setOtherFees(p => p.map(f => f.id === id ? { ...f, [k]: v } : f));

  // ── Calculate ──────────────────────────────────────────────────────────────
  const calculate = () => {
    setError("");
    const { totalSqft, totalMarla } = liveSize;
    const market = parseFloat(marketValue);

    if (!hasSize)            { setError("Enter the property size (Acre / Kanal / Marla / Sqft)"); return; }
    if (!market || market <= 0) { setError("Enter the market value"); return; }

    // DC Rate
    let dcRatePerSqftVal  = 0;
    let dcRatePerMarlaVal = 0;

    if (dcRateMode === "per-marla") {
      dcRatePerMarlaVal = parseFloat(dcRateMarla) || 0;
      dcRatePerSqftVal  = dcRatePerMarlaVal / sqftPerMarla;
      if (!dcRatePerMarlaVal) { setError("Enter DC rate per Marla"); return; }
    } else {
      dcRatePerSqftVal  = parseFloat(dcRateSqft) || 0;
      dcRatePerMarlaVal = dcRatePerSqftVal * sqftPerMarla;
      if (!dcRatePerSqftVal) { setError("Enter DC rate per Sqft"); return; }
    }

    const landValueDC  = totalSqft * dcRatePerSqftVal;
    const malbaRateVal = parseFloat(malbaRate) || 0;
    const malbaValue   = propertyType === "house"
      ? malbaRateMode === "per-sqft"
        ? totalSqft  * malbaRateVal
        : totalMarla * malbaRateVal
      : 0;
    const totalDCValuation = landValueDC + malbaValue;
    const higherValue = Math.max(totalDCValuation, market);

    // Provincial
    const stampDutyRate  = STAMP_DUTY[province] ?? 0.05;
    const cvtRate        = CVT_RATES[province]  ?? 0.02;
    const stampDuty      = higherValue * stampDutyRate;
    const cvt            = higherValue * cvtRate;
    const registrationFee = Math.min(higherValue * 0.01, 50000);
    const plraTax        = province === "punjab" ? higherValue * 0.01 : 0;

    // FBR
    const whtBuyer  = higherValue * (parseFloat(whtBuyerRate)  / 100);
    const whtSeller = higherValue * (parseFloat(whtSellerRate) / 100);

    // CGT
    const purchasePr     = parseFloat(purchasePrice) || 0;
    const gain           = purchasePr > 0 ? market - purchasePr : 0;
    const capitalGainTax = gain > 0 ? gain * ((parseFloat(cgtRate) || 0) / 100) : 0;

    // Fees
    const localComm     = parseFloat(localCommission) || 0;
    const otherFeesTotal = otherFees.reduce((s, f) => s + (parseFloat(f.amount) || 0), 0);

    const grandTotal =
      stampDuty + cvt + registrationFee + plraTax +
      whtBuyer + whtSeller + capitalGainTax +
      localComm + otherFeesTotal;

    setResult({
      ...liveSize,
      dcRatePerSqft: dcRatePerSqftVal,
      dcRatePerMarla: dcRatePerMarlaVal,
      landValueDC,
      malbaValue,
      totalDCValuation,
      marketValue: market,
      higherValue,
      stampDuty, cvt, registrationFee, plraTax,
      whtBuyer, whtSeller, capitalGainTax,
      localCommission: localComm,
      otherFeesTotal,
      grandTotal,
      stampDutyRate,
      cvtRate,
    });
  };

  const sizeField = (key: keyof SizeInput, label: string, placeholder: string, tip: string) => (
    <div>
      <label className={labelCls}>
        {label} <InfoTip text={tip} />
      </label>
      <input
        type="number"
        value={size[key]}
        onChange={e => setSize(p => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className={inputCls}
        min="0"
      />
    </div>
  );

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-500/10 border border-primary-500/20">
              <Calculator className="h-5 w-5 text-primary-400" strokeWidth={1.5} />
            </div>
            Property Tax Calculator
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            DC Rate, FBR WHT, Stamp Duty and CGT in one e-stamp-style breakdown
          </p>
          <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
            Rates last updated November 2024. Verify with the DC Office before filing.
          </p>
        </div>
        {result && (
          <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden flex items-center gap-2">
            <Printer className="h-4 w-4" /> Print Summary
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ══════════════════ INPUT PANEL ══════════════════ */}
        <div className="space-y-4">

          {/* Step 1 — Property Details */}
          <StepCard step={1} title="Property Details">
            <div className="grid grid-cols-3 gap-2">
              {([
                { t: "plot" as const,        icon: LandPlot, label: "Plot" },
                { t: "house" as const,       icon: Home,     label: "House" },
                { t: "agriculture" as const, icon: Sprout,   label: "Agriculture" },
              ]).map(({ t, icon: Icon, label }) => (
                <SegBtn key={t} active={propertyType === t}
                  onClick={() => { setPropertyType(t); if (t !== "house") setMalbaRate(""); }}>
                  <span className="flex items-center justify-center gap-1.5">
                    <Icon className="h-4 w-4" strokeWidth={1.5} /> {label}
                  </span>
                </SegBtn>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Transaction Type</label>
                <select value={transactionType} onChange={e => setTransactionType(e.target.value as TransactionType)} className={selectCls}>
                  <option value="sale">Sale / Transfer</option>
                  <option value="gift">Gift / Hibah</option>
                  <option value="inheritance">Inheritance / Wisasat</option>
                  <option value="mortgage">Mortgage / Rehaan</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Province / Region</label>
                <select value={province} onChange={e => setProvince(e.target.value)} className={selectCls}>
                  <option value="punjab">Punjab</option>
                  <option value="sindh">Sindh</option>
                  <option value="kpk">KPK</option>
                  <option value="balochistan">Balochistan</option>
                  <option value="islamabad">ICT Islamabad</option>
                </select>
              </div>
            </div>
          </StepCard>

          {/* Step 2 — Property Size (estamp style) */}
          <StepCard step={2} title="Property Size">

            {/* Marla standard */}
            <div>
              <label className={labelCls}>
                Marla Standard <InfoTip text="Punjab: 1 Marla = 272.25 Sqft (standard). Older / some KPK areas use 225 Sqft per Marla." />
              </label>
              <div className="flex gap-2">
                <SegBtn active={sqftPerMarla === 272.25} onClick={() => setSqftPerMarla(272.25)}>
                  272 Sqft / Marla
                </SegBtn>
                <SegBtn active={sqftPerMarla === 225} onClick={() => setSqftPerMarla(225)}>
                  225 Sqft / Marla
                </SegBtn>
              </div>
            </div>

            {/* 4 size fields */}
            <div className="grid grid-cols-2 gap-3">
              {sizeField("acre",  "Acre",  "0", "1 Acre = 8 Kanal = 160 Marla")}
              {sizeField("kanal", "Kanal", "0", "1 Kanal = 20 Marla")}
              {sizeField("marla", "Marla", "0", `1 Marla = ${sqftPerMarla} Sqft`)}
              {sizeField("sqft",  "Square Feet", "0", `${sqftPerMarla} Sqft = 1 Marla`)}
            </div>

            {/* Live conversion table */}
            {hasSize && (
              <div className="bg-primary-500/[0.06] border border-primary-500/20 rounded-xl p-4 mt-1">
                <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-2.5">Land Area Breakdown</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {[
                    { label: "Total Sqft",  value: `${fmtNum(liveSize.totalSqft, 2)} Sqft` },
                    { label: "Total Marla", value: `${fmtNum(liveSize.totalMarla, 4)} Marla` },
                    { label: "Total Kanal", value: `${fmtNum(liveSize.totalKanal, 3)} Kanal` },
                    { label: "Breakdown",
                      value: `${liveSize.totalAcre}A · ${liveSize.remainingKanal}K · ${liveSize.remainingMarla}M · ${liveSize.remainingSqft} Sqft` },
                  ].map(r => (
                    <div key={r.label} className="flex flex-col">
                      <span className="text-[10px] text-[var(--text-secondary)] font-semibold">{r.label}</span>
                      <span className="text-sm font-bold text-[var(--text-primary)]">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </StepCard>

          {/* Step 3 — DC Valuation */}
          <StepCard step={3} title="DC Valuation Rates">

            {/* DC Rate mode toggle */}
            <div>
              <label className={labelCls}>
                DC Rate Input Mode <InfoTip text="Enter whatever rate the DC office provides, whether per Marla or per Sqft. Both produce the same result." />
              </label>
              <div className="flex gap-2">
                <SegBtn active={dcRateMode === "per-marla"} onClick={() => { setDcRateMode("per-marla"); setLandRateVisible(false); }}>
                  Rate per Marla
                </SegBtn>
                <SegBtn active={dcRateMode === "per-sqft"} onClick={() => { setDcRateMode("per-sqft"); setLandRateVisible(false); }}>
                  Rate per Sqft
                </SegBtn>
              </div>
            </div>

            {/* DC Rate input */}
            {dcRateMode === "per-marla" ? (
              <div>
                <label className={labelCls}>DC Rate per Marla (PKR) <span className="text-red-500">*</span></label>
                <input type="number" value={dcRateMarla}
                  onChange={e => { setDcRateMarla(e.target.value); setLandRateVisible(false); }}
                  placeholder="e.g. 200,000" className={inputCls} min="0" />
              </div>
            ) : (
              <div>
                <label className={labelCls}>DC Rate per Sqft (PKR) <span className="text-red-500">*</span></label>
                <input type="number" value={dcRateSqft}
                  onChange={e => { setDcRateSqft(e.target.value); setLandRateVisible(false); }}
                  placeholder="e.g. 734" className={inputCls} min="0" />
              </div>
            )}

            {/* Malba — house only */}
            {propertyType === "house" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`${labelCls} mb-0`}>
                    Malba / Structure Rate (PKR) <InfoTip text="Value of the construction. DC Valuation = Land Value + Malba. On the e-stamp site this rate is per Sqft." />
                  </label>
                  <div className="flex gap-1">
                    {(["per-sqft", "per-marla"] as const).map(m => (
                      <button key={m} type="button"
                        onClick={() => { setMalbaRateMode(m); setLandRateVisible(false); }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                          malbaRateMode === m
                            ? "border-primary-500 bg-primary-500/10 text-primary-400"
                            : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-default)]"
                        }`}>
                        {m === "per-sqft" ? "per Sqft" : "per Marla"}
                      </button>
                    ))}
                  </div>
                </div>
                <input type="number" value={malbaRate}
                  onChange={e => { setMalbaRate(e.target.value); setLandRateVisible(false); }}
                  placeholder={malbaRateMode === "per-sqft" ? "e.g. 1,500 per Sqft" : "e.g. 80,000 per Marla"}
                  className={inputCls} min="0" />
              </div>
            )}

            {/* Find Land Rate buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const hasDcRate = dcRateMode === "per-marla"
                    ? !!parseFloat(dcRateMarla)
                    : !!parseFloat(dcRateSqft);
                  if (!hasSize)    { setError("Enter the property size first"); return; }
                  if (!hasDcRate)  { setError("Enter the DC rate"); return; }
                  setError("");
                  setLandRateVisible(true);
                }}
                className="flex-1 py-2.5 bg-gradient-to-b from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-primary-500/20"
              >
                Find Land Rate
              </button>
              <button
                type="button"
                onClick={() => {
                  setDcRateMarla(""); setDcRateSqft(""); setMalbaRate("");
                  setLandRateVisible(false); setError("");
                }}
                className="px-5 py-2.5 bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-default)] text-[var(--text-secondary)] text-sm font-bold rounded-xl transition-colors"
              >
                Reset
              </button>
            </div>

            {/* estamp-style Land Rate Summary */}
            {landRateVisible && (
              <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden mt-1">
                <div className="bg-[var(--bg-surface-1)] px-4 py-2.5 border-b border-[var(--border-subtle)]">
                  <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Land Rate Summary</p>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: "DC Rate (per Marla)",  value: `Rs. ${liveLandRate.dcPerMarla.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` },
                      { label: "DC Sqft Rate (per Sqft)", value: `Rs. ${liveLandRate.dcPerSqft.toFixed(2)}` },
                      { label: "Land Value (DC)",       value: `Rs. ${liveLandRate.landValue.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, bold: true },
                      ...(propertyType === "house" && liveLandRate.malbaValue > 0 ? [
                        { label: `Malba Value (${malbaRateMode === "per-sqft" ? `${fmtNum(liveSize.totalSqft,0)} Sqft × Rs.${malbaRate}` : `${fmtNum(liveSize.totalMarla,4)} Marla × Rs.${malbaRate}`})`,
                          value: `Rs. ${liveLandRate.malbaValue.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` },
                        { label: "Total Land Value (DC + Malba)", value: `Rs. ${liveLandRate.totalValue.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, bold: true, highlight: true },
                      ] : [
                        { label: "Total Land Value (DC)", value: `Rs. ${liveLandRate.totalValue.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, bold: true, highlight: true },
                      ]),
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-[var(--bg-surface-2)] last:border-0 ${row.highlight ? "bg-primary-500/10" : ""}`}>
                        <td className="px-4 py-2.5 text-[var(--text-secondary)] text-xs">{row.label}</td>
                        <td className={`px-4 py-2.5 text-right font-semibold text-xs ${row.highlight ? "text-primary-400" : "text-[var(--text-primary)]"} ${row.bold ? "font-bold" : ""}`}>
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </StepCard>

          {/* Step 4 — Market Value */}
          <StepCard step={4} title="Market / Transaction Value">
            <div>
              <label className={labelCls}>
                Actual Sale / Transaction Price (PKR) <span className="text-red-500">*</span>
                <InfoTip text="Tax is applied on whichever is higher — DC Valuation or Market Value. FBR and provinces both use the higher amount." />
              </label>
              <input type="number" value={marketValue} onChange={e => setMarketValue(e.target.value)}
                placeholder="e.g. 12,000,000" className={inputCls} min="0" />
            </div>
          </StepCard>

          {/* Step 5 — FBR WHT */}
          <StepCard step={5} title="FBR Withholding Tax">

            {/* Buyer 236K */}
            <div className="p-3.5 bg-info-500/[0.06] border border-info-500/20 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-info-500" />
                <p className="text-xs font-bold text-info-500">Buyer, Section 236K</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Filer Status</label>
                  <select value={buyerFilerStatus} onChange={e => setBuyerFilerStatus(e.target.value as FilerStatus)} className={selectCls}>
                    <option value="filer">Active Filer</option>
                    <option value="non-filer">Non-Filer</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>WHT Rate %</label>
                  <select value={whtBuyerRate} onChange={e => setWhtBuyerRate(e.target.value)} className={selectCls}>
                    <option value="3">3%</option>
                    <option value="6">6%</option>
                    <option value="10">10%</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Seller 236C */}
            <div className="p-3.5 bg-warning-500/[0.06] border border-warning-500/20 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-warning-500" />
                <p className="text-xs font-bold text-warning-500">Seller, Section 236C</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Filer Status</label>
                  <select value={sellerFilerStatus} onChange={e => setSellerFilerStatus(e.target.value as FilerStatus)} className={selectCls}>
                    <option value="filer">Active Filer</option>
                    <option value="non-filer">Non-Filer</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>WHT Rate %</label>
                  <select value={whtSellerRate} onChange={e => setWhtSellerRate(e.target.value)} className={selectCls}>
                    <option value="3">3%</option>
                    <option value="6">6%</option>
                    <option value="10">10%</option>
                  </select>
                </div>
              </div>
            </div>
          </StepCard>

          {/* Step 6 — CGT (optional) */}
          <StepCard step={6} title="Capital Gains Tax (Optional)">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>
                  Purchase / Cost Price (PKR)
                  <InfoTip text="Original price you paid. CGT is calculated on: Sale Price – Cost Price." />
                </label>
                <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)}
                  placeholder="Original cost" className={inputCls} min="0" />
              </div>
              <div>
                <label className={labelCls}>CGT Rate %</label>
                <input type="number" value={cgtRate} onChange={e => setCgtRate(e.target.value)}
                  placeholder="e.g. 15" className={inputCls} min="0" max="100" />
              </div>
            </div>
            {purchasePrice && cgtRate && marketValue && (
              <p className="text-[11px] text-primary-400 font-medium">
                Estimated CGT = {fmt(Math.max(0, parseFloat(marketValue) - parseFloat(purchasePrice)) * (parseFloat(cgtRate) / 100))}
              </p>
            )}
          </StepCard>

          {/* Step 7 — Other Fees */}
          <StepCard step={7} title="Fees &amp; Commission">
            <div>
              <label className={labelCls}>Local Commission / Dalali (PKR)</label>
              <input type="number" value={localCommission} onChange={e => setLocalCommission(e.target.value)}
                placeholder="e.g. 50,000" className={inputCls} min="0" />
            </div>
            {otherFees.map(fee => (
              <div key={fee.id} className="flex gap-2 items-start">
                <input value={fee.label} onChange={e => updateOtherFee(fee.id, "label", e.target.value)}
                  placeholder="Fee label (e.g. Patwari fee)" className={`${inputCls} flex-1`} />
                <input type="number" value={fee.amount} onChange={e => updateOtherFee(fee.id, "amount", e.target.value)}
                  placeholder="PKR" className={`${inputCls} w-28`} min="0" />
                <button onClick={() => removeOtherFee(fee.id)} className="p-2 text-[var(--text-tertiary)] hover:text-danger-500 mt-0.5">
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            ))}
            <button onClick={addOtherFee}
              className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 font-semibold">
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> Add other fee
            </button>
          </StepCard>

          {error && (
            <div className="flex items-center gap-2 text-sm text-danger-500 bg-danger-500/10 border border-danger-500/20 rounded-xl px-4 py-3">
              <Info className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} /> {error}
            </div>
          )}

          <Button onClick={calculate} className="w-full" size="lg">
            <Calculator className="h-4 w-4" />
            Calculate Tax
          </Button>
        </div>

        {/* ══════════════════ RESULTS PANEL ══════════════════ */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* ── Size Summary ── */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-primary-400" strokeWidth={1.5} />
                  <h2 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wide">Land Area</h2>
                  <span className="ml-auto text-[10px] text-[var(--text-tertiary)]">{sqftPerMarla} Sqft/Marla standard</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    { label: "Acre",  value: String(result.totalAcre) },
                    { label: "Kanal", value: String(result.remainingKanal) },
                    { label: "Marla", value: String(result.remainingMarla) },
                    { label: "Sq Ft", value: String(result.remainingSqft) },
                  ].map(c => (
                    <div key={c.label} className="bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] rounded-xl p-3 text-center">
                      <p className="text-xs text-[var(--text-secondary)] mb-0.5">{c.label}</p>
                      <p className="text-xl font-bold text-[var(--text-primary)]">{c.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-primary-500/[0.06] border border-primary-500/20 rounded-lg py-2 px-3">
                    <p className="text-[10px] text-primary-400 font-semibold">Total Sqft</p>
                    <p className="text-base font-bold text-[var(--text-primary)]">{fmtNum(result.totalSqft, 2)}</p>
                  </div>
                  <div className="bg-primary-500/[0.06] border border-primary-500/20 rounded-lg py-2 px-3">
                    <p className="text-[10px] text-primary-400 font-semibold">Total Marla</p>
                    <p className="text-base font-bold text-[var(--text-primary)]">{fmtNum(result.totalMarla, 4)}</p>
                  </div>
                </div>
              </Card>

              {/* ── DC Valuation ── */}
              <CollapsibleCard title="DC Valuation" badge="Land Value" color="bg-primary-500">
                <Row label="DC Rate per Sqft"   value={`PKR ${result.dcRatePerSqft.toFixed(2)}`} />
                <Row label="DC Rate per Marla"  value={`PKR ${result.dcRatePerMarla.toLocaleString()}`} />
                <Row label={`Land Value (${fmtNum(result.totalSqft, 2)} Sqft × PKR ${result.dcRatePerSqft.toFixed(2)})`}
                  value={fmt(result.landValueDC)} />
                {propertyType === "house" && result.malbaValue > 0 && (
                  <Row label={`Malba / Structure (${fmtNum(result.totalMarla, 4)} Marla × PKR ${malbaRate})`}
                    value={fmt(result.malbaValue)} />
                )}
                <Row label="Total DC Valuation" value={fmt(result.totalDCValuation)} bold />
                <Row label="Market Value (entered)" value={fmt(result.marketValue)} />
                <div className="mt-2 bg-primary-500/10 border border-primary-500/25 rounded-lg px-3 py-2.5 flex justify-between items-center">
                  <span className="text-xs font-bold text-primary-400 uppercase">Tax Base (Higher Value)</span>
                  <span className="font-bold text-primary-400">{fmt(result.higherValue)}</span>
                </div>
              </CollapsibleCard>

              {/* ── Provincial Taxes ── */}
              <CollapsibleCard title="Provincial / Registry Taxes" color="bg-info-500">
                <Row label={`Stamp Duty (${(result.stampDutyRate * 100).toFixed(0)}%)`} value={fmt(result.stampDuty)} />
                <Row label={`CVT (${(result.cvtRate * 100).toFixed(0)}%)`}              value={fmt(result.cvt)} />
                <Row label="Registration Fee (1%, max PKR 50,000)"                       value={fmt(result.registrationFee)} />
                {province === "punjab" && <Row label="PLRA Tax (1%)" value={fmt(result.plraTax)} />}
                <TotalRow label="Provincial Total" color="blue"
                  value={fmt(result.stampDuty + result.cvt + result.registrationFee + result.plraTax)} />
              </CollapsibleCard>

              {/* ── FBR Taxes ── */}
              <CollapsibleCard title="FBR Federal Taxes" color="bg-warning-500">
                <Row label={`WHT Buyer 236K (${whtBuyerRate}% · ${buyerFilerStatus})`}   value={fmt(result.whtBuyer)} />
                <Row label={`WHT Seller 236C (${whtSellerRate}% · ${sellerFilerStatus})`} value={fmt(result.whtSeller)} />
                {result.capitalGainTax > 0 && (
                  <Row label={`CGT (${cgtRate}% on gain of ${fmt(result.marketValue - (parseFloat(purchasePrice) || 0))})`}
                    value={fmt(result.capitalGainTax)} />
                )}
                <TotalRow label="FBR Total" color="orange"
                  value={fmt(result.whtBuyer + result.whtSeller + result.capitalGainTax)} />
              </CollapsibleCard>

              {/* ── Other Fees ── */}
              {(result.localCommission > 0 || result.otherFeesTotal > 0) && (
                <CollapsibleCard title="Other Fees" color="bg-ai-500">
                  {result.localCommission > 0 && <Row label="Local Commission / Dalali" value={fmt(result.localCommission)} />}
                  {otherFees.filter(f => parseFloat(f.amount) > 0).map(f => (
                    <Row key={f.id} label={f.label || "Other Fee"} value={fmt(parseFloat(f.amount))} />
                  ))}
                  <TotalRow label="Fees Total" color="blue" value={fmt(result.localCommission + result.otherFeesTotal)} />
                </CollapsibleCard>
              )}

              {/* ── Grand Total ── */}
              <div className="relative rounded-2xl p-5 bg-[var(--bg-surface-1)] border border-primary-500/30 shadow-lg shadow-primary-500/10 overflow-hidden print:bg-white print:text-[var(--text-primary)] print:border-[var(--border-default)]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/60 to-transparent print:hidden" />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">Grand Total</h2>
                    <p className="text-[var(--text-secondary)] text-xs mt-0.5">All taxes and fees combined</p>
                  </div>
                  <span className="text-3xl font-bold text-primary-400 print:text-[var(--text-primary)]">{fmt(result.grandTotal)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-[var(--border-default)] pt-4">
                  {[
                    { label: "Provincial",
                      value: fmt(result.stampDuty + result.cvt + result.registrationFee + result.plraTax) },
                    { label: "FBR",
                      value: fmt(result.whtBuyer + result.whtSeller + result.capitalGainTax) },
                    { label: "Fees",
                      value: fmt(result.localCommission + result.otherFeesTotal) },
                  ].map(item => (
                    <div key={item.label} className="text-center">
                      <p className="text-[10px] text-[var(--text-secondary)] font-semibold mb-0.5">{item.label}</p>
                      <p className="text-sm font-bold text-[var(--text-primary)] print:text-[var(--text-primary)]">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Disclaimer ── */}
              <div className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] bg-warning-500/[0.06] border border-warning-500/20 rounded-xl p-4">
                <Info className="h-4 w-4 text-warning-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="font-bold text-warning-500 mb-1">Disclaimer</p>
                  <p>This calculator provides approximate estimates only. Actual taxes may differ based on FBR notifications, provincial finance acts, and applicable exemptions. Confirm final liability with your registered tax consultant or FBR. Do not use in court proceedings or official tax returns.</p>
                </div>
              </div>
            </>
          ) : (

            /* ── Empty state ── */
            <Card className="p-10">
              <div className="text-center text-[var(--text-tertiary)]">
                <Calculator className="h-16 w-16 mx-auto mb-4 text-[var(--border-default)]" strokeWidth={1.5} />
                <h3 className="text-base font-semibold text-[var(--text-secondary)]">Fill in the details, then Calculate</h3>
                <p className="text-sm mt-1 mb-6 text-[var(--text-tertiary)]">Results will appear here</p>
                <div className="text-left text-xs space-y-2 max-w-xs mx-auto text-[var(--text-secondary)] bg-[var(--bg-surface-1)] border border-[var(--bg-surface-2)] rounded-xl p-4">
                  <p className="font-bold text-[var(--text-secondary)] mb-2 text-[11px] uppercase tracking-wide">What gets calculated</p>
                  {[
                    "Acre + Kanal + Marla + Sqft into total size",
                    "272 or 225 Sqft/Marla standard",
                    "DC Rate per Marla or per Sqft",
                    "House: Land Value + Malba",
                    "Tax base = higher of DC or Market Value",
                    "Stamp Duty, CVT, PLRA, Registration Fee",
                    "WHT Buyer 236K + Seller 236C",
                    "Capital Gains Tax on profit",
                    "Commission + other fees",
                  ].map(t => (
                    <div key={t} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
