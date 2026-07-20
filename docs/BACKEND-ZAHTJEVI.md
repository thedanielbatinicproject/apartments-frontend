# Zahtjevi prema backendu

Popis svega što frontend očekuje, a backend trenutno ne isporučuje. Poredano po hitnosti. Pisano u stilu `API-REFERENCE.md` da se može izravno preslikati.

Frontend je u svim slučajevima **već spreman** — čim ruta ili polje postane dostupno, radi bez ijedne izmjene na frontendu.

---

## P1 — Blokira funkcionalnost odmah

### 1.1 Nova polja u `BookedPeriodResponse` nisu deployana

`API-REFERENCE.md` (§6) dokumentira polja koja backend u praksi **ne vraća**:

```jsonc
{
  "startDate": "2026-08-01",
  "endDate":   "2026-08-05",
  "source":    "MERGED",
  "sources":   ["AIRBNB", "BOOKING"],   // ⚠️ ne stiže
  "periodIds": [12, 47],                 // ⚠️ ne stiže
  "merged":    true,                     // ⚠️ ne stiže
  "mismatch":  false                     // ⚠️ ne stiže
}
```

Frontend je pucao na `period.periodIds.join(...)`; sada normalizira odgovor i preživljava, ali:

| Posljedica | Dok polja nedostaju |
|---|---|
| Prikaz izvora | Spojeni termin pokazuje samo jedan izvor umjesto oba |
| Upozorenje na dvostruki booking | `mismatch` se ne može detektirati — trokut se nikad ne prikaže |
| **Brisanje termina** | **Potpuno nedostupno** — bez `periodIds` nema što poslati u DELETE |

Molimo potvrdu je li riječ o tome da izmjena nije deployana, ili je dokumentacija otišla ispred implementacije.

### 1.2 Postoji li `DELETE /api/admin/calendar/periods/{periodId}`?

Dokumentirana u §6, ali nije testirana s frontenda jer se bez `periodIds` ne može pozvati. Molimo potvrdu da je ruta živa i da vraća opisane poruke:

- `"Period obrisan"`
- `"Period obrisan, ali dolazi iz iCal feeda pa će se vratiti pri sljedećoj sinkronizaciji"`

Frontend te dvije poruke razlikuje i korisniku unaprijed objašnjava koji je slučaj.

### 1.3 `GET /api/admin/companies` vraća `500`

Uočeno tijekom testiranja. Blokira **kreiranje apartmana** (traži `companyId`) i **cijelu sekciju računa** (sve rute idu preko `/{companyId}/`). Ako je u međuvremenu popravljeno, zanemarite.

---

## P2 — Nedostaju rute

### 2.1 `DELETE /api/admin/users/{id}` — SUPERADMIN

Trajno briše admin račun. Trenutno postoji samo `disable`, pa se pogrešno unesena adresa ili bivši zaposlenik ne mogu ukloniti (GDPR).

- **Autorizacija:** `Bearer <accessToken>`, rola **SUPERADMIN**
- **Path:** `id` (Long) · **Body:** nema
- **Response `data`:** `null`, `message`: `"Korisnik obrisan"`

| Slučaj | Očekivano |
|---|---|
| `id` je pozivatelj | `409` — `"Ne možete obrisati vlastiti račun"` |
| `id` je zadnji aktivni SUPERADMIN | `409` — `"Sustav mora imati barem jednog aktivnog Super Admina"` |
| Ne postoji | `404` · Nije SUPERADMIN | `403` |

### 2.2 `PATCH /api/admin/users/{id}/role` — SUPERADMIN

Rola se sada fiksira pri slanju pozivnice i **poslije se ne može promijeniti**.

- **Body** (`ChangeRoleRequest`): `{ "role": "ADMIN"|"SUPERADMIN" (required) }`
- **Response `data`:** `AdminUserResponse` (ili `null` + `message`)

| Slučaj | Očekivano |
|---|---|
| `id` je pozivatelj | `409` — `"Ne možete mijenjati vlastitu rolu"` |
| Degradiranje zadnjeg aktivnog SUPERADMINA | `409` |
| Neispravna rola | `400` |

### 2.3 Isti guardovi na postojeći `disable`

`PATCH /api/admin/users/{id}/disable` nema zaštitu od onemogućavanja sebe ni zadnjeg SUPERADMINA. Frontend to blokira, ali tko god pogodi endpoint može zaključati cijeli sustav.

---

## P3 — Produkcijski rizik

### 3.1 Link u emailu ima hardkodiran `localhost:3000`

Pozivnica stiže kao:

```
http://localhost:3000/accept-invite?token=qnHNGBr6D7...
```

Čim aplikacija ode na pravu domenu, **svaka pozivnica vodit će primatelja na njegov vlastiti localhost** i nitko se neće moći registrirati. Host mora doći iz konfiguracije, po uzoru na postojeći `app.cors.allowed-origins`:

```properties
app.frontend.base-url=http://localhost:3000        # dev
app.frontend.base-url=https://apartmani-sibenik.hr # prod
```

### 3.2 Putanje u emailovima ne odgovaraju frontendu

| | Backend šalje | Frontend ima |
|---|---|---|
| Pozivnica | `/accept-invite` | `/intranet/invite/accept` |
| Reset lozinke | `/reset-password` (pretpostavka) | `/intranet/reset-password` |

Rezultat je bio **404 i neupotrebljiva pozivnica**. Frontend je dodao preusmjeravanja pa **nije hitno** — i ostaju trajno, jer već poslani mailovi nose staru putanju. Za nove mailove je čišće slati kanonsku putanju:

```
{app.frontend.base-url}/intranet/invite/accept?token={token}
{app.frontend.base-url}/intranet/reset-password?token={token}
```

### 3.3 CORS ne izlaže `Content-Disposition` za PDF

Nije očito, ali je stvarno: PDF računa se ne može otvoriti običnim linkom (ruta traži JWT), pa ga frontend dohvaća `fetch`-om i čita naziv datoteke iz `Content-Disposition`.

Browser **ne dopušta JavaScriptu čitanje tog headera cross-origin** osim ako ga backend eksplicitno ne izloži. Kako frontend radi na `:3000`, a backend na `:8080`, to je cross-origin i header je trenutno nevidljiv.

```java
configuration.setExposedHeaders(List.of("Content-Disposition"));
```

Bez toga PDF-ovi se **i dalje preuzimaju**, ali s generičkim imenom (`dokument-12.pdf`) umjesto pravog broja računa.

---

## P4 — Manje, ali korisno

### 4.1 `GET /api/admin/apartments/{id}`

Postoji admin lista, ali ne i dohvat jednog apartmana s admin poljima. Detalj apartmana zato **dohvaća cijelu listu i filtrira po ID-u**. S tri apartmana je bezopasno; ako ih naraste, vrijedi dodati.

---

## Pitanja koja ne traže kod, samo odgovor

1. **Reset lozinke — naziv query parametra?** Frontend čita `?token=`. Ako šaljete `?resetToken=`, stranica ga neće pročitati i prikazat će „Nevažeći link".
2. **Brisanje admina — soft ili hard delete?** Ako je admin izdavao račune, preporuka je soft delete (`deletedAt`) da se ne razbije revizijski trag. Frontendu je svejedno — bitno je samo da nestane iz `GET /api/admin/users`.
3. **Promjena role — što s postojećim tokenom?** Access token tog korisnika i dalje nosi staru rolu dok ne istekne. Poništavate li mu refresh tokene (prisilna odjava) ili se čeka istek?
4. **`DELETE /api/admin/invoices/{companyId}/{invoiceId}` — samo `DRAFT`?** Referenca kaže „vjerojatno". Frontend nudi brisanje isključivo za `DRAFT`; molimo potvrdu da je to i backend pravilo.
5. **PDV na računu.** `InvoiceRequest` nema poreznu stopu, a `taxRate` živi na firmi. Vraća li `InvoiceResponse` razrađen porezni dio, ili se PDV pojavljuje samo u PDF-u? Trenutno se u pregledu iznosa prikazuju samo osnovica, popust i ukupno.
6. **Konverzija iz `CANCELLED`.** Je li dopuštena? Frontend trenutno nudi konverziju u svim stanjima.
7. **QR kod na PDF-u.** Koji URL kodira? Javna stranica za provjeru planira se na `/check-invoice`, a ruta je `GET /api/invoices/verify?uid=`.

---

## Riješeno — za evidenciju

| Stavka | Status |
|---|---|
| `companyId` u `ApartmentResponse` | ✅ dodano |
| `GET /api/admin/apartments` (svi, uklj. skrivene) | ✅ dodano |

---

## Sažetak — rute koje treba dodati

```
DELETE /api/admin/users/{id}          SUPERADMIN
PATCH  /api/admin/users/{id}/role     SUPERADMIN   body: { role: "ADMIN"|"SUPERADMIN" }
GET    /api/admin/apartments/{id}     ADMIN/SUPERADMIN   (nice-to-have)
```

## Sažetak — konfiguracija

```properties
app.frontend.base-url=...                    # umjesto hardkodiranog localhost:3000
# CORS: exposedHeaders += Content-Disposition
```

## Sažetak — deploy

```
Polja sources / periodIds / merged / mismatch u BookedPeriodResponse
DELETE /api/admin/calendar/periods/{periodId}
Popravak 500 na GET /api/admin/companies
```
