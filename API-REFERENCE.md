# Apartments Backend — API Reference

Kompletan popis svih backend ruta, generiran direktno iz izvornog koda (post-fix, build-verified stanje, 2026-07-19). Namijenjen frontend developeru za integraciju.

## Konvencije

**Base URL:** `http://localhost:8080` (dev). Sve rute imaju prefiks `/api/...` osim `/files/**` i `/ws/solar/**`.

**Omotač odgovora (`ApiResponse<T>`)** — svaki JSON odgovor (osim binarnih fajlova/PDF-a) ima ovaj oblik:

```json
{
  "success": true,
  "data": { /* T, ili null */ },
  "message": "opcionalna poruka (npr. kod grešaka ili potvrda akcije)",
  "timestamp": "2026-07-19T10:00:00Z"
}
```

Polja `message` se izostavlja iz JSON-a ako je `null` (`@JsonInclude(NON_NULL)`). Kod grešaka je `success: false`, `data: null`, `message` sadrži opis greške.

**Autentikacija (JWT):** Header `Authorization: Bearer <accessToken>` na svim rutama koje nisu eksplicitno javne. Access token je kratkotrajan; refresh token (opaque, iz baze) se koristi na `/api/auth/refresh` za dobivanje novog para tokena. Refresh se rotira pri svakom pozivu (stari refresh token postaje nevažeći).

**Role:** postoje samo dvije role — `ADMIN` i `SUPERADMIN`. Nema posebne "guest"/"user" role — svaki autenticirani korisnik je neka vrsta admina. Rute bez posebne napomene o roli su dostupne i `ADMIN` i `SUPERADMIN` ulogama. Rute označene **SUPERADMIN** zahtijevaju tu specifičnu rolu.

**Greške — HTTP statusi:**

| Status | Kada |
|---|---|
| 400 | Validacijska greška (`@Valid` na body/paramu), `ConstraintViolationException` |
| 401 | `BadCredentialsException` (kriva lozinka na loginu) |
| 403 | `AccessDeniedException` (nema ovlasti / kriva rola) |
| 404 | `ResourceNotFoundException` (entitet ne postoji) |
| 409 | `InvalidStateException` (npr. akcija nije dopuštena u trenutnom stanju entiteta) |
| 413 | `MaxUploadSizeExceededException` (prevelik upload) |
| 500 | Sve ostalo (`Exception`) |

Svi ovi handleri vraćaju `ApiResponse` oblik s `success: false` i porukom u `message`.

**Datumi/vremena:** `LocalDate` polja idu kao `"YYYY-MM-DD"`, `Instant` polja kao ISO-8601 UTC (`"2026-07-19T10:00:00Z"`).

**CORS:** konfiguriran preko `app.cors.allowed-origins` (properties), primjenjuje se globalno.

---

## 1. Auth — `/api/auth` (sve rute javne, bez JWT-a)

### `POST /api/auth/login`
Prijava lokalnim računom (email + lozinka).

- Body (`LoginRequest`): `{ "email": string (required, valid email), "password": string (required) }`
- Response `data` (`TokenResponse`): `{ "accessToken": string, "refreshToken": string }`
- 401 ako su podaci neispravni.

### `POST /api/auth/google`
Prijava/registracija preko Google OAuth ID tokena (frontend dobiva `idToken` od Google Sign-In SDK-a).

- Body (`GoogleLoginRequest`): `{ "idToken": string (required) }`
- Response `data`: `TokenResponse` (isto kao gore)
- Ako je ovo prvi Google login za postojeći lokalni račun (isti email), backend automatski poveže Google identitet (`linkGoogleAccount`) i generira nasumičnu backup lozinku koju pošalje mailom (vidi `google-backup-password.html` template) — korisno ako korisnik kasnije poželi login lozinkom umjesto Googlea.

### `POST /api/auth/refresh`
Zamjenjuje refresh token za novi par tokena (rotacija).

- Body (`RefreshRequest`): `{ "refreshToken": string (required) }`
- Response `data`: `TokenResponse`
- Stari refresh token se invalidira nakon poziva.

### `POST /api/auth/logout`
Odjava — invalidira refresh token na serveru.

- Body (`RefreshRequest`): `{ "refreshToken": string (required) }`
- Response `data`: `null`, `message`: "Odjava uspješna"

### `POST /api/auth/invite/accept`
Prihvaćanje pozivnice novog admina (link iz emaila pozivnice) — postavlja lozinku i puno ime, vraća odmah tokene (auto-login).

- Body (`AcceptInviteRequest`): `{ "inviteToken": string (required), "fullName": string (required), "password": string (required, min 6 znakova) }`
- Response `data`: `TokenResponse`

### `POST /api/auth/forgot-password`
Pokreće reset lozinke — šalje email s reset linkom ako email postoji u sustavu.

- Body (`ForgotPasswordRequest`): `{ "email": string (required, valid email) }`
- Response `data`: `null`, generička poruka bez obzira postoji li email (sigurnosna mjera, ne otkriva postojanje računa)

### `POST /api/auth/reset-password`
Postavlja novu lozinku koristeći token iz reset emaila.

- Body (`ResetPasswordRequest`): `{ "resetToken": string (required), "newPassword": string (required, min 8 znakova) }`
- Response `data`: `null`, `message`: "Lozinka je uspješno promijenjena"

---

## 2. Admin Users — `/api/admin/users` (JWT, klasa je **SUPERADMIN**-only osim gdje je naznačeno)

### `GET /api/admin/users` — SUPERADMIN
Lista svih admin korisnika. Obrisani (soft delete) se **ne** vraćaju.

- Response `data`: `AdminUserResponse[]` — `{ id, email, fullName, role: "ADMIN"|"SUPERADMIN", authProvider: "LOCAL"|"GOOGLE", enabled: boolean, solarReportSubscribed: boolean }`

### `GET /api/admin/users/me` — dostupno svim autenticiranim (ADMIN i SUPERADMIN)
Podaci trenutno prijavljenog korisnika (iz JWT-a).

- Response `data`: `AdminUserResponse` (isti oblik kao gore)

### `PATCH /api/admin/users/me/solar-report-subscription` — dostupno svim autenticiranim
Uključi/isključi primanje tjednih solar izvještaja mailom.

- Body (`SolarReportSubscriptionRequest`): `{ "subscribed": boolean (required) }`
- Response `data`: `null`

### `POST /api/admin/users/invite` — SUPERADMIN
Šalje pozivnicu novom adminu (email s linkom na `/api/auth/invite/accept`).

- Body (`InviteRequest`): `{ "email": string (required, valid email), "role": "ADMIN"|"SUPERADMIN" (required) }`
- Response `data`: `null`, `message`: "Pozivnica poslana"

| Slučaj | Odgovor |
|---|---|
| Aktivan korisnik s tim emailom već postoji | `409` — "Korisnik s ovim emailom već postoji" |
| Email pripada **obrisanom** računu | `409` — "Ovaj email pripada obrisanom računu i ne može se ponovno koristiti" |

Ista provjera obrisanog emaila vrijedi i pri `POST /api/auth/invite/accept` — pokriva pozivnice izdane prije nego što je račun s tom adresom obrisan.

### `PATCH /api/admin/users/{id}/disable` — SUPERADMIN
- Path: `id` (Long)
- Response `data`: `null`, `message`: "Korisnik onemogućen"
- Poništava sve refresh tokene korisnika (prisilna odjava pri sljedećem refreshu)

| Slučaj | Odgovor |
|---|---|
| `id` je trenutno prijavljeni korisnik | `409` — "Ne možete onemogućiti vlastiti račun" |
| `id` je zadnji aktivni SUPERADMIN | `409` — "Sustav mora imati barem jednog aktivnog Super Admina" |
| Korisnik ne postoji (ili je obrisan) | `404` |

### `PATCH /api/admin/users/{id}/enable` — SUPERADMIN
- Path: `id` (Long)
- Response `data`: `null`, `message`: "Korisnik omogućen"
- Nema ograničenja (omogućavanje ne može zaključati sustav)

### `PATCH /api/admin/users/{id}/role` — SUPERADMIN
Mijenja rolu postojećeg admina.

- Path: `id` (Long)
- Body (`ChangeRoleRequest`): `{ "role": "ADMIN"|"SUPERADMIN" (required) }`
- Response `data`: **`AdminUserResponse`** (ažurirani korisnik), `message`: "Rola promijenjena" — frontend može osvježiti redak bez dodatnog `GET`-a
- Poništava sve refresh tokene korisnika. `JwtAuthenticationFilter` čita rolu iz JWT claima, pa stari access token nosi staru rolu do isteka (15 min); nakon toga se korisnik ne može refreshati i mora na login, gdje dobiva token s novom rolom.

| Slučaj | Odgovor |
|---|---|
| `id` je trenutno prijavljeni korisnik | `409` — "Ne možete mijenjati vlastitu rolu" |
| Degradiranje zadnjeg aktivnog SUPERADMINA | `409` — "Sustav mora imati barem jednog aktivnog Super Admina" |
| `role` nije `ADMIN` ni `SUPERADMIN` | `400` |
| Korisnik ne postoji (ili je obrisan) | `404` |

### `DELETE /api/admin/users/{id}` — SUPERADMIN
Briše admin račun (**soft delete**).

- Path: `id` (Long)
- Body: nema
- Response `data`: `null`, `message`: "Korisnik obrisan"
- Poništava sve refresh tokene korisnika

Implementirano kao soft delete (`deleted_at`), jer `admin_invites.invited_by_id` je `NOT NULL`, a `invoices` / `relay_commands` / `guest_stay_records` drže FK reference na admina — tvrdi `DELETE` bi puknuo na FK constraintu ili uništio revizijski trag. Korisnik nestaje iz `GET /api/admin/users`, ne može se prijaviti niti primati mailove, ali reference ostaju valjane.

> **Email ostaje zauzet.** Stupac `email` ima unique constraint, pa se adresa obrisanog računa **ne može ponovno koristiti** — `POST /invite` i prihvaćanje pozivnice na tu adresu vraćaju `409` "Ovaj email pripada obrisanom računu i ne može se ponovno koristiti".

| Slučaj | Odgovor |
|---|---|
| `id` je trenutno prijavljeni korisnik | `409` — "Ne možete obrisati vlastiti račun" |
| `id` je zadnji aktivni SUPERADMIN | `409` — "Sustav mora imati barem jednog aktivnog Super Admina" |
| Korisnik ne postoji (ili je već obrisan) | `404` |

---

## 3. Admin Invites — `/api/admin/invites` (JWT, **SUPERADMIN**-only)

### `GET /api/admin/invites`
Lista svih poslanih pozivnica (i iskorištenih i neiskorištenih).

- Response `data`: `AdminInviteResponse[]` — `{ id, email, role, used: boolean, expired: boolean, expiryDate: Instant }`

### `DELETE /api/admin/invites/{id}`
Opoziva neiskorištenu pozivnicu.

- Path: `id` (Long)
- Response `data`: `null`

---

## 4. Apartments (public) — `/api/apartments`

### `GET /api/apartments`
Lista svih aktivnih apartmana (javni katalog).

- Query: `lang` (optional, string, npr. `"hr"`, `"en"`, `"de"`) — jezik za prijevod naziva/opisa. Ako izostane ili prijevod ne postoji, koristi se fallback jezik.
- Response `data`: `ApartmentResponse[]`

### `GET /api/apartments/{id}`
Detalj jednog apartmana.

- Path: `id` (Long)
- Query: `lang` (optional)
- Response `data`: `ApartmentResponse`

**`ApartmentResponse`** (javna verzija, `includeAdminFields=false` — polja `companyId`/`airbnbIcalUrl`/`bookingIcalUrl` su `null`):
```
id, internalCode, roomCount, capacity, latitude, longitude, amenities: string[],
active, sortOrder, companyId, airbnbIcalUrl, bookingIcalUrl,
name, description,                    // razriješeno za traženi ?lang=
translationFallbackUsed: boolean,     // true ako traženi jezik ne postoji pa je vraćen fallback
availableLanguages: string[],         // koji jezici stvarno postoje u bazi
coverImageUrl, images: ApartmentImageResponse[]
```
**`ApartmentImageResponse`**: `{ id, url, sortOrder, cover: boolean }`

---

## 5. Admin Apartments — `/api/admin/apartments` (JWT, ADMIN/SUPERADMIN)

### `GET /api/admin/apartments`
Lista SVIH apartmana (uključujući skrivene/neaktivne, za razliku od javne rute), s admin poljima (`companyId`, iCal URL-ovi) popunjenima.

- Response `data`: `ApartmentResponse[]`

### `POST /api/admin/apartments`
Kreira novi apartman.

- Body (`ApartmentRequest`):
```
internalCode: string (required)
roomCount, capacity: Integer
latitude, longitude: Double
companyId: Long (required)
amenities: string[]
active: Boolean
sortOrder: Integer
airbnbIcalUrl, bookingIcalUrl: string
translations: ApartmentTranslationRequest[] (required, min 1)
```
- `ApartmentTranslationRequest`: `{ languageCode: string (required), name: string (required), description: string (required) }`
- Response `data`: `ApartmentResponse` (admin verzija — ical URL-ovi popunjeni)

### `PUT /api/admin/apartments/{id}`
Ažurira apartman (isti body kao create).

- Path: `id` (Long); Body: `ApartmentRequest`
- Response `data`: `ApartmentResponse`

### `DELETE /api/admin/apartments/{id}`
- Path: `id` (Long) → `data: null`

### `PATCH /api/admin/apartments/{id}/active`
Aktivira/deaktivira apartman (prikaz na javnoj stranici).

- Path: `id` (Long); Query: `active` (boolean, required)
- Response `data`: `null`

### `POST /api/admin/apartments/{id}/images`
Upload slike apartmana.

- Path: `id` (Long)
- Body: `multipart/form-data`, polje `file` (required)
- Response `data`: `Long` (id nove slike)

### `PUT /api/admin/apartments/{id}/images/order`
Redoslijed slika (drag&drop reorder na frontendu).

- Path: `id` (Long); Body (`ReorderImagesRequest`): `{ "orderedImageIds": Long[] }`
- Response `data`: `null`

### `PUT /api/admin/apartments/{id}/images/{imageId}/cover`
Postavlja sliku kao naslovnu (cover).

- Path: `id`, `imageId` (Long) → `data: null`

### `DELETE /api/admin/apartments/{id}/images/{imageId}`
- Path: `id`, `imageId` (Long) → `data: null`

### `GET /api/admin/apartments/{id}/translations`
- Path: `id` (Long)
- Response `data`: `ApartmentTranslationResponse[]` — `{ languageCode, name, description }`

### `PUT /api/admin/apartments/{id}/translations/{lang}`
Kreira ili ažurira prijevod za dani jezik (upsert — ručno upravljanje, NEMA auto-prijevoda/AI generacije).

- Path: `id` (Long), `lang` (string, npr. `"hr"`)
- Body (`ApartmentTranslationRequest`): `{ languageCode, name (required), description (required) }`
- Response `data`: `null`

### `DELETE /api/admin/apartments/{id}/translations/{lang}`
- Path: `id` (Long), `lang` (string) → `data: null`

---

## 6. Calendar — `CalendarController` (nema class-level prefiksa, rute su eksplicitne)

### `GET /api/calendar/{apartmentId}` — **javno**
Popunjeni periodi za apartman (za prikaz kalendara dostupnosti na javnoj stranici).

- Path: `apartmentId` (Long)
- Response `data`: `BookedPeriodResponse[]`

```jsonc
{
  "startDate": "2026-08-01",
  "endDate":   "2026-08-05",   // checkout, EKSKLUZIVAN
  "source":    "MERGED",        // "AIRBNB" | "BOOKING" | "MANUAL" | "MERGED"
  "sources":   ["AIRBNB", "BOOKING"],
  "periodIds": [12, 47],
  "merged":    true,
  "mismatch":  false
}
```

**Preklapajući periodi spajaju se u uniju.** Isti termin rezerviran preko Airbnba i zrcaljen kao blokada na Bookingu vraća se kao **jedan** period. Vraćeni periodi se međusobno **ne preklapaju**, pa ih frontend može crtati redom.

| Polje | Značenje |
|---|---|
| `source` | Zadržano radi kompatibilnosti. Za nespojeni period naziv izvora, za spojeni `"MERGED"`. |
| `sources` | Svi izvori koji su doprinijeli periodu. Uvijek popunjeno, i kad je samo jedan. |
| `periodIds` | ID-evi pojedinačnih zapisa iza ovog perioda. Proslijediti u `DELETE /api/admin/calendar/periods/{periodId}` — spojeni period sam po sebi nema identitet pa se briše po pojedinačnom zapisu. |
| `merged` | Je li period nastao spajanjem više zapisa. |
| `mismatch` | `true` samo ako spojeni zapisi **nisu** imali identične datume — potencijalni dvostruki booking. Identični datumi iz dva izvora su normalno zrcaljenje i daju `false`. |

> `endDate` je checkout i tretira se kao ekskluzivan: checkout jednog i checkin drugog gosta **istog dana nisu** preklapanje i ostaju zasebni periodi.
>
> Spajanje se radi pri čitanju, ne u bazi — u bazi se čuva provenijencija (redak po izvoru) jer je sync po izvoru, pa bi brisanje "duplikata" pri spremanju sljedeći sync samo vratio.

### `POST /api/admin/calendar/{apartmentId}/sync` — JWT (ADMIN/SUPERADMIN)
Ručno pokreće iCal sync (Airbnb/Booking) za apartman. Sync se pokreće i automatski schedulerom.

- Path: `apartmentId` (Long) → `data: null`

**Semantika sync-a (upsert, ne zamjena):** Airbnb/Booking feedovi sadrže samo rezervacije od danas nadalje, pa se povijest **ne briše**. Zapisi se matchaju po `external_uid`, postojeći se ažuriraju, novi dodaju. Briše se samo ono što je nestalo iz feeda **i** još je aktualno (checkout danas ili kasnije) — to je stvarno otkazana rezervacija. Duplikati istog UID-a unutar feeda se dedupliciraju.

**Interval automatskog sync-a** je konfigurabilan preko `app.calendar.sync-interval-ms` (ili env `ICAL_SYNC_INTERVAL_MS`), **default 10 minuta**. Mjeri se od početka prethodnog izvođenja; prvi sync ide odmah po pokretanju aplikacije.

### `DELETE /api/admin/calendar/periods/{periodId}` — JWT (ADMIN/SUPERADMIN)
Briše pojedinačni zauzeti period.

- Path: `periodId` (Long) — iz `BookedPeriodResponse.periodIds`
- Response `data`: `null`
- `404` ako period ne postoji

> **Brisanje nije uvijek trajno.** Periodi iz Airbnb/Booking feeda koji su još aktualni (checkout danas ili kasnije) i dalje su u feedu, pa ih sljedeći sync (default svakih 10 min) vraća — upsert ih prepozna po `external_uid`. Trajno se brišu samo **prošli** periodi (feed ih više ne sadrži) i `MANUAL` unosi.
>
> `message` u odgovoru razlikuje ta dva slučaja: `"Period obrisan"` odnosno `"Period obrisan, ali dolazi iz iCal feeda pa će se vratiti pri sljedećoj sinkronizaciji"`.

### `GET /api/admin/calendar/sync-status` — JWT (ADMIN/SUPERADMIN)
Status zadnjeg sync-a za sve apartmane (za admin dashboard — je li zadnji import uspio, kada, koliko perioda importirano).

- Response `data`: `SyncStatusResponse[]` — `{ apartmentId, apartmentInternalCode, source, lastSyncAt: Instant, lastSyncSuccess: boolean, lastErrorMessage, importedCount: Integer }`

**`lastErrorMessage` nosi i upozorenja, ne samo greške.** Kad sync uspije ali je nešto sumnjivo, `lastSyncSuccess` ostaje `true`, a poruka dobiva prefiks `UPOZORENJE:`. Više upozorenja se spaja s ` | `.

| Upozorenje | Kada |
|---|---|
| `UPOZORENJE: preklapajuće rezervacije: ...` | Dvije rezervacije se preklapaju **unutar istog** feeda |
| `UPOZORENJE: preklapanje s drugim izvorom: ...` | Neidentično preklapanje **između** Airbnba i Bookinga — upisuje se u status **oba** izvora |

Neidentično preklapanje između izvora **dodatno šalje email** svim aktivnim adminima (mogući dvostruki booking). Identična preklapanja ne generiraju mail — to je normalno zrcaljenje rezervacije, pa nema spama.

---

## 7. Geo — jezik po IP-u (javno)

### `GET /api/geo/detect-language`
Detektira državu i preporučeni jezik posjetitelja na temelju IP adrese (koristi `ipapi.co`, cache 24h po IP-u). Nema parametara — backend uzima IP iz `X-Forwarded-For` headera (ili `remoteAddr` ako headera nema).

- Response `data`: `{ "detectedCountry": string, "suggestedLanguage": string }` (npr. `{"detectedCountry":"DE","suggestedLanguage":"de"}`)
- Fallback na `"UNKNOWN"` / `"en"` ako je IP privatna/lokalna ili vanjski servis nedostupan.

---

## 8. Checkin (gost, self-service) — `/api/checkin` (sve rute **javne**, bez logina — gost dolazi preko QR koda)

Ovo je online check-in tok koji gost prolazi sa svog telefona. Dva moguća puta: **OCR_SELF** (skenira dokument) ili **MANUAL_FORM** (ručno upiše podatke bez slike).

### `POST /api/checkin/start`
Prvi korak — gost odabire boravak i daje privolu za obradu podataka. Vraća `recordId` koji se koristi u svim sljedećim koracima.

- Body (`CheckinStartRequest`): `{ "apartmentId": Long (required), "arrivalDate": LocalDate (required), "departureDate": LocalDate (required), "consentGiven": boolean (mora biti true) }`
- Response `data`: `{ "recordId": Long }`

### `POST /api/checkin/{recordId}/document-scan` — multipart
OCR tok: gost fotografira dokument (osobnu, putovnicu ili vozačku). Backend radi Tesseract OCR + MRZ parsing (za putovnicu/osobnu), popunjava podatke automatski.

- Path: `recordId` (Long)
- Content-Type: `multipart/form-data`
- Form params:
  - `documentType` (query/form param, required) — enum `ID_CARD` | `PASSPORT` | `DRIVING_LICENCE`
  - `front` (file, required) — slika prednje strane
  - `back` (file, optional) — slika stražnje strane (vozačka/osobna imaju stražnju stranu, putovnica ne mora)
- Response `data`: `CheckinStatusResponse` (vidi ispod)
- Logika statusa: ako je `confidence < 0.7` → status `FAILED` (gost mora ponovno fotografirati). Ako uspije ali je `unreliable` (npr. vozačka nema MRZ, ili MRZ ne prođe validaciju) ili `confidence < 0.96` → status `MANUAL_REVIEW` (gost mora potvrditi/dopuniti podatke kroz `/confirm`). Prag `0.96` znači "visoko pouzdano" ali gost SVEJEDNO uvijek prolazi kroz `/confirm` korak prije nego evidencija postane konačna.

### `GET /api/checkin/{recordId}/status`
Polling — provjera trenutnog statusa obrade (frontend može pollati dok je `PROCESSING`).

- Path: `recordId` (Long)
- Response `data`: `CheckinStatusResponse`

### `POST /api/checkin/{recordId}/manual`
Alternativa OCR-u — gost ručno upisuje sve podatke (npr. ako nema pri sebi dokument za skeniranje ili OCR ne radi). Uvijek ide na `MANUAL_REVIEW` (admin mora provjeriti).

- Path: `recordId` (Long)
- Body (`ManualCheckinRequest`): `{ "fullName": string (required), "dateOfBirth": LocalDate (required), "placeOfBirth": string (required), "placeOfResidence": string (required), "documentType": "ID_CARD"|"PASSPORT"|"DRIVING_LICENCE" (required), "documentNumber": string (required) }`
- Response `data`: `CheckinStatusResponse`

### `POST /api/checkin/{recordId}/confirm`
Zadnji korak — gost pregledava izvučene/upisane podatke i potvrđuje (ili ispravlja) prije finalizacije. Nakon ovoga se šalje notifikacija adminu o novoj evidenciji.

- Path: `recordId` (Long)
- Body (`ConfirmCheckinRequest`): `{ "fullName": string (required), "dateOfBirth": LocalDate (required), "placeOfBirth": string (required), "placeOfResidence": string (required), "documentNumber": string (required) }`
- Response `data`: `CheckinStatusResponse`
- Ako je izvorno OCR bio pouzdan (`!unreliableExtraction && confidence >= 0.96`) → status postaje `VERIFIED`. Inače ostaje `MANUAL_REVIEW` (čeka admin pregled).

**`CheckinStatusResponse`** (zajednički oblik za sve gornje rute):
```
recordId: Long
status: "PENDING"|"PROCESSING"|"VERIFIED"|"FAILED"|"MANUAL_REVIEW"|"EXPIRED"
needsManualReview: boolean
unreliableExtraction: boolean
confidence: Double (nullable)
fullName, dateOfBirth, placeOfBirth, placeOfResidence, documentNumber, nationality
placeOfBirthMissing: boolean       // true ako OCR nije uspio izvući mjesto rođenja - gost MORA ručno upisati
placeOfResidenceMissing: boolean   // isto za mjesto prebivališta
message: string (nullable, informativna poruka za prikaz gostu)
```

**Napomena o slikama dokumenata:** slike se spremaju na `checkin-documents/{recordId}/` i automatski brišu `departureDate + 10 dana` (scheduler). Nisu javno servirane preko `/files/**` (GDPR) — vidi §12 Files.

---

## 9. Checkin Admin — `/api/admin/checkin` (JWT, ADMIN/SUPERADMIN)

### `GET /api/admin/checkin/records`
Pretraga/filter svih evidencija gostiju.

- Query (svi optional): `apartmentId` (Long), `status` (enum `GuestStayStatus`), `from` (LocalDate, ISO `YYYY-MM-DD`), `to` (LocalDate, ISO)
- Response `data`: `AdminGuestRecordResponse[]`

Poziv **bez ijednog parametra** je podržan i vraća sve zapise, sortirano po `createdAt DESC`. **Nema limita ni paginacije** — vraća se cijela tablica.

### `GET /api/admin/checkin/records/{id}`
Detalj jedne evidencije.

- Path: `id` (Long) → `data: AdminGuestRecordResponse`

### `PUT /api/admin/checkin/records/{id}`
Admin ručno ispravlja podatke (npr. nakon crosscheck-a s papirnatim dokumentom).

- Path: `id` (Long)
- Body (`AdminCorrectionRequest`, sva polja opcionalna — šalju se samo ona koja se mijenjaju): `{ fullName, dateOfBirth, placeOfBirth, placeOfResidence, documentType, documentNumber, nationality, sex, documentExpiryDate, apartmentId, arrivalDate, departureDate }`
- Response `data`: `AdminGuestRecordResponse`
- `409` ako je zapis očišćen (`personalDataPurgedAt` postavljen) a šalje se `documentNumber` ili `documentExpiryDate`
- `400` "Datum odlaska mora biti nakon datuma dolaska"

`arrivalDate`/`departureDate` su ovdje jedini način da se datumi boravka postave za `ADMIN_PAPER_SCAN` zapise — papirnati obrazac ih ne sadrži.

> Validira se **konačno stanje**, ne samo poslana polja. Ako se pošalje samo `departureDate`, uspoređuje se s već spremljenim `arrivalDate` — inače bi se kroz dva odvojena poziva dao složiti nevaljan boravak.

`originalExtraction` se ispravcima **nikad ne mijenja** — ostaje snimka onoga što je OCR pročitao.

### `POST /api/admin/checkin/records/{id}/mark-reviewed`
Admin označava evidenciju kao pregledanu (ručna verifikacija). Sprema tko je pregledao (iz JWT-a) i kada.

- Path: `id` (Long)
- Response `data`: `null`

### `DELETE /api/admin/checkin/records/{id}`
**Ne briše zapis** — uklanja samo osjetljive podatke (GDPR). Evidencija boravka ostaje.

- Path: `id` (Long)
- Response `data`: `null`, `message`: "Osjetljivi podaci uklonjeni"
- Idempotentno: ponovni poziv nad već očišćenim zapisom prolazi bez promjene

| Trajno uklonjeno | Ostaje |
|---|---|
| `documentNumber` | `fullName`, `dateOfBirth`, `placeOfBirth`, `placeOfResidence` |
| `documentExpiryDate` | `documentType`, `nationality`, `sex` |
| slike dokumenata — **i fizičke datoteke i DB retci** | `arrivalDate`, `departureDate`, `apartmentId` |
| svi `ocr_attempts` (njihov `extractedJson` sadrži sirovi MRZ s brojem dokumenta) | `status`, `submissionMethod`, `reviewedAt` |

Nakon poziva `AdminGuestRecordResponse.personalDataPurgedAt` je postavljen. **Frontend to mora razlikovati od neuspjelog OCR-a** — u oba slučaja je `documentNumber` prazan, ali kod purgea podaci ne postoje i ne mogu se vratiti, dok kod neuspjelog OCR-a admin još može unijeti ispravke.

> `PUT /api/admin/checkin/records/{id}` na očišćenom zapisu vraća `409` ako se šalje `documentNumber` ili `documentExpiryDate` — inače bi se GDPR brisanje moglo poništiti jednim pozivom. Ostala polja (npr. ispravak imena) i dalje prolaze.

### `POST /api/admin/checkin/paper-scan` — multipart
Admin skenira/fotografira ispunjen papirnati obrazac. Obrazac ima **dva bloka za goste**, pa jedna slika može dati **do dva zapisa**.

- Content-Type: `multipart/form-data`, polje `image` (required)
- Query/form: `apartmentId` (Long, **opcionalno**) — override; ako izostane, čita se oznaka s papira (`EN-1` → apartman 1)
- Response `data`: **`PaperScanResponse`**

```jsonc
{
  "records": [ /* AdminGuestRecordResponse, jedan po popunjenom bloku (0-2) */ ],
  "blocksDetected": 2,          // uvijek 2 - obrazac ima toliko blokova
  "blocksFilled": 1,            // koliko ih je stvarno popunjeno
  "detectedFormIdentifier": "EN-1",
  "detectedApartmentId": 1,
  "identifierReadable": true
}
```

> **`records` je niz, ne jedan objekt.** Kad su na papiru popunjena oba bloka, vraćaju se dva zapisa — oba vežu **istu** sliku obrasca u `documentImageUrls`.

| Slučaj | Odgovor |
|---|---|
| Obrazac se ne može poravnati (markeri nisu nađeni) | `422` — poruka iz kalibracije |
| Oznaka apartmana nije pročitana, a `apartmentId` nije poslan | `422` — "Oznaka apartmana nije prepoznata s obrasca" |
| Oznaka pročitana, ali taj apartman ne postoji | `422` — "Apartman iz oznake na obrascu ne postoji: {id}" |

`arrivalDate`/`departureDate` ostaju **`null`** — fizički obrazac ih nema. Admin ih upisuje kroz `PUT .../records/{id}`.

**`AdminGuestRecordResponse`**:
```
id, apartmentId, apartmentInternalCode
fullName, dateOfBirth, placeOfBirth, placeOfResidence
documentType, documentNumber, nationality, sex, documentExpiryDate
arrivalDate, departureDate
status: GuestStayStatus, submissionMethod: "OCR_SELF"|"MANUAL_FORM"|"ADMIN_PAPER_SCAN"
ocrConfidenceScore: Double, unreliableExtraction: boolean, needsManualReview: boolean
reviewedAt: Instant
documentImageUrls: string[]   // URL-ovi na /api/admin/files/... (GDPR-zaštićeno, treba JWT za pristup slikama)
personalDataPurgedAt: Instant | null
originalExtraction: object | null
```

**`originalExtraction`** — nepromjenjiva snimka onoga što je OCR pročitao pri **prvom** čitanju:

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

- popunjeno samo za `OCR_SELF` i `ADMIN_PAPER_SCAN`; za `MANUAL_FORM` je `null`
- "prvo čitanje pobjeđuje" — ponovljeni OCR pokušaj ne prepisuje snimku
- ispravci (`PUT`) je nikad ne mijenjaju
- **`null` i za purgirane zapise** — snimka sadrži broj dokumenta pa se briše zajedno s ostalim osjetljivim podacima

**Enumi:**
- `GuestStayStatus`: `PENDING, PROCESSING, VERIFIED, FAILED, MANUAL_REVIEW, EXPIRED`
- `SubmissionMethod`: `OCR_SELF, MANUAL_FORM, ADMIN_PAPER_SCAN`
- `DocumentType`: `ID_CARD, PASSPORT, DRIVING_LICENCE`

---

## 10. Companies — `/api/admin/companies` (JWT, ADMIN/SUPERADMIN)

Firme/vlasnici (izdavatelji računa) — projekt trenutno ima 2 placeholder firme ubačene seederom pri prvom pokretanju, treba ih urediti sa stvarnim podacima.

### `GET /api/admin/companies`
- Response `data`: `CompanyResponse[]`

### `GET /api/admin/companies/{id}`
- Path: `id` (Long) → `data: CompanyResponse`

### `PUT /api/admin/companies/{id}`
Ažurira podatke firme (za izdavanje računa — OIB, IBAN, kontakt, porezne napomene i sl.).

- Path: `id` (Long)
- Body (`CompanyUpdateRequest`): `{ brandName: string (required), ownerName, oib, address, city, postalCode, country, phone, email, bankName, iban, swift, currency, taxRate: BigDecimal, vatExemptNoteHr, vatExemptNoteEn, touristTaxNoteHr, touristTaxNoteEn, signatoryName }`
- Response `data`: `CompanyResponse`

### `POST /api/admin/companies/{id}/logo` — multipart
Upload logotipa firme (prikazuje se na PDF računima).

- Path: `id` (Long); Content-Type: `multipart/form-data`, polje `file` (required)
- Response `data`: `null`

### `GET /api/admin/companies/{id}/catalogs`
Vraća kataloge (predefinirane liste) koje se koriste kao autocomplete pri unosu stavki računa.

- Path: `id` (Long)
- Response `data` (`CompanyCatalogsRequest` shape): `{ unitDescriptionCatalog: string[], serviceTypeCatalog: string[], paymentMethodCatalog: string[] }`

### `PUT /api/admin/companies/{id}/catalogs`
Ažurira kataloge.

- Path: `id` (Long); Body: isti oblik kao gore
- Response `data`: `null`

**`CompanyResponse`** (puni oblik, uključuje sve iz update requesta plus): `id, brandName, ownerName, oib, address, city, postalCode, country, phone, email, bankName, iban, swift, logoUrl, currency, taxRate, vatExemptNoteHr, vatExemptNoteEn, touristTaxNoteHr, touristTaxNoteEn, signatoryName, unitDescriptionCatalog[], serviceTypeCatalog[], paymentMethodCatalog[]`

---

## 11. Invoicing — `InvoiceController` (nema class-level prefiksa)

Sustav računa/predračuna/ponuda. Svaka firma (`companyId`) ima svoj brojčani niz dokumenata po godini.

**Tok je jednokoračni:** spremi jednom → dokument je gotov s brojem i PDF-om → po potrebi uredi ili obriši. Statusi:

| Status | Nastaje | `editable` | Može se brisati |
|---|---|---|---|
| `ISSUED` | `POST` (default) | `true` | da |
| `DRAFT` | `POST ?issue=false` | `true` | da |
| `CANCELLED` | `POST /cancel` | `false` | da |

**PDV se nigdje ne obračunava ni prikazuje.** Firma je paušalni obrt izvan sustava PDV-a (`Company.taxRate` — komentar u entitetu: `null = paušalni obrt, nema PDV-a`). `InvoiceResponse` nema porezno polje: iznosi su `netAmount` (zbroj stavki), `discountAmount` i `totalDue`. PDF ispisuje UKUPNO / POPUST / ZA PLATITI i, ako je popunjena, napomenu `vatExemptNoteHr`.

### ADMIN rute (JWT, ADMIN/SUPERADMIN)

#### `GET /api/admin/invoices/{companyId}`
Pretraga/lista dokumenata za firmu.

- Path: `companyId` (Long)
- Query (svi optional): `documentType` (`INVOICE`|`PROFORMA`|`QUOTE`), `year` (Integer), `status` (`DRAFT`|`ISSUED`|`CANCELLED`)
- Response `data`: `InvoiceSummaryResponse[]` — `{ id, documentType, status, documentNumber, invoiceDate, recipientName, totalDue: BigDecimal, currency }`

#### `GET /api/admin/invoices/{companyId}/{invoiceId}`
Puni detalj dokumenta.

- Path: `companyId`, `invoiceId` (Long)
- Response `data`: `InvoiceResponse` (vidi ispod)

#### `POST /api/admin/invoices/{companyId}`
Kreira dokument i **odmah ga izdaje** — dodjeljuje `documentNumber`, `year` i `uid`, radi snapshot podataka iznajmljivača i vraća `status: "ISSUED"`. Nema zasebnog `/issue` koraka.

- Path: `companyId` (Long)
- Query: `issue` (boolean, default `true`) — `?issue=false` ostavlja dokument u `DRAFT`-u bez broja
- Body (`InvoiceRequest`):
```
documentType: "INVOICE"|"PROFORMA"|"QUOTE" (required)
apartmentId: Long (optional - poveži s apartmanom radi automatskog popunjavanja)
invoiceDate: LocalDate (optional, default danas)
recipientName: string (required)
recipientAddress, recipientOib, recipientCountry: string
guestCount, childrenCount: Integer
checkinDate, checkoutDate: LocalDate
items: InvoiceItemRequest[] (required, min 1)
discountAmount: BigDecimal
paymentMethod: string
customNotes: string
guestRecordId: Long (optional)   // id iz AdminGuestRecordResponse, samo se sprema
```
- `InvoiceItemRequest`: `{ unitDescription: string, roomNumber: Integer, serviceType: string, quantity: BigDecimal (required), unitPrice: BigDecimal (required) }`
- Response `data`: `InvoiceResponse` sa `status: "ISSUED"` i popunjenim `documentNumber`

`guestRecordId` se samo sprema i vraća — bez validacije da zapis postoji i bez kaskadnog brisanja. Namjerno je običan `Long` bez FK-a, jer evidencija gosta može biti očišćena ili obrisana neovisno o računu.

#### `PUT /api/admin/invoices/{companyId}/{invoiceId}`
Ažurira dokument. Radi na `DRAFT` **i** `ISSUED`; `CANCELLED` vraća `409`.

- Path: `companyId`, `invoiceId` (Long); Body: `InvoiceRequest` (isti oblik kao create)
- Response `data`: `InvoiceResponse`
- `documentNumber`, `year` i `uid` se pri izmjeni **ne mijenjaju** — dokument zadržava svoj broj
- `editable` u odgovoru je autoritet: `true` za `DRAFT` i `ISSUED`, `false` za `CANCELLED`

#### `POST /api/admin/invoices/{companyId}/{invoiceId}/issue`
Izdaje `DRAFT` (`DRAFT` → `ISSUED`). **Zadržano radi kompatibilnosti** — potrebno samo uz `?issue=false` pri kreiranju. Na već izdanom dokumentu vraća `409`.

- Path: `companyId`, `invoiceId` (Long) → `data: InvoiceResponse`

#### `POST /api/admin/invoices/{companyId}/{invoiceId}/cancel`
Stornira dokument (`→ CANCELLED`). Storniran dokument se više ne može uređivati.

- Path: `companyId`, `invoiceId` (Long) → `data: InvoiceResponse`

#### `DELETE /api/admin/invoices/{companyId}/{invoiceId}`
Briše dokument — dopušteno i za `ISSUED`.

- Path: `companyId`, `invoiceId` (Long) → `data: null`

| Slučaj | Brojač | `message` |
|---|---|---|
| Obrisan **zadnji** dokument u nizu (firma + tip + godina) | smanjuje se za 1, broj se oslobađa | `"Dokument obrisan, broj oslobođen"` |
| Obrisan dokument **iz sredine** niza | ne dira se, u nizu ostaje rupa | `"Dokument obrisan"` |

> **Oslobođeni broj se ponovno dodjeljuje.** Ako je gost već dobio PDF s brojem `5/2026`, a taj dokument se obriše, sljedeći izdani dokument opet dobiva `5/2026` — dva različita dokumenta s istim brojem u optjecaju. Brisati samo dokumente koji nisu izašli iz kuće; za sve ostalo koristiti storno.

#### `POST /api/admin/invoices/{companyId}/{invoiceId}/convert`
Konvertira dokument u drugi tip (npr. ponuda → predračun → račun) — kreira novi dokument povezan s `convertedFromId`.

- Path: `companyId`, `invoiceId` (Long)
- Query: `to` (`INVOICE`|`PROFORMA`|`QUOTE`, required)
- Response `data`: `InvoiceResponse` (novi dokument)

#### `GET /api/admin/invoices/{companyId}/{invoiceId}/pdf`
Generira i vraća PDF dokumenta.

- Path: `companyId`, `invoiceId` (Long)
- Response: **binarni PDF** (`Content-Type: application/pdf`, `Content-Disposition: inline; filename="..."`) — NE ide kroz `ApiResponse` omotač. Frontend ovo otvara direktno (npr. u novom tabu ili `<iframe>`), treba proslijediti `Authorization` header jer ruta zahtijeva JWT.

### PUBLIC ruta

#### `GET /api/invoices/verify`
Javna provjera valjanosti računa preko QR koda/UID-a otisnutog na PDF-u (za goste/porezne vlasti da provjere autentičnost).

- Query: `uid` (string, required)
- Response `data` (`InvoiceVerificationResponse`): `{ valid: boolean, documentNumber, invoiceDate, landlordBrandName, recipientName, totalDue: BigDecimal, currency, status }`

**`InvoiceResponse`** (puni oblik, vraćen na detail/create/update/issue/cancel/convert):
```
id, companyId, documentType, status, documentNumber, year, uid, invoiceDate
apartmentId, apartmentInternalCode, convertedFromId

// snapshot podataka firme u trenutku izdavanja (ne mijenja se ako firma kasnije promijeni podatke):
landlordBrandName, landlordOwnerName, landlordOib, landlordAddress, landlordCity,
landlordPostalCode, landlordCountry, landlordPhone, landlordEmail,
landlordBankName, landlordIban, landlordSwift, landlordSignatory

recipientName, recipientAddress, recipientOib, recipientCountry
guestCount, childrenCount, checkinDate, checkoutDate

items: InvoiceItemResponse[]   // { id, unitDescription, roomNumber, serviceType, quantity, unitPrice, lineTotal, sortOrder }
netAmount, discountAmount, totalDue: BigDecimal   // nema poreznog polja - paušalni obrt, izvan sustava PDV-a
currency, paymentMethod, customNotes
editable: boolean       // true za DRAFT i ISSUED, false za CANCELLED
guestRecordId: Long | null   // evidencija gosta iz koje je dokument popunjen
```

**Enumi:** `InvoiceDocumentType`: `INVOICE, PROFORMA, QUOTE`. `InvoiceStatus`: `DRAFT, ISSUED, CANCELLED`.

---

## 12. Reviews (public) — `/api/reviews`

### `GET /api/reviews/{apartmentId}`
Javne recenzije za apartman (samo `visible: true`).

- Path: `apartmentId` (Long)
- Response `data`: `ReviewResponse[]` — `{ id, authorName, rating: 1-5, text, languageCode, source, reviewDate, upvoteCount, upvotedByYou: boolean }`
- `upvotedByYou` se računa preko anonimnog fingerprinta (hash od IP + User-Agent, IP se nikad ne sprema sirovo).

### `POST /api/reviews/{reviewId}/upvote`
Toggle upvote na recenziju (ponovni poziv od istog posjetitelja skida upvote).

- Path: `reviewId` (Long)
- Response `data` (`UpvoteResponse`): `{ reviewId, upvoteCount, upvoted: boolean }`

---

## 13. Reviews Admin — `/api/admin/reviews` (JWT, ADMIN/SUPERADMIN)

### `GET /api/admin/reviews`
Lista svih recenzija (uključujući skrivene).

- Query: `apartmentId` (Long, optional — filter)
- Response `data`: `AdminReviewResponse[]` — `{ id, apartmentId, apartmentInternalCode, authorName, rating, text, languageCode, source, reviewDate, upvoteCount, visible: boolean, sortOrder }`

### `POST /api/admin/reviews`
Ručno dodavanje recenzije (npr. prepisana s Airbnb/Google/Booking, izvor nije direktno integriran preko API-ja).

- Body (`ReviewRequest`): `{ apartmentId: Long (required), authorName: string (required), rating: Integer (required, 1-5), text, languageCode, source: "AIRBNB"|"BOOKING"|"GOOGLE"|"OTHER", reviewDate: LocalDate, visible: Boolean, sortOrder: Integer }`
- Response `data`: `AdminReviewResponse`

### `PUT /api/admin/reviews/{id}`
- Path: `id` (Long); Body: `ReviewRequest` (isti oblik) → `data: AdminReviewResponse`

### `DELETE /api/admin/reviews/{id}`
- Path: `id` (Long) → `data: null`

---

## 14. Solar — `/api/solar` (mješoviti auth model — pažljivo pročitati)

Praćenje solarnog/baterijskog sustava (ESP32 uređaj na terenu) + daljinsko upravljanje relejima.

### DEVICE rute — **ne koriste JWT**, autenticiraju se preko headera `X-Device-Secret` (provjerava ga `DeviceAuthGuard` ručno unutar controllera, NE Spring Security filter chain). Frontend ove rute vjerojatno neće zvati (to je ESP32 → backend komunikacija), ali su navedene radi potpunosti.

#### `POST /api/solar/ingest`
ESP32 šalje očitanje senzora.

- Header: `X-Device-Secret: <secret>` (required)
- Body (`SolarIngestRequest`): `{ timestamp: Instant (optional, default = vrijeme primitka), batteryVoltage, batteryCurrent, batteryPower: Double, batterySoc: Integer, batteryTemperature: Double, pvVoltage, pvCurrent, pvPower: Double, loadVoltage, loadCurrent, loadPower: Double, yieldToday, consumptionToday: Double, controllerStatus: Integer, extra: Map<String,Object> }`
- Response `data`: `null`

#### `GET /api/solar/relay/pending`
ESP32 povlači listu čekajućih komandi za relee.

- Header: `X-Device-Secret`
- Response `data`: `PendingCommandResponse[]` — `{ commandId: Long, relayId: Integer, action: "ON"|"OFF"|"TOGGLE" }`

#### `POST /api/solar/relay/ack`
ESP32 potvrđuje izvršenje komande.

- Header: `X-Device-Secret`
- Body (`RelayAckRequest`): `{ commandId: Long (required), success: Boolean (required), resultingState: Boolean, failureReason: string }`
- Response `data`: `null`

### ADMIN rute — JWT (ADMIN/SUPERADMIN)

#### `GET /api/solar/chart-data`
Podaci za graf potrošnje/proizvodnje.

- Query: `range` (string, optional, default `"24h"` — vjerojatno podržava vrijednosti tipa `24h`/`7d`/`30d`, provjeriti `SolarIngestService.chartData()` za točan popis)
- Response `data`: `SolarReadingResponse[]` — `{ timestamp, batteryVoltage, batteryCurrent, batteryPower, batterySoc, batteryTemperature, pvVoltage, pvCurrent, pvPower, loadVoltage, loadCurrent, loadPower, yieldToday, consumptionToday, controllerStatus, extra: object }`

#### `GET /api/solar/latest`
Zadnje očitanje.

- Response `data`: `SolarReadingResponse` (isti oblik)

#### `GET /api/solar/variables`
Metapodaci o dostupnim varijablama (za dinamičko iscrtavanje legendi/labela na frontendu, dvojezično).

- Response `data`: `SolarVariableResponse[]` — `{ key, labelHr, labelEn, unit, group }`

#### `POST /api/solar/relay/{id}/toggle`
Šalje komandu releju (uključi/isključi/toggle). Komanda ide u red i čeka da je ESP32 povuče preko `/relay/pending` i potvrdi preko `/relay/ack` — nije trenutna radnja, response vraća trenutni status komande.

- Path: `id` → **relayId** (Integer, PathVariable `"id"`)
- Body (`RelayToggleRequest`, optional — smije biti prazan): `{ "action": "ON"|"OFF"|"TOGGLE" }`. Ako se ne pošalje body ili `action`, servis odlučuje default (provjeriti `RelayCommandService.sendCommand` za točno ponašanje kad je `action` null — vjerojatno se tretira kao `TOGGLE`).
- Response `data` (`RelayStatusResponse`): `{ relayId, currentState: Boolean (null = nepoznato), lastCommandStatus: "SENT"|"ACKED"|"FAILED"|"TIMEOUT", lastCommandAt: Instant, lastAckAt: Instant, pendingCommand: boolean }`

#### `GET /api/solar/relay/status`
Status svih releja (broj releja konfiguriran preko `solar.relay-ids`, default 4 releja: `1,2,3,4`).

- Response `data`: `RelayStatusResponse[]`

#### `GET /api/solar/reports/weekly`
Tjedni agregirani izvještaji (predizračunati schedulerom).

- Response `data`: `SolarAggregateResponse[]`

#### `GET /api/solar/reports/monthly`
Mjesečni agregirani izvještaji.

- Response `data`: `SolarAggregateResponse[]`

**`SolarAggregateResponse`**: `{ periodType: "WEEKLY"|"MONTHLY", periodStart, periodEnd: LocalDate, totalYieldKwh, totalConsumptionKwh, avgBatteryVoltage, minBatteryVoltage, maxBatteryVoltage: Double, minBatterySoc: Integer, peakPvPower, avgPvPower: Double, readingCount: Long }`

---

## 15. Files — statičko serviranje (`FileController`, nema `/api` prefiksa na public grani)

Servira slike apartmana, logotipe firmi, generirane PDF-ove i slike dokumenata gostiju. **Dvije razine pristupa:**

### `GET /files/**` — **javno**
Za apartmanske slike i logotipe (sve što treba biti vidljivo na javnoj stranici).

- Path: ostatak putanje nakon `/files/` (npr. `/files/apartments/1/photo.jpg`)
- Response: binarni fajl (`Resource`)
- **Eksplicitno odbija** (404) svaku putanju koja počinje s `checkin-documents/` — čak i ako netko pogodi točnu putanju, te slike NIKAD nisu javno dostupne (GDPR).

### `GET /api/admin/files/**` — JWT (ADMIN/SUPERADMIN)
Za sve ostalo, prvenstveno slike dokumenata gostiju (`checkin-documents/{recordId}/front_*.jpg` itd.) — GDPR-osjetljivo, samo prijavljeni admin smije vidjeti.

- Path: ostatak putanje nakon `/api/admin/files/`
- Response: binarni fajl
- Ovo su točno URL-ovi koji dolaze u `AdminGuestRecordResponse.documentImageUrls` (§9) — frontend mora poslati `Authorization` header pri fetchanju tih slika (npr. `fetch(url, {headers: {Authorization: 'Bearer ...'}})` pa prikazati kao blob, obična `<img src="...">` NEĆE raditi bez headera).

---

## Sažetak — javne rute (bez JWT-a)

```
POST   /api/auth/login
POST   /api/auth/google
POST   /api/auth/refresh
POST   /api/auth/logout
POST   /api/auth/invite/accept
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/apartments
GET    /api/apartments/{id}
GET    /api/calendar/{apartmentId}
GET    /api/geo/detect-language
GET    /api/reviews/{apartmentId}
POST   /api/reviews/{reviewId}/upvote
POST   /api/checkin/start
POST   /api/checkin/{recordId}/document-scan
GET    /api/checkin/{recordId}/status
POST   /api/checkin/{recordId}/manual
POST   /api/checkin/{recordId}/confirm
GET    /api/invoices/verify
GET    /files/**                        (osim checkin-documents/**)
POST   /api/solar/ingest                (X-Device-Secret header, ne JWT)
GET    /api/solar/relay/pending         (X-Device-Secret header)
POST   /api/solar/relay/ack             (X-Device-Secret header)
```

Sve ostale rute zahtijevaju `Authorization: Bearer <accessToken>`, a podskup je dodatno ograničen na **SUPERADMIN** (admin users CRUD osim `/me`, admin invites).

## Sažetak — SUPERADMIN rute za upravljanje adminima

```
GET    /api/admin/users
POST   /api/admin/users/invite
PATCH  /api/admin/users/{id}/disable
PATCH  /api/admin/users/{id}/enable
PATCH  /api/admin/users/{id}/role      body: { role: "ADMIN"|"SUPERADMIN" }
DELETE /api/admin/users/{id}                                    (soft delete)
```

Zajednička pravila za `disable`, `role` i `delete`:

- `409` ako je meta trenutno prijavljeni korisnik
- `409` ako bi zahvat ostavio sustav bez ijednog aktivnog SUPERADMINA
- svi poništavaju refresh tokene ciljanog korisnika

> **Rola nije trenutna.** `JwtAuthenticationFilter` čita rolu iz JWT claima, ne iz baze, pa postojeći access token nosi staru rolu do isteka (`app.jwt.access-token-expiration-ms`, default 15 min). Nakon toga refresh ne prolazi i korisnik mora na login. Ako frontend treba trenutni efekt, mora sam odjaviti korisnika.

---

## Poznata ograničenja / nedovršeno (za svijest frontend developera)

- **Papirnati formular check-in** (`POST /api/admin/checkin/paper-scan`) — endpoint postoji i prima upload, ali OCR obrada papirnatog formulara (OpenCV predobrada slike) nije implementirana. Namjerno odgođeno, najrizičniji dio projekta.
- **Swagger/OpenAPI** je dostupan na `/swagger-ui.html` u dev profilu (isključen u `prod` profilu).
