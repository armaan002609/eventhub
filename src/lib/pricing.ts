// Placeholder rates (INR). Move to a DB-backed EventConfig table if organisers need to edit them.
export const RATES = { accommodationPerDay: 500, mealPrice: 100, eventDays: 3 } as const;

export type FeeInput = {
  boardingCharge?: number | null;
  accommodationDays?: number | null;
  mealsPerDay?: number | null;
};

/** Shared by the form (live preview) and the API (authoritative). The server never trusts client totals. */
export function calcFees(i: FeeInput) {
  const transport = i.boardingCharge ?? 0;
  const accommodation = (i.accommodationDays ?? 0) * RATES.accommodationPerDay;
  const food = (i.mealsPerDay ?? 0) * RATES.eventDays * RATES.mealPrice;
  return { transport, accommodation, food, total: transport + accommodation + food };
}
