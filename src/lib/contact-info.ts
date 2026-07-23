// ============================================================
// Kontakt podaci — preuzeto sa stare stranice (apartments-sibenik.com),
// backend nema model za ovo (nema Company.email/phone polja).
//
// Domaćini su bračni par koji vodi apartmane; oba broja su hrvatski
// mobilni brojevi pa se koriste i kao WhatsApp kontakt (stara stranica
// nije imala poseban WA link, ali su brojevi mobilni — wa.me radi s
// istim brojem u E.164 formatu).
// ============================================================

export interface Host {
  name: string;
  phone: string;
  email: string;
}

export const HOSTS: Host[] = [
  { name: "Brigita Batinić", phone: "+385989105640", email: "brigita.batinic@hotmail.com" },
  { name: "Ivica Batinić", phone: "+385995937343", email: "ivicabat@gmail.com" },
];

export const ADDRESS = {
  street: "Slobodana Macure 13",
  neighborhood: "Plišac",
  city: "22000 Šibenik, Hrvatska",
  /** Puni tekst za Google Maps — NAMJERNO bez ručno upisanih lat/lng
   * (nemamo pouzdane koordinate na razini ulice); Google Maps sam
   * geokodira adresu, što je točnije od nagađanja brojki. */
  full: "Slobodana Macure 13, 22000 Šibenik, Hrvatska",
};

export function whatsappLink(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
