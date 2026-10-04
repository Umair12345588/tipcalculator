export const CURRENCIES = [
  { code: "USD", label: "USD ($)", symbol: "$", decimals: 2 },
  { code: "EUR", label: "EUR (€)", symbol: "€", decimals: 2 },
  { code: "GBP", label: "GBP (£)", symbol: "£", decimals: 2 },
  { code: "JPY", label: "JPY (¥)", symbol: "¥", decimals: 0 },
  { code: "CAD", label: "CAD (CA$)", symbol: "CA$", decimals: 2 },
  { code: "AUD", label: "AUD (A$)", symbol: "A$", decimals: 2 },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export const TIP_PRESETS = [5, 10, 15, 20, 25] as const;
export type TipPreset = (typeof TIP_PRESETS)[number];

export const MAX_PEOPLE = 99;
export const MAX_TIP_PERCENT = 1000;
export const MAX_AMOUNT_DIGITS = 7;

/** Foreign currency units per 1 USD. AUD is used only when AUD is the bill currency. */
export const DEFAULT_RATES = {
  EUR: "0.9200",
  GBP: "0.7900",
  JPY: "154.20",
  CAD: "1.3800",
} as const;

export const AUD_PER_USD = 1.52;

export type RateCode = keyof typeof DEFAULT_RATES;

export const RATE_FIELDS: Array<{
  code: RateCode;
  label: string;
  symbol: string;
  min: number;
  decimals: number;
  placeholder: string;
}> = [
  { code: "EUR", label: "EUR (€)", symbol: "€", min: 0.0001, decimals: 4, placeholder: "0.9200" },
  { code: "GBP", label: "GBP (£)", symbol: "£", min: 0.0001, decimals: 4, placeholder: "0.7900" },
  { code: "JPY", label: "JPY (¥)", symbol: "¥", min: 0.1, decimals: 2, placeholder: "154.20" },
  { code: "CAD", label: "CAD (CA$)", symbol: "CA$", min: 0.0001, decimals: 4, placeholder: "1.3800" },
];

export type RateInputs = Record<RateCode, string>;

export interface SplitResult {
  billMinor: number;
  tipMinor: number;
  totalMinor: number;
  perPersonMinor: number;
  tipPerPersonMinor: number;
  people: number;
  tipPercent: number;
}

const MICRO = 1_000_000n;

export function currencyMeta(code: CurrencyCode) {
  return CURRENCIES.find((currency) => currency.code === code) ?? CURRENCIES[0];
}

export function defaultRates(): RateInputs {
  return { ...DEFAULT_RATES };
}

/** Keep a typed amount: digits, one decimal point, and a bounded length. */
export function sanitizeAmountInput(raw: string, maxDecimals: number, maxDigits = MAX_AMOUNT_DIGITS): string {
  const cleaned = raw.replace(/[^\d.]/g, "");
  if (!cleaned) return "";

  if (maxDecimals <= 0) {
    const dot = cleaned.indexOf(".");
    const whole = (dot === -1 ? cleaned : cleaned.slice(0, dot)).replace(/\./g, "");
    return whole.replace(/^0+(?=\d)/, "").slice(0, maxDigits);
  }

  const dot = cleaned.indexOf(".");
  let intPart = (dot === -1 ? cleaned : cleaned.slice(0, dot)).replace(/\./g, "");
  const decPart = dot === -1 ? null : cleaned.slice(dot + 1).replace(/\./g, "");

  intPart = intPart.replace(/^0+(?=\d)/, "");
  if (!intPart && dot !== -1) intPart = "0";
  intPart = intPart.slice(0, maxDigits);

  if (decPart === null) return intPart;
  return `${intPart}.${decPart.slice(0, maxDecimals)}`;
}

export function sanitizePercentInput(raw: string): string {
  const next = sanitizeAmountInput(raw, 2, 4);
  if (!next || next === ".") return next;
  const value = Number(next);
  if (!Number.isFinite(value)) return "";
  if (value > MAX_TIP_PERCENT) return String(MAX_TIP_PERCENT);
  return next;
}

export function sanitizePeopleInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 3);
  if (!digits) return "";
  const value = Number(digits);
  if (!Number.isFinite(value) || value <= 0) return "1";
  return String(Math.min(MAX_PEOPLE, value));
}

export function sanitizeRateInput(raw: string, maxDecimals: number): string {
  return sanitizeAmountInput(raw, maxDecimals, 6);
}

/** Minor units: cents for decimal currencies, yen for JPY. */
export function amountToMinor(raw: string, currency: CurrencyCode): number {
  if (!raw || raw === ".") return 0;
  const decimals = currencyMeta(currency).decimals;
  const [intRaw, decRaw = ""] = raw.split(".");
  const intPart = intRaw ? Number(intRaw) : 0;
  if (!Number.isFinite(intPart) || intPart < 0) return 0;
  if (decimals === 0) return Math.round(intPart);
  const dec = `${decRaw}00`.slice(0, decimals);
  return intPart * 100 + Number(dec);
}

export function parsePercent(raw: string): number {
  if (!raw || raw === ".") return 0;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(MAX_TIP_PERCENT, value);
}

export function parsePeople(raw: string): number {
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.min(MAX_PEOPLE, Math.trunc(value));
}

export function parseRate(raw: string, fallback: number, min: number): number {
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min) return fallback;
  return value;
}

export function computeSplit(billMinor: number, tipPercent: number, people: number): SplitResult {
  const safeBill = Number.isFinite(billMinor) ? Math.max(0, Math.round(billMinor)) : 0;
  const safePeople = Number.isFinite(people) ? Math.min(MAX_PEOPLE, Math.max(1, Math.trunc(people))) : 1;
  const safePercent = Number.isFinite(tipPercent) ? Math.min(MAX_TIP_PERCENT, Math.max(0, tipPercent)) : 0;
  const basisPoints = Math.round(safePercent * 100);
  const tipMinor = Math.round((safeBill * basisPoints) / 10_000);
  const totalMinor = safeBill + tipMinor;

  return {
    billMinor: safeBill,
    tipMinor,
    totalMinor,
    perPersonMinor: Math.round(totalMinor / safePeople),
    tipPerPersonMinor: Math.round(tipMinor / safePeople),
    people: safePeople,
    tipPercent: basisPoints / 100,
  };
}

export function formatMoney(minor: number, currency: CurrencyCode): string {
  const meta = currencyMeta(currency);
  const safe = Number.isFinite(minor) ? Math.round(minor) : 0;
  const sign = safe < 0 ? "-" : "";
  const absolute = Math.abs(safe);
  const major = meta.decimals === 0 ? absolute : absolute / 100;
  const formatted = major.toLocaleString("en-US", {
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
  });
  return `${sign}${meta.symbol}${formatted}`;
}

export function formatPercent(percent: number): string {
  const rounded = Math.round((Number.isFinite(percent) ? percent : 0) * 100) / 100;
  return `${rounded}%`;
}

export function formatRate(value: number): string {
  const rounded = Math.round(value * 10_000) / 10_000;
  return String(rounded);
}

export interface AppliedRates {
  EUR: number;
  GBP: number;
  JPY: number;
  CAD: number;
  AUD: number;
}

export function appliedRates(inputs: RateInputs): AppliedRates {
  return {
    EUR: parseRate(inputs.EUR, Number(DEFAULT_RATES.EUR), 0.0001),
    GBP: parseRate(inputs.GBP, Number(DEFAULT_RATES.GBP), 0.0001),
    JPY: parseRate(inputs.JPY, Number(DEFAULT_RATES.JPY), 0.1),
    CAD: parseRate(inputs.CAD, Number(DEFAULT_RATES.CAD), 0.0001),
    AUD: AUD_PER_USD,
  };
}

export function ratesAreCustom(inputs: RateInputs): boolean {
  return (Object.keys(DEFAULT_RATES) as RateCode[]).some((code) => {
    const field = RATE_FIELDS.find((item) => item.code === code);
    const parsed = parseRate(inputs[code], Number(DEFAULT_RATES[code]), field?.min ?? 0.0001);
    return Math.abs(parsed - Number(DEFAULT_RATES[code])) > 0.0000001;
  });
}

export function formatRateSummary(rates: AppliedRates): string {
  return `1 USD ≈ ${formatRate(rates.EUR)} EUR • ${formatRate(rates.GBP)} GBP • ${formatRate(rates.JPY)} JPY • ${formatRate(rates.CAD)} CAD`;
}

function divRound(numerator: bigint, denominator: bigint): bigint {
  if (denominator === 0n) return 0n;
  return (numerator + denominator / 2n) / denominator;
}

function minorToMicro(minor: number, currency: CurrencyCode): bigint {
  const value = BigInt(Math.max(0, Math.trunc(minor)));
  if (currency === "JPY") return value * MICRO;
  return value * (MICRO / 100n);
}

function microToMinor(micro: bigint, currency: CurrencyCode): number {
  if (currency === "JPY") return Number(divRound(micro, MICRO));
  return Number(divRound(micro * 100n, MICRO));
}

function rateUnits(rate: number): bigint {
  return BigInt(Math.max(1, Math.round(rate * 10_000)));
}

/** Convert minor units using “foreign units per 1 USD” rates. */
export function convertMinor(
  minor: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: AppliedRates,
): number {
  if (from === to || !minor) return Math.max(0, Math.round(minor) || 0);

  const micro = minorToMicro(minor, from);
  const usdMicro = from === "USD" ? micro : divRound(micro * 10_000n, rateUnits(rates[from]));
  const destMicro = to === "USD" ? usdMicro : divRound(usdMicro * rateUnits(rates[to]), 10_000n);
  return microToMinor(destMicro, to);
}
