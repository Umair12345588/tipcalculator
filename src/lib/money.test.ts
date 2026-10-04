import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  amountToMinor,
  appliedRates,
  computeSplit,
  convertMinor,
  defaultRates,
  formatMoney,
  formatPercent,
  sanitizeAmountInput,
  sanitizePeopleInput,
  sanitizePercentInput,
} from "./money.ts";

describe("sanitizeAmountInput", () => {
  it("strips junk, signs, and extra decimals", () => {
    assert.equal(sanitizeAmountInput("-12abc", 2), "12");
    assert.equal(sanitizeAmountInput("$1,234.567", 2), "1234.56");
    assert.equal(sanitizeAmountInput("12.3.4", 2), "12.34");
    assert.equal(sanitizeAmountInput(".", 2), "0.");
    assert.equal(sanitizeAmountInput("00.50", 2), "0.50");
    assert.equal(sanitizeAmountInput("1500.2", 0), "1500");
  });
});

describe("sanitizePercentInput", () => {
  it("rejects negatives and caps the percentage", () => {
    assert.equal(sanitizePercentInput("-5"), "5");
    assert.equal(sanitizePercentInput("12.55"), "12.55");
    assert.equal(sanitizePercentInput("1001"), "1000");
    assert.equal(sanitizePercentInput("e"), "");
  });
});

describe("sanitizePeopleInput", () => {
  it("keeps a whole number from 1 to 99", () => {
    assert.equal(sanitizePeopleInput("0"), "1");
    assert.equal(sanitizePeopleInput("-3"), "3");
    assert.equal(sanitizePeopleInput("4"), "4");
    assert.equal(sanitizePeopleInput("100"), "99");
    assert.equal(sanitizePeopleInput("abc"), "");
  });
});

describe("computeSplit", () => {
  it("calculates $100 at 15% for 1 person", () => {
    const result = computeSplit(amountToMinor("100", "USD"), 15, 1);
    assert.equal(result.tipMinor, 1500);
    assert.equal(result.totalMinor, 11500);
    assert.equal(result.perPersonMinor, 11500);
    assert.equal(formatMoney(result.tipMinor, "USD"), "$15.00");
    assert.equal(formatMoney(result.totalMinor, "USD"), "$115.00");
    assert.equal(formatMoney(result.perPersonMinor, "USD"), "$115.00");
  });

  it("calculates each preset on a $40 bill", () => {
    const bill = amountToMinor("40", "USD");
    const expected = [
      [5, 200, 4200],
      [10, 400, 4400],
      [15, 600, 4600],
      [20, 800, 4800],
      [25, 1000, 5000],
    ] as const;
    for (const [percent, tip, total] of expected) {
      const result = computeSplit(bill, percent, 1);
      assert.equal(result.tipMinor, tip, `${percent}% tip`);
      assert.equal(result.totalMinor, total, `${percent}% total`);
    }
  });

  it("splits $50 at 20% across 4 people", () => {
    const result = computeSplit(amountToMinor("50", "USD"), 20, 4);
    assert.equal(formatMoney(result.tipMinor, "USD"), "$10.00");
    assert.equal(formatMoney(result.totalMinor, "USD"), "$60.00");
    assert.equal(formatMoney(result.perPersonMinor, "USD"), "$15.00");
    assert.equal(formatMoney(result.tipPerPersonMinor, "USD"), "$2.50");
  });

  it("rounds a custom 12.5% tip and a 3-way split in cents", () => {
    const custom = computeSplit(amountToMinor("80", "USD"), 12.5, 1);
    assert.equal(formatMoney(custom.tipMinor, "USD"), "$10.00");
    assert.equal(formatMoney(custom.totalMinor, "USD"), "$90.00");

    const split = computeSplit(amountToMinor("10", "USD"), 10, 3);
    assert.equal(formatMoney(split.tipMinor, "USD"), "$1.00");
    assert.equal(formatMoney(split.totalMinor, "USD"), "$11.00");
    assert.equal(formatMoney(split.perPersonMinor, "USD"), "$3.67");
  });

  it("treats an empty bill as zero and never drops below 1 person", () => {
    const result = computeSplit(0, 15, 0);
    assert.equal(result.tipMinor, 0);
    assert.equal(result.totalMinor, 0);
    assert.equal(result.perPersonMinor, 0);
    assert.equal(result.people, 1);
    assert.equal(formatPercent(result.tipPercent), "15%");
  });

  it("calculates yen without fractional units", () => {
    const result = computeSplit(amountToMinor("1500", "JPY"), 10, 2);
    assert.equal(formatMoney(result.tipMinor, "JPY"), "¥150");
    assert.equal(formatMoney(result.totalMinor, "JPY"), "¥1,650");
    assert.equal(formatMoney(result.perPersonMinor, "JPY"), "¥825");
  });
});

describe("convertMinor", () => {
  it("converts USD with the design reference rates", () => {
    const rates = appliedRates(defaultRates());
    assert.equal(formatMoney(convertMinor(10000, "USD", "EUR", rates), "EUR"), "€92.00");
    assert.equal(formatMoney(convertMinor(10000, "USD", "GBP", rates), "GBP"), "£79.00");
    assert.equal(formatMoney(convertMinor(10000, "USD", "JPY", rates), "JPY"), "¥15,420");
    assert.equal(formatMoney(convertMinor(10000, "USD", "CAD", rates), "CAD"), "CA$138.00");
    assert.equal(convertMinor(11500, "EUR", "USD", rates), 12500);
  });
});
