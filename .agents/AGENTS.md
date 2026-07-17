# Projektne Smjernice i Memorija - Apartments Šibenik

Ovaj dokument sadrži odluke, pravila i arhitekturu dogovorenu za razvoj frontend aplikacije "Apartments Šibenik". Služi kao stalni izvor konteksta za sve buduće sesije i agente.

## 1. Osnovne tehnologije
- **Framework:** Next.js (App Router, verzija 14+)
- **Stilovi:** Tailwind CSS + Vanilla CSS za napredne vizualne efekte.
- **Javni dio (`(public)`):** GSAP, Aceternity UI, Lenis Smooth Scroll za luksuzan, dinamičan izgled.
- **Admin panel (`(admin)`):** shadcn/ui (Radix UI + Tailwind) za čist, brz i funkcionalan izgled.
- **Okruženje:** Node.js 21.7.3, upravljanje paketima preko `npm`.
- **Mobilna responzivnost:** 100% prilagođeno za mobilne uređaje (Mobile-first pristup).

## 2. Dizajn i estetika (Javni dio)
- **Tema i Boje:** Mediteranska tamnoplava pozadina s kremasto bijelim kontrastom. Akcenti su inspirirani suncem i morem (npr. mediteranski oker/zlatna i tirkizna).
- **Time-based Gradient:** Automatsko prilagođavanje pozadinskih boja javnog dijela na temelju vremena na uređaju korisnika (kontinuirani prijelaz: Sunrise/Noon/Sunset/Night). Korisnik može i ručno promijeniti temu.
- **Stil:** Bogati glassmorphic efekte sa zaobljenim rubovima. Izbjegavati ekstremni minimalizam i prazan izgled; stranica mora izgledati premium i raskošno.
- **Tipografija:** Umjereno moderan font za standardni tekst, dok će glavni naslovi i Hero sekcija koristiti elegantniji rukopisni font (kroz prilagođeni CSS/Google Fonts).

## 3. Animacije i Interakcija
- **Ptica u letu (Desktop samo):** Leti preko ekrana između predefiniranih HTML/SVG sidrišta (tagova) s nasumičnim vremenskim razmacima (timerima) ili na određeni okidač (npr. klik na kontakt formu).
- **Loading Animacija:** Uvodna animacija za esencijalne dijelove stranice (da se ne čeka učitavanje velikih slika), a svaka pojedinačna slika ima vlastiti suptilni loader.
- **Hover efekti:** Suptilno 3D zakretanje kartica apartmana i blago zumiranje slika (vrlo diskretno i elegantno, bez prevelike tromosti).
- **Smooth Scroll:** Integriran glatki scroll (Lenis) s minimalnom inercijom.

## 4. Struktura ruta
Aplikacija je podijeljena u Route grupe:
- **`(public)`**:
  - `/` (Početna)
  - `/apartmani` (Pregled 3 apartmana)
  - `/o-sibeniku` (Promidžbeni materijali o destinaciji)
  - `/kontakt` (Kontakt informacije i linkovi na Airbnb/Booking)
- **`(admin)`**:
  - `/admin/dashboard` (Glavna nadzorna ploča)
  - `/admin/solar` (Solar dashboard s websocket grafovima)
  - `/admin/reviews` (Pregled recenzija)
  - `/admin/invoices` (Pregled i kreiranje računa/predračuna/ponuda)
  - `/admin/invoices/edit` (Uređivanje računa — vidljivo samo za `SUPER_ADMIN` ulogu)
  - `/admin/apartments` (Upravljanje detaljima apartmana)
  - `/admin/settings` (Postavke firme/obrta)

## 5. Integracije i Jezici
- **Višejezičnost (i18n):** Prilikom prvog dolaska prikazuje se fullscreen popup sa zamućenom pozadinom za odabir jezika (s predoznačenim automatski prepoznatim jezikom preko IP-a/preglednika) i fallback gumbom za engleski.
- **Backend povezivanje:** Frontend je potpuno odvojen od baze podataka i komunicira isključivo s Spring Boot REST API-jem (prijava, dohvat recenzija, kalendar rezervacija, solar podaci preko WebSocketa `/ws/solar`, izrada PDF-ova, itd.).
- **Rezervacije:** Nema kontakt formi za rezervaciju na samom webu, već se sve preusmjerava na Booking.com i Airbnb.
