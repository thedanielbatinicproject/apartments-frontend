# Zahtjevi prema backendu — Pojednostavljenje računa

Frontend je prerađen na **jednokoračni tok** izdavanja dokumenata. Ovaj dokument opisuje što backend mora promijeniti da to podrži.

Frontend je već napisan po novom ponašanju i gađa postojeće rute — dijelovi koji traže izmjenu trenutno vraćaju greške dok se ne naprave.

---

## Kontekst — zašto mijenjamo

Obrt posluje na **paušalnom oporezivanju** i nije u sustavu PDV-a. Dokumente izdaju vlasnici s mobitela, često pred gostom pri odjavi. Postojeći tok `DRAFT → issue → ISSUED (zaključano)` traži previše koraka i zaključava dokument u trenutku kad je najveća vjerojatnost da će trebati ispravak (krivo upisano ime, broj noćenja).

Traženo ponašanje: **spremi jednom → dokument je gotov s brojem i PDF-om → po potrebi ga uredi ili obriši.**

---

## 1. `POST /api/admin/invoices/{companyId}` — kreiranje odmah izdaje

Trenutno kreira dokument u statusu `DRAFT` bez broja, pa se traži zaseban `POST /issue`.

**Traženo:** kreiranje odmah dodjeljuje `documentNumber`, `year` i `uid` te vraća status `ISSUED`.

- Response `data`: `InvoiceResponse` sa `status: "ISSUED"` i popunjenim `documentNumber`
- `POST /{invoiceId}/issue` može ostati radi kompatibilnosti, ali frontend ga više ne zove

> Ako je potrebno zadržati mogućnost nedovršenog dokumenta, prihvatljiva je alternativa: query parametar `?issue=false` koji ostavlja `DRAFT`. Frontend ga zasad ne koristi.

---

## 2. `PUT /api/admin/invoices/{companyId}/{invoiceId}` — dopustiti izmjenu izdanog

Trenutno radi samo dok je `status = DRAFT` (`editable: true`).

**Traženo:** dopustiti izmjenu i kad je `ISSUED`.

- `documentNumber`, `year` i `uid` se pri izmjeni **ne mijenjaju** — dokument zadržava svoj broj
- `CANCELLED` ostaje nepromjenjiv (storniran dokument se ne uređuje)
- Polje `editable` neka odražava novo pravilo: `true` za `DRAFT` i `ISSUED`, `false` za `CANCELLED`

Frontend čita `editable` kao autoritet, pa je dovoljno da to polje bude točno.

---

## 3. `DELETE /api/admin/invoices/{companyId}/{invoiceId}` — brisanje s ispravkom brojača

Trenutno je (prema referenci) vjerojatno ograničeno na `DRAFT`.

**Traženo:** dopustiti brisanje i izdanog dokumenta, uz pravilo o brojaču:

| Slučaj | Ponašanje brojača |
|---|---|
| Briše se **zadnji** dokument u nizu za tu firmu/godinu/vrstu | Brojač se **smanjuje za 1** — broj se oslobađa za sljedeći dokument |
| Briše se dokument **iz sredine** niza | Brojač se **ne dira** — u nizu ostaje rupa |

- Response `data`: `null`
- `message` neka razlikuje slučajeve, npr. `"Dokument obrisan, broj oslobođen"` odnosno `"Dokument obrisan"`

Frontend te dvije poruke može prikazati korisniku.

> **Za provjeru s računovođom, ne blokira razvoj:** brisanje izdanih dokumenata i rupe u brojčanom nizu mogu biti problem ako obrt podliježe fiskalizaciji (npr. kod naplate gotovinom). Vrijedi potvrditi prije produkcije — ako se ispostavi da je sporno, alternativa je da brisanje radi samo storno, a tok ostane isti.

---

## 4. `guestRecordId` — veza s evidencijom gosta

Frontend nudi popunjavanje računa iz prijave gosta (§9). Traži se čuvanje te veze radi sljedivosti.

**`InvoiceRequest`** — dodati polje:

```
guestRecordId: Long (optional)   // id iz AdminGuestRecordResponse
```

**`InvoiceResponse`** — dodati isto polje u odgovor:

```
guestRecordId: Long | null
```

Ponašanje: samo se sprema i vraća. Ne mora postojati validacija da zapis postoji, ni kaskadno brisanje.

---

## 5. PDV — potvrda ponašanja za paušaliste

Obrt nije u sustavu PDV-a. `CompanyResponse` ima `taxRate` i `vatExemptNoteHr`/`vatExemptNoteEn`.

Molimo potvrdu:

1. Ako je `taxRate = 0`, izostavlja li PDF prikaz PDV-a u cijelosti i ispisuje `vatExemptNote`?
2. Vraća li `InvoiceResponse` igdje razrađen porezni iznos? Frontend ga trenutno ne prikazuje — prikazuje samo zbroj stavki, popust i iznos za platiti.

Ako je odgovor na oba "da / nema poreznog dijela", ništa se ne mijenja — samo da znamo da je namjerno.

---

## 6. `GET /api/admin/checkin/records` — potvrda da radi bez filtera

Frontend zove rutu **bez ijednog query parametra** da dohvati sve evidencije za odabir gosta. Referenca kaže da su svi filteri opcionalni — molimo potvrdu da poziv bez parametara ne vraća grešku i da nije prestrog limit.

Ako se očekuje velik broj zapisa, korisno bi bilo:

```
GET /api/admin/checkin/records?limit=100&sort=arrivalDate,desc
```

Frontend zasad grupira i sortira lokalno.

---

## Sažetak izmjena

```
POST   /api/admin/invoices/{companyId}              → odmah ISSUED + documentNumber
PUT    /api/admin/invoices/{companyId}/{invoiceId}  → dopustiti na ISSUED
DELETE /api/admin/invoices/{companyId}/{invoiceId}  → dopustiti na ISSUED + ispravak brojača
```

## Sažetak novih polja

```
InvoiceRequest  += guestRecordId: Long (optional)
InvoiceResponse += guestRecordId: Long | null
InvoiceResponse.editable → true za DRAFT i ISSUED, false za CANCELLED
```

## Pitanja

1. Fiskalizacija — je li brisanje izdanih dokumenata prihvatljivo za ovaj obrt?
2. PDV — potvrda da `taxRate = 0` znači da se PDV nigdje ne prikazuje.
3. `GET /api/admin/checkin/records` bez parametara — ima li limit?
