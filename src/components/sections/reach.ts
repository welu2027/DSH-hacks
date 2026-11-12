/* Countries DSH Hacks participants come from (organizer list, 2026-11-12),
   for the globe in About. code is the ISO 3166-1 alpha-2 code, which names the
   flag in /public/flags (flagcdn.com, 160px). Devpost doesn't
   publish per-country counts, so participants is only set when registration
   data gives it; never guess. */
export type Place = { country: string; code: string; participants?: number };

const C = (country: string, code: string): Place => ({ country, code });

export const REACH: Place[] = [
  C("Afghanistan", "af"), C("Albania", "al"), C("Algeria", "dz"),
  C("Argentina", "ar"), C("Australia", "au"), C("Austria", "at"),
  C("Azerbaijan", "az"), C("Bahrain", "bh"), C("Bangladesh", "bd"),
  C("Belarus", "by"), C("Benin", "bj"), C("Bolivia", "bo"),
  C("Botswana", "bw"), C("Brazil", "br"), C("Cambodia", "kh"),
  C("Cameroon", "cm"), C("Canada", "ca"), C("Chile", "cl"),
  C("China", "cn"), C("Colombia", "co"), C("Costa Rica", "cr"),
  C("Côte d’Ivoire", "ci"), C("Czech Republic", "cz"), C("DR Congo", "cd"),
  C("Dominican Republic", "do"), C("Ecuador", "ec"), C("Egypt", "eg"),
  C("Ethiopia", "et"), C("France", "fr"), C("Georgia", "ge"),
  C("Germany", "de"), C("Ghana", "gh"), C("Greece", "gr"),
  C("Haiti", "ht"), C("Hong Kong", "hk"), C("India", "in"),
  C("Indonesia", "id"), C("Iran", "ir"), C("Iraq", "iq"),
  C("Ireland", "ie"), C("Italy", "it"), C("Japan", "jp"),
  C("Jordan", "jo"), C("Kazakhstan", "kz"), C("Kenya", "ke"),
  C("Kuwait", "kw"), C("Kyrgyzstan", "kg"), C("Latvia", "lv"),
  C("Lebanon", "lb"), C("Liberia", "lr"), C("Lithuania", "lt"),
  C("Macau", "mo"), C("Madagascar", "mg"), C("Malawi", "mw"),
  C("Malaysia", "my"), C("Malta", "mt"), C("Mexico", "mx"),
  C("Morocco", "ma"), C("Namibia", "na"), C("Nepal", "np"),
  C("Netherlands", "nl"), C("New Zealand", "nz"), C("Niger", "ne"),
  C("Nigeria", "ng"), C("Oman", "om"), C("Pakistan", "pk"),
  C("Panama", "pa"), C("Paraguay", "py"), C("Peru", "pe"),
  C("Philippines", "ph"), C("Poland", "pl"), C("Portugal", "pt"),
  C("Qatar", "qa"), C("Réunion", "re"), C("Romania", "ro"),
  C("Russia", "ru"), C("Rwanda", "rw"), C("Saudi Arabia", "sa"),
  C("Senegal", "sn"), C("Singapore", "sg"), C("South Africa", "za"),
  C("South Korea", "kr"), C("Spain", "es"), C("Sri Lanka", "lk"),
  C("Switzerland", "ch"), C("Taiwan", "tw"), C("Thailand", "th"),
  C("Togo", "tg"), C("Tunisia", "tn"), C("Turkey", "tr"),
  C("Uganda", "ug"), C("Ukraine", "ua"), C("United Arab Emirates", "ae"),
  C("United Kingdom", "gb"), C("United States", "us"), C("Uzbekistan", "uz"),
  C("Vietnam", "vn"), C("Yemen", "ye"), C("Zambia", "zm"),
  C("Zimbabwe", "zw"),
];
