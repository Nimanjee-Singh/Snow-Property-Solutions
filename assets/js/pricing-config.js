/* =========================================================
   CENTRALISED PRICING CONFIGURATION — Snow Property Solutions
   ---------------------------------------------------------
   The business owner sets these values. Every value is null
   by default: NO prices are invented or hard-coded.

   While a required value is null, the calculator will NOT show
   a price — it shows a personalised quotation request instead.

   All money values are in GBP (£), excluding VAT unless noted.
   ========================================================= */
window.SPS_PRICING = {
  currency: 'GBP',
  vatNote: '',                     // e.g. 'Prices exclude VAT' — shown under the estimate if set

  // ---- Base rates: £ per m² of measured surface ----
  rates: {
    interior:     null,            // Interior painting — walls, per m²
    exterior:     null,            // Exterior painting — per m²
    wallpapering: null,            // Wallpaper hanging — per m²
    plastering:   null,            // Plastering & repairs — per m²
    commercial:   null             // Commercial decorating — per m²
  },

  // ---- Preparation charges: % of the base price, by surface condition ----
  // (enter 0 for 'no preparation charge' — 0 is a valid configured value; null means not set)
  preparation: {
    good:    null,                 // Good condition
    average: null,                 // Average condition
    poor:    null,                 // Poor condition
    repairs: null                  // Additional repairs required
  },

  // ---- Additional work charges ----
  extras: {
    ceilingPerM2:            null, // Ceiling painting, £ per m² of ceiling
    woodworkPerMetre:        null, // Skirting / woodwork, £ per linear metre
    doorPerItem:             null, // Doors & frames, £ per door (both sides + frame)
    wallpaperRemovalPerM2:   null, // Stripping wallpaper, £ per m²
    surfaceRepairsPerM2:     null, // Surface repairs, £ per m² of affected area
    additionalPrepPerM2:     null  // Additional preparation, £ per m² of total measured area
  },

  // ---- Materials policy ----
  //  'included'   – materials are included in the rates above
  //  'percentage' – add materials.percentage % to the labour subtotal
  //  'separate'   – materials quoted separately (not shown in the estimate)
  materials: {
    policy: null,
    percentage: null
  },

  minimumCharge: null,             // £ minimum project charge

  // ---- Estimate range allowance (%) ----
  // Low = total − low%, High = total + high%
  rangeAllowance: {
    low:  null,
    high: null
  },

  roundTo: 10                      // round displayed figures to nearest £10
};
