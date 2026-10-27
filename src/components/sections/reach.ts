/* Where DSH Hacks participants are, for the globe in About. Devpost doesn't
   publish a country breakdown, so fill this from registration data; never
   guess. One entry per country, with the country's rough centre and how many
   participants came from it. An empty list still draws the globe, just
   without markers. Example:
   { country: "India", lat: 21, lng: 78, participants: 412 }, */
export type Place = { country: string; lat: number; lng: number; participants: number };

export const REACH: Place[] = [];
