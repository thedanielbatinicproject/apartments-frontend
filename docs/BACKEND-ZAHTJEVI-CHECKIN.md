# Zahtjevi prema backendu — Prijave gostiju (checkin)

Frontend stranica `/intranet/checkins` je gotova: skeniranje papirnatog obrasca kamerom (mobitel) ili uploadom (desktop), pregled svih prijava sa sva 3 načina unosa, dual-screen provjera podataka uz sliku, ispravci, kopiranje u eVisitor.

Koristi svih 5 postojećih admin ruta iz §9 (`records` lista i detalj, `PUT` ispravak, `mark-reviewed`, `DELETE`) + `paper-scan`. Ovaj dokument opisuje izmjene potrebne da sve radi kako je zamišljeno.

---

## 1. `POST /api/admin/checkin/paper-scan` — maknuti obavezni `apartmentId`

**Trenutno:** ruta traži `apartmentId` (query/form, required).

**Traženo:** `apartmentId` maknuti ili učiniti opcionalnim.

Papirnati obrazac je izmijenjen i sada **nosi oznaku apartmana na samom papiru**: desno od gornjeg lijevog pozicijskog markera stoji kod tipa `EN-1` (jezik obrasca + ID apartmana). Backend tim je s time već upoznat — OCR čita oznaku s papira, pa frontend ne šalje ništa osim slike:

```
POST /api/admin/checkin/paper-scan
Content-Type: multipart/form-data
  image: <jpeg>
```

- Ako oznaka s papira nije čitljiva → `422` s porukom `"Oznaka apartmana nije prepoznata s obrasca"` — frontend će je prikazati i ponuditi ponovno skeniranje.
- Ako želite zadržati `apartmentId` kao opcionalnu potvrdu (usporedba s pročitanim), frontend ga može poslati — javite pa ga dodajemo.

**Napomena o slici:** frontend šalje JPEG (~1400 px širine, kvaliteta 0.92), već obrezan na A4 okvir i odabran kao najoštriji iz burst niza — ulaz u OCR bi trebao biti konzistentniji nego sirova fotografija.

---

## 2. Izvorno OCR čitanje po polju — novo polje `originalExtraction`

Admin u provjeri ispravlja podatke, a ispod svakog polja frontend prikazuje **sivo što je OCR izvorno pročitao** — da se ispravak može usporediti s originalom i nakon spremanja.

**Traženo:** pri prvom OCR čitanju spremiti snimku pročitanih vrijednosti (nepromjenjivu), i vraćati je u `AdminGuestRecordResponse`:

```jsonc
"originalExtraction": {
  "fullName": "MARKO MARIC",
  "dateOfBirth": "1985-03-12",
  "placeOfBirth": "SPLIT",
  "placeOfResidence": "SPLIT, CROATIA",
  "documentType": "ID_CARD",
  "documentNumber": "112233445",
  "nationality": "HRV",
  "sex": "M",
  "documentExpiryDate": "2030-01-01"
}
```

- Popunjava se SAMO za zapise nastale OCR-om (`OCR_SELF`, `ADMIN_PAPER_SCAN`); za `MANUAL_FORM` je `null`.
- Nikad se ne mijenja — `PUT` ispravci diraju samo glavna polja.
- Frontend polje već čita (opcionalno), pa je izmjena kompatibilna.

---

## 3. `PUT /api/admin/checkin/records/{id}` — dodati datume boravka

`AdminCorrectionRequest` trenutno **ne prima** `arrivalDate` / `departureDate`, a `AdminGuestRecordResponse` ih vraća. Ako OCR krivo pročita datume boravka (ili ih papirnati obrazac uopće nema), admin ih nema kako ispraviti — a upravo se ti datumi prepisuju u eVisitor.

**Traženo:** proširiti `AdminCorrectionRequest`:

```
arrivalDate: LocalDate (optional)
departureDate: LocalDate (optional)
```

Validacija: `departureDate > arrivalDate` ako su oba poslana → inače `400`.

Frontend ih već šalje kad su promijenjeni.

---

## 4. Potvrde ponašanja (ne traže kod, samo odgovor)

1. **`GET /api/admin/checkin/records` bez parametara** — frontend zove bez ijednog filtera i očekuje sve zapise. Postoji li limit? Paginacija je zasad frontend-side (5 po stranici); ako zapisa bude tisuće, javite pa prelazimo na server-side paginaciju.

2. **Papirnati obrazac s 2 gosta** — obrazac ima polja za dva gosta. Vraća li `paper-scan` jedan zapis ili dva? Frontend trenutno očekuje **jedan** `AdminGuestRecordResponse`; ako ruta može vratiti niz (dva gosta s istog papira), javite — prilagodba na frontendu je mala, ali je bolje znati unaprijed.

3. **Datumi boravka kod paper-scana** — papirnati obrazac nema polja za dolazak/odlazak. Odakle backend uzima `arrivalDate`/`departureDate` za takve zapise? (Ako ostaju prazni, admin ih upisuje ručno kroz ispravak — zato i točka 3 gore.)

4. **`documentImageUrls` za paper-scan** — pretpostavljamo da uploadana slika obrasca završi u `documentImageUrls` i da je dostupna na `/api/admin/files/**` uz JWT. Frontend je tako prikazuje u dual-screen provjeri.

---

## Sažetak

```
POST /api/admin/checkin/paper-scan      → maknuti obavezni apartmentId (čita se s papira, "EN-1")
                                        → 422 s porukom ako oznaka nije prepoznata
AdminGuestRecordResponse                → + originalExtraction (snimka OCR čitanja, nepromjenjiva)
AdminCorrectionRequest                  → + arrivalDate, departureDate
```

Frontend je već napisan po ovom ponašanju:
- `scanPaperForm()` šalje samo sliku (bez apartmentId) — dok se ruta ne prilagodi, backend će vraćati 400 i to se uredno prikazuje kao greška
- `originalExtraction` se prikazuje čim ga backend počne slati; do tada se sivi redak jednostavno ne renderira
- Ispravak datuma se šalje u `PUT` — dok ruta ne primi ta polja, backend će ih ignorirati ili vratiti 400, ovisno o implementaciji
