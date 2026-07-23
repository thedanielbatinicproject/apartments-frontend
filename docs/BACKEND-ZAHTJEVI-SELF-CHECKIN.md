# Zahtjevi prema backendu — Self-checkin gosta i jezici

Frontend `/checkin/{apartmentId}` je gotov: odabir jezika na prvom posjetu (geo prijedlog), datumi s prijedlogom iz kalendara, GDPR privola, sken dokumenta kamerom (prednja/stražnja strana) ili ručni unos, potvrda podataka, uspjeh s opcijom prijave sljedećeg gosta.

Koristi **sve rute iz §7 i §8**: `detect-language`, `start`, `document-scan`, `status`, `manual`, `confirm`. Ovaj dokument navodi izmjene i potvrde koje tražimo.

---

## 1. Jezik gosta uz prijavu — novo polje `language` u `/start`

Gost cijeli tok prolazi na svom jeziku (6 jezika: hr, en, de, it, fr, ua). Korisno je da i backend zna taj jezik:

- admin u intranetu vidi na kojem je jeziku gost prošao prijavu,
- buduće notifikacije gostu (potvrda mailom?) mogu biti na njegovom jeziku.

**Traženo** — `CheckinStartRequest` proširiti:

```
language: string (optional, ISO 639-1: "hr"|"en"|"de"|"it"|"fr"|"ua")
```

Samo se sprema uz zapis; nikakva logika. Frontend ga već šalje — dok se polje ne doda, backend će ga ignorirati (bez štete).

> Napomena: frontend trenutno šalje samo poznata polja; `language` ćemo dodati u poziv čim potvrdite da ruta polje prihvaća, da ne izazovemo 400 na strožoj validaciji.

---

## 2. Slike u `document-scan` — potvrda ograničenja

Frontend šalje JPEG ~1600 px širine (kvaliteta 0.92), obrezan na okvir dokumenta i odabran kao najoštriji iz burst niza. Molimo potvrdu:

1. **Maksimalna veličina uploada** — koji je limit (`MaxUploadSizeExceededException` → 413)? Da znamo treba li dodatna kompresija.
2. **Obje slike u jednom requestu** — `front` + `back` idu zajedno u jedan multipart poziv; potvrdite da je to očekivano (a ne dva poziva).
3. **Vozačka bez MRZ-a** — referenca kaže da vozačka nema MRZ pa ide na `MANUAL_REVIEW`. Vrijedi li OCR uopće pokušati za `DRIVING_LICENCE`, ili je za taj tip realno uvijek ručna dopuna? (Frontend svejedno vodi gosta kroz review — samo da znamo što očekivati u poljima.)

---

## 3. `EXPIRED` status — kada nastupa?

`GuestStayStatus` uključuje `EXPIRED`, ali referenca ne kaže kad zapis istekne (vremenski limit od `start`? scheduler?). Frontend na `EXPIRED` prikazuje "sesija je istekla — krenite ispočetka" i vraća na početak. Molimo kratak opis pravila da poruku uskladimo (npr. "prijava vrijedi 30 min od starta").

---

## 4. Ponovni sken nakon `FAILED` — isti record?

Kad OCR padne (`confidence < 0.7` → `FAILED`), frontend nudi "skeniraj ponovo" i šalje **novi `document-scan` na ISTI `recordId`**. Molimo potvrdu da je to podržano (zamjena slika + novi OCR), ili treba li novi `/start`.

Isto pitanje za prijelaz `FAILED` → `/manual` na istom recordu.

---

## 5. Kalendar kao izvor prijedloga datuma — javna ruta, potvrda

Frontend za prijedlog datuma koristi javnu `GET /api/calendar/{apartmentId}` i bira tekući period (danas unutar raspona) ili najbliži budući. To znači da gost na javnoj stranici vidi zauzete periode apartmana — što je ionako javno na Airbnb/Bookingu, ali potvrdite da je namjerno i za ovaj kontekst.

---

## 6. Geo ruta — bez izmjena, samo napomena

`GET /api/geo/detect-language` radi kako treba za predoznaku jezika. Napomena za produkciju: iza reverse proxyja mora stizati ispravan `X-Forwarded-For`, inače će svi gosti dobivati fallback `en`.

---

## Sažetak

```
CheckinStartRequest += language: string (optional)    // jezik gosta, samo se sprema
```

## Pitanja (ne traže kod, samo odgovor)

1. Limit veličine slike u document-scan?
2. FAILED → ponovni document-scan na istom recordId — podržano?
3. Kada zapis prelazi u EXPIRED?
4. Vozačka: pokušava li se OCR ili odmah prazna polja + MANUAL_REVIEW?
5. `confirm` ne prima `nationality` — je li namjerno (nationality dolazi isključivo iz MRZ-a)? Frontend je prikazuje read-only.
