"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { copyText, useToast } from "@/components/toast";
import { cn } from "@/lib/cn";
import {
  CURRENCIES,
  DEFAULT_RATES,
  MAX_PEOPLE,
  RATE_FIELDS,
  TIP_PRESETS,
  amountToMinor,
  appliedRates,
  computeSplit,
  convertMinor,
  currencyMeta,
  defaultRates,
  formatMoney,
  formatPercent,
  formatRateSummary,
  parsePeople,
  parsePercent,
  ratesAreCustom,
  sanitizeAmountInput,
  sanitizePeopleInput,
  sanitizePercentInput,
  sanitizeRateInput,
  type CurrencyCode,
  type RateCode,
  type RateInputs,
  type TipPreset,
} from "@/lib/money";

const INITIAL_PRESET: TipPreset = 15;

const CONVERSIONS = [
  { code: "EUR" as const, suffix: "EUR", approximate: true },
  { code: "GBP" as const, suffix: "GBP", approximate: false },
  { code: "JPY" as const, suffix: "JPY", approximate: false },
  { code: "CAD" as const, suffix: "CAD", approximate: false },
];

export function Calculator() {
  const showToast = useToast();
  const [bill, setBill] = useState("");
  const [preset, setPreset] = useState<TipPreset | null>(INITIAL_PRESET);
  const [customTip, setCustomTip] = useState("");
  const [people, setPeople] = useState("1");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [rates, setRates] = useState<RateInputs>(defaultRates);
  const [ratesOpen, setRatesOpen] = useState(true);

  const meta = currencyMeta(currency);
  const peopleCount = parsePeople(people);
  const tipPercent = preset === null ? parsePercent(customTip) : preset;
  const result = useMemo(
    () => computeSplit(amountToMinor(bill, currency), tipPercent, peopleCount),
    [bill, currency, peopleCount, tipPercent],
  );
  const fx = useMemo(() => appliedRates(rates), [rates]);
  const customRates = ratesAreCustom(rates);
  const peopleHint = peopleCount === 1 ? "Single payer" : `Split amongst ${peopleCount} people`;

  function onBillChange(value: string) {
    setBill(sanitizeAmountInput(value, meta.decimals));
  }

  function onCurrencyChange(next: CurrencyCode) {
    const nextDecimals = currencyMeta(next).decimals;
    setCurrency(next);
    setBill((current) => sanitizeAmountInput(current, nextDecimals));
  }

  function selectPreset(value: TipPreset) {
    setPreset(value);
    setCustomTip("");
  }

  function onCustomTipChange(value: string) {
    const next = sanitizePercentInput(value);
    setCustomTip(next);
    setPreset(null);
  }

  function changePeople(next: number) {
    setPeople(String(Math.min(MAX_PEOPLE, Math.max(1, next))));
  }

  function onPeopleChange(value: string) {
    setPeople(sanitizePeopleInput(value));
  }

  function onRateChange(code: RateCode, value: string, decimals: number) {
    setRates((current) => ({ ...current, [code]: sanitizeRateInput(value, decimals) }));
  }

  function resetRates() {
    setRates(defaultRates());
  }

  function reset() {
    setBill("");
    setPreset(INITIAL_PRESET);
    setCustomTip("");
    setPeople("1");
    setCurrency("USD");
    setRates(defaultRates());
    setRatesOpen(true);
  }

  async function copySummary() {
    const summary = [
      "Tip Calculator Summary:",
      `Original Bill: ${formatMoney(result.billMinor, currency)}`,
      `Tip Percentage: ${formatPercent(result.tipPercent)}`,
      `Total Tip: ${formatMoney(result.tipMinor, currency)}`,
      `Total with Tip: ${formatMoney(result.totalMinor, currency)}`,
      `Split: ${result.people} ${result.people === 1 ? "person" : "people"}`,
      `Amount Per Person: ${formatMoney(result.perPersonMinor, currency)}`,
    ].join("\n");
    await copyText(summary);
    showToast("Breakdown copied to clipboard!");
  }

  function scrollToSummary() {
    document.getElementById("summary")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const prefixPad = meta.symbol.length > 2 ? "pl-14" : meta.symbol.length > 1 ? "pl-12" : "pl-10";

  return (
    <section id="calculator" className="mx-auto my-space-md w-full max-w-5xl scroll-mt-24 px-gutter-mobile md:px-0">
      <form
        className="relative grid grid-cols-1 gap-space-lg overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md shadow-xl md:p-space-xl lg:grid-cols-12"
        onSubmit={(event) => {
          event.preventDefault();
          scrollToSummary();
        }}
      >
        <div className="pointer-events-none absolute -top-24 -left-24 -z-10 h-72 w-72 rounded-full bg-primary-fixed-dim/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 -z-10 h-72 w-72 rounded-full bg-tertiary-fixed/25 blur-3xl" />

        <div className="flex flex-col justify-between space-y-space-lg lg:col-span-7">
          <div className="space-y-space-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <label className="font-label-lg text-label-lg text-on-surface" htmlFor="bill-input">
                  Bill Amount
                </label>
                <span className="hidden items-center gap-1 font-label-sm text-label-sm text-secondary sm:inline-flex">
                  <Icon name="info" className="text-[16px]" /> Enter total
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-surface-container-low px-2 py-1">
                <Icon name="payments" className="text-[16px] text-primary" />
                <label className="sr-only" htmlFor="currency-select">
                  Currency
                </label>
                <select
                  id="currency-select"
                  className="cursor-pointer bg-transparent pr-1 font-label-md text-label-md font-semibold text-on-surface outline-none"
                  value={currency}
                  onChange={(event) => onCurrencyChange(event.target.value as CurrencyCode)}
                >
                  {CURRENCIES.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div
              className={cn(
                "relative flex items-center rounded-xl bg-surface-container-low transition-all",
                "focus-within:bg-surface-container-lowest focus-within:shadow-[0_0_0_2px_#006948]",
              )}
            >
              <span className="pointer-events-none absolute left-4 font-headline-md text-headline-md text-outline select-none">
                {meta.symbol}
              </span>
              <input
                id="bill-input"
                className={cn(
                  "w-full bg-transparent py-3.5 pr-4 font-headline-md text-headline-md text-on-surface tabular-nums outline-none placeholder:text-outline-variant",
                  prefixPad,
                )}
                inputMode={meta.decimals === 0 ? "numeric" : "decimal"}
                autoComplete="off"
                placeholder={meta.decimals === 0 ? "0" : "0.00"}
                aria-describedby="bill-hint"
                value={bill}
                onChange={(event) => onBillChange(event.target.value)}
              />
            </div>
            <p id="bill-hint" className="sr-only">
              Enter a bill of zero or more. Negatives and letters are ignored.
            </p>

            <div className="mt-2 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container">
              <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-[11px]">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  <span className="font-label-sm font-semibold text-on-surface">Live FX Rates:</span>
                  <span className="hidden text-secondary sm:inline">{formatRateSummary(fx)}</span>
                  <span
                    className={cn(
                      "rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase",
                      customRates ? "inline" : "hidden",
                    )}
                  >
                    Custom Active
                  </span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md border border-outline-variant/30 bg-surface-container-low px-2 py-1 font-label-sm text-[11px] font-semibold text-on-surface transition-all hover:bg-surface-container-high"
                  aria-expanded={ratesOpen}
                  aria-controls="custom-fx-panel"
                  onClick={() => setRatesOpen((open) => !open)}
                >
                  <Icon name="tune" className="text-[14px] text-primary" />
                  Override Rates
                </button>
              </div>
              {ratesOpen ? (
                <div id="custom-fx-panel" className="border-t border-outline-variant/20 bg-surface-container-low/70 px-3 py-2.5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-on-surface">
                      <Icon name="edit_note" className="text-[14px] text-primary" />
                      Manual Exchange Rate Override (1 USD =)
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-0.5 text-[11px] font-semibold text-primary transition-colors hover:text-primary-container"
                      onClick={resetRates}
                    >
                      <Icon name="restart_alt" className="text-[13px]" />
                      Reset to Live
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {RATE_FIELDS.map((field) => (
                      <div key={field.code} className="flex flex-col gap-0.5">
                        <label className="text-[10px] font-semibold text-secondary uppercase" htmlFor={`rate-${field.code.toLowerCase()}`}>
                          {field.label}
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id={`rate-${field.code.toLowerCase()}`}
                            inputMode="decimal"
                            autoComplete="off"
                            value={rates[field.code]}
                            placeholder={field.placeholder}
                            onChange={(event) => onRateChange(field.code, event.target.value, field.decimals)}
                            onBlur={(event) => {
                              if (Number(event.currentTarget.value) < field.min) {
                                setRates((current) => ({ ...current, [field.code]: DEFAULT_RATES[field.code] }));
                              }
                            }}
                            className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-2 py-1.5 pr-8 font-label-sm text-[12px] font-semibold text-on-surface tabular-nums outline-none focus:shadow-[0_0_0_2px_#006948]"
                          />
                          <span className="pointer-events-none absolute right-2 text-[10px] text-outline">{field.symbol}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between pt-1 text-[10px] text-secondary">
                    <span className="flex items-center gap-1">
                      <Icon name="sync_alt" className="text-[13px] text-primary" />
                      Applies instantly to Summary conversions
                    </span>
                    <span className="font-medium text-outline">Updated just now</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-space-xs">
            <div className="flex items-center justify-between gap-2">
              <label className="font-label-lg text-label-lg text-on-surface" id="tip-label">
                Select Tip Percentage
              </label>
              <span className="font-label-sm text-label-sm font-semibold text-primary">Industry standard: 15–20%</span>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6" role="group" aria-labelledby="tip-label">
              {TIP_PRESETS.map((value) => {
                const selected = preset === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    className={cn(
                      "rounded-xl px-3 py-2.5 font-label-lg text-label-lg transition-all",
                      "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_#ffffff,0_0_0_4px_#006948]",
                      selected
                        ? "bg-primary text-on-primary shadow-[0_4px_12px_rgba(0,105,72,0.25)]"
                        : "bg-surface-container text-on-surface hover:bg-surface-container-high",
                    )}
                    onClick={() => selectPreset(value)}
                  >
                    {value}%
                  </button>
                );
              })}
              <div className="relative flex items-center">
                <label className="sr-only" htmlFor="custom-tip">
                  Custom tip percentage
                </label>
                <input
                  id="custom-tip"
                  className={cn(
                    "h-full w-full rounded-xl bg-surface-container-low py-2.5 pr-6 pl-2 text-center font-label-md text-label-md text-on-surface tabular-nums outline-none transition-all placeholder:text-outline-variant",
                    "focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#006948]",
                    preset === null && customTip !== "" && "bg-surface-container-lowest shadow-[0_0_0_2px_#006948]",
                  )}
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="Custom"
                  value={customTip}
                  onChange={(event) => onCustomTipChange(event.target.value)}
                />
                <span className="pointer-events-none absolute right-2 font-label-sm text-label-sm text-outline">%</span>
              </div>
            </div>
          </div>

          <div className="space-y-space-xs">
            <div className="flex items-center justify-between gap-2">
              <label className="font-label-lg text-label-lg text-on-surface" htmlFor="people-count">
                Split Between
              </label>
              <span className="font-label-sm text-label-sm text-secondary" id="people-hint">
                {peopleHint}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-container-low p-2">
              <div className="flex items-center gap-space-sm pl-2">
                <Icon name="group" className="text-[22px] text-outline" />
                <span className="font-body-md text-body-md text-on-surface">Party size:</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease person count"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-lowest text-on-surface shadow-sm transition-colors hover:bg-surface-container disabled:pointer-events-none disabled:opacity-40"
                  disabled={peopleCount <= 1}
                  onClick={() => changePeople(peopleCount - 1)}
                >
                  <Icon name="remove" className="text-[18px]" />
                </button>
                <input
                  id="people-count"
                  className="w-12 bg-transparent text-center font-headline-md text-headline-md font-bold text-on-surface tabular-nums outline-none focus:shadow-[0_0_0_2px_#006948] rounded-lg"
                  inputMode="numeric"
                  autoComplete="off"
                  aria-describedby="people-hint"
                  value={people}
                  onChange={(event) => onPeopleChange(event.target.value)}
                  onBlur={() => {
                    if (!people) setPeople("1");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      changePeople(peopleCount + 1);
                    }
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      changePeople(peopleCount - 1);
                    }
                  }}
                />
                <button
                  type="button"
                  aria-label="Increase person count"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-lowest text-on-surface shadow-sm transition-colors hover:bg-surface-container disabled:pointer-events-none disabled:opacity-40"
                  disabled={peopleCount >= MAX_PEOPLE}
                  onClick={() => changePeople(peopleCount + 1)}
                >
                  <Icon name="add" className="text-[18px]" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-space-md py-3.5 font-headline-sm text-headline-sm text-on-primary shadow-lg transition-transform hover:bg-primary-container active:scale-[0.99] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_#ffffff,0_0_0_4px_#006948]"
          >
            <Icon name="auto_awesome" className="text-[20px]" />
            Calculate Tip
          </button>
        </div>

        <div
          id="summary"
          className="relative flex scroll-mt-24 flex-col justify-between overflow-hidden rounded-xl bg-inverse-surface p-space-md text-inverse-on-surface shadow-md md:p-space-lg lg:col-span-5"
        >
          <p className="sr-only" aria-live="polite">
            Amount per person {formatMoney(result.perPersonMinor, currency)}. Total tip{" "}
            {formatMoney(result.tipMinor, currency)}. Total bill {formatMoney(result.totalMinor, currency)}.
          </p>
          <div>
            <div className="mb-space-sm flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-1.5">
                <Icon name="receipt_long" className="text-[20px] text-inverse-primary" />
                <span className="font-label-lg text-label-lg font-semibold tracking-wide text-inverse-on-surface uppercase">
                  Summary Breakdown
                </span>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg bg-surface-container-lowest/10 px-2 py-1 font-label-sm text-label-sm text-inverse-primary transition-colors hover:text-inverse-on-surface focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_#68dba9]"
                title="Copy calculation summary"
                onClick={copySummary}
              >
                <Icon name="content_copy" className="text-[16px]" />
                Copy
              </button>
            </div>

            <div className="mb-space-md rounded-xl bg-surface-container-lowest/5 p-space-md text-center">
              <span className="mb-1 block font-label-sm text-label-sm tracking-wider text-surface-variant uppercase">
                Amount Per Person
              </span>
              <div
                id="stat-per-person"
                className="mb-1.5 font-display-lg text-[28px] leading-[36px] font-bold tracking-[-0.025em] text-inverse-primary tabular-nums md:text-[48px] md:leading-[56px] md:tracking-[-0.03em]"
              >
                {formatMoney(result.perPersonMinor, currency)}
              </div>
              <p className="font-body-sm text-body-sm text-surface-variant">Total owed per individual guest</p>
              <div className="mt-2.5 border-t border-surface-container-lowest/10 pt-2">
                <div className="flex flex-wrap items-center justify-center gap-1.5 font-label-sm text-label-sm">
                  {CONVERSIONS.map((item) => {
                    const converted = convertMinor(result.perPersonMinor, currency, item.code, fx);
                    return (
                      <span
                        key={item.code}
                        className="rounded-md bg-surface-container-lowest/10 px-2 py-0.5 text-[11px] text-inverse-on-surface tabular-nums"
                      >
                        {item.approximate ? "≈ " : ""}
                        {formatMoney(converted, item.code)} {item.suffix}
                      </span>
                    );
                  })}
                </div>
                <span className="mt-1 block text-[11px] text-surface-variant/80">
                  Estimated conversion at live mid-market rates
                </span>
              </div>
            </div>

            <div className="space-y-space-sm font-body-md text-body-md">
              <SummaryRow id="stat-original-bill" label="Original Bill" value={formatMoney(result.billMinor, currency)} />
              <SummaryRow id="stat-tip-percent" label="Tip Percentage" value={formatPercent(result.tipPercent)} />
              <SummaryRow id="stat-total-tip" label="Total Tip Amount" value={formatMoney(result.tipMinor, currency)} accent />
              <SummaryRow id="stat-tip-per-person" label="Tip Per Person" value={formatMoney(result.tipPerPersonMinor, currency)} accent />
              <div className="flex items-center justify-between pt-space-xs text-surface-variant">
                <span className="font-headline-sm text-headline-sm text-inverse-on-surface">Total Bill (with tip)</span>
                <span id="stat-total-bill" className="font-headline-sm text-headline-sm font-bold text-inverse-on-surface tabular-nums">
                  {formatMoney(result.totalMinor, currency)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-space-md flex items-center justify-between gap-space-sm pt-space-md">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg bg-surface-container-lowest/5 px-3 py-2 font-label-md text-label-md text-surface-variant transition-colors hover:bg-surface-container-lowest/10 hover:text-inverse-on-surface focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_#68dba9]"
              onClick={reset}
            >
              <Icon name="restart_alt" className="text-[16px]" />
              Reset
            </button>
            <div className="flex items-center gap-1 text-[11px] font-label-sm text-surface-variant">
              <Icon name="check_circle" className="text-[14px] text-inverse-primary" />
              Exact math verified
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

function SummaryRow({
  id,
  label,
  value,
  accent = false,
}: {
  id: string;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-surface-variant">
      <span>{label}</span>
      <span id={id} className={cn("font-semibold tabular-nums", accent ? "text-inverse-primary" : "text-inverse-on-surface")}>
        {value}
      </span>
    </div>
  );
}
