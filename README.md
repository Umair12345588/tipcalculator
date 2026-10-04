# Tip Calculator

A free, private tip calculator. Enter a bill, pick a tip (or type your own), and split it across the table. The tip, the total, and the amount per person update as you type. The math runs in the browser.

The layout follows the Precision Ledger screen: a fixed header, a short promise, a two-column calculator on desktop, and stacked sections for how it works, a tipping guide, and FAQ.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Scripts

- `npm run dev` — development server on `0.0.0.0:43123`
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint
- `npm test` — integer currency checks
