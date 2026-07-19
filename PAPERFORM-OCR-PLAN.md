# Papirnati formular — OCR/OMR implementacijski plan

Cilj: implementirati `PaperFormGridReader` (trenutno skeleton) i `CircleFillDetector` (trenutno skeleton) tako da čitaju stvarno dizajnirani papirnati formular (6 kalibracijskih kvadrata, dva gosta po listu, HR-1/EN-1 identifikator forme).

**Vodilja:** ne diram postojeći model podataka (`GuestStayRecord`, enumi) osim gdje je stvarno neizbježno. Ispod je točno navedeno gdje je promjena neizbježna i zašto — sve ostalo (koji su znakovi nečitljivi, je li blok prazan) živi samo unutar odgovora API poziva, ne u bazi.

---

## 1. Kalibracija / poravnanje (homografija)

- Iz slike se detektira 6 potpuno crnih kvadrata (`findContours` + filter po veličini/omjeru stranica/"crnoći" ispune — identično kao filter za OMR kružiće, samo na kandidatima za kvadrat).
- Centri tih 6 kvadrata → `Imgproc.findHomography` (RANSAC) mapira ih na poznate referentne koordinate iz **template-a** (poznate x,y pozicije kvadrata na originalnom, neispunjenom PDF-u). `warpPerspective` cijelu sliku poravna u "kanonski" pravokutnik.
- 6 umjesto 4 točke: redundancija — ako je papir uvijen/nagnut, RANSAC odbaci outliere i homografija ostaje stabilna. Ako manje od 4 kvadrata bude pouzdano detektirano → cijeli scan odbijamo s jasnom porukom ("slika nije čitljiva, ponovi fotografiranje") umjesto da nagađamo — admin dobije grešku i može ponovno slikati.
- Nakon warpa, sve ostalo (polja, checkboxovi, identifikacijski kod) su na **fiksnim relativnim koordinatama** (isti raspored za sve jezike i sva 3 apartmana — mijenja se samo tekst naslova i sam identifikacijski kod). Znači: **jedan** set koordinata (`FieldTemplate`) pokriva sve varijante formulara.

## 2. Identifikacijski kod (npr. "HR-1", "UKR-3")

- Mala tekstualna zona odmah desno od prvog (gornji-lijevi) kalibracijskog kvadrata.
- Tesseract u line-modu (ne single-char) nad tom zonom, regex `^[A-ZČĆŽŠĐ]+-(\d+)$` izvuče broj apartmana (jezični dio koda se ignorira — nije nam funkcionalno bitan, isti layout je za sve jezike).
- Broj → `apartmentId` (1 = apartman s vrtom, 2 = studio, 3 = soba — treba potvrdu da je to fiksno mapiranje ili da postoji negdje konfiguracija te veze; pretpostavljam fiksno 1/2/3 = ID iz baze dok se ne kaže drugačije).
- Ako se kod ne uspije pročitati/parsirati → `apartmentId` ostaje `null` na kreiranom zapisu, endpoint u odgovoru vrati `identifierReadable: false`, admin ga ručno postavi (vidi §5).

## 3. Dva gosta po listu

- Formular ima dva strukturno identična bloka (gornji/donji) unutar poravnate slike — svaki na svojoj poznatoj y-poziciji u `FieldTemplate`.
- Za svaki blok: pročitaj sva polja → ako je **svako** polje bloka prazno (0 popunjenih ćelija) → blok se **preskače**, ne stvara se `GuestStayRecord` za njega. Nema potrebe za DB enumom za "prazan blok" — to je tranzijentna informacija koja postoji samo u odgovoru tog poziva (`blocksFilled: 0..2`).
- Ako je blok popunjen (bilo koje polje neprazno) → stvara se jedan `GuestStayRecord` po bloku, kao i danas za jedan zapis.

## 4. Čitanje polja (ćelija)

- Svako tekstualno polje (Ime, Prezime, Mjesto rođenja, Mjesto prebivanja, broj dokumenta, dijelovi datuma) je niz kvadratića → izrezuj svaku ćeliju po `FieldTemplate` koordinatama, prag (Otsu binarizacija) da se utvrdi je li ćelija prazna (omjer crnih piksela < prag → prazno).
- Za neprazne ćelije: Tesseract `--psm 10` (single character) s `char_whitelist` po tipu polja:
  - Ime/Prezime/Mjesto rođenja/Mjesto prebivanja → slova (uklj. dijakritike) + zarez (samo za mjesto rođenja/prebivanja, prema uputi na formularu) — velika tiskana, mala tiskana i pisana slova sva idu u isti whitelist, Tesseract ne razlikuje "stil" nego pokušava prepoznati znak.
  - Datum rođenja → znamenke.
  - Broj dokumenta → znamenke + slova (OIB/putovnice mogu imati slova).
- Svaka ćelija dobiva Tesseract confidence. Ako **bilo koja** ćelija u polju padne ispod praga (npr. 60, treba kalibrirati na stvarnim uzorcima) → cijelo polje se označi kao nečitljivo (polje-razina granularnost, ne znak-razina — po tvom odgovoru). Vrijednost polja se svejedno sprema (best-effort spoj prepoznatih znakova), ali:
  - `needsManualReview = true` na zapisu (ionako je to default za `ADMIN_PAPER_SCAN`, ne mijenja se ponašanje).
  - naziv tog polja ide u listu `unreadableFields` u **odgovoru** tog poziva (ne u bazi) — frontend to koristi da vizualno označi točno koje inpute admin treba provjeriti nakon što otvori sliku dokumenta.

**Napomena o pisanim (cursive) slovima:** Tesseractov standardni model je osjetno slabiji na pisana slova nego na tiskana — to je poznato ograničenje, ne nešto što se da riješiti čistim podešavanjem praga. Budući da je ručna provjera ionako obavezna za sve paper-scan zapise, ovo je prihvatljivo za v1 (lošija auto-točnost na pisanim poljima jednostavno znači da će više polja biti markirano kao nečitljivo, što je i dalje ispravno ponašanje — sustav ne smije "izmišljati" znak u koji nije siguran).

## 5. Checkbox (tip dokumenta)

- Fizički formular ima **kvadratiće** (☐), ne kružiće kako je skeleton pretpostavljao — algoritam za mjerenje ispune (omjer crnih piksela unutar ROI-a) radi identično za oba oblika, pa `CircleFillDetector` ostaje funkcionalno ispravan bez promjene potpisa, samo ću mu proširiti komentar/naziv da jasno pokriva i kvadratiće (da ne zbunjuje kasnije).
- 3 kvadratića (putovnica/vozačka/osobna) → izračunaj fill-ratio za sva 3, uzmi max iznad praga; ako je dvosmisleno (dva slično ispunjena, ili nijedan iznad praga) → `documentType = null` + polje ide u `unreadableFields`.

## 6. Nužne (minimalne, aditivne) promjene API-ja — bez diranja entiteta

Ovo su jedine promjene izvan `paperform` paketa, i sve su ili (a) samo promjena povratnog tipa postojećeg endpointa, ili (b) jedno novo opcionalno polje u postojećem DTO-u:

1. **`POST /api/admin/checkin/paper-scan` mijenja povratni tip** iz jednog `AdminGuestRecordResponse` u novi `PaperScanResponse`:
   ```
   records: AdminGuestRecordResponse[]     // 0-2 zapisa, samo za popunjene blokove
   blocksDetected: 2
   blocksFilled: int
   detectedFormIdentifier: string | null   // sirovi pročitani kod, npr. "HR-1"
   detectedApartmentId: Long | null
   identifierReadable: boolean
   ```
   Ovo je neizbježno jer jedan scan sada može proizvesti 0, 1 ili 2 zapisa — postojeći tip vraća točno jedan.

2. **`apartmentId` query param na `paper-scan` postaje opcionalan** (fallback/override ako auto-detekcija koda ne uspije ili je admin ipak siguran koji je apartman). Ako je poslan, koristi se izravno bez pokušaja auto-detekcije.

3. **`AdminCorrectionRequest` dobiva jedno novo opcionalno polje `apartmentId: Long`** — jedina "promjena modela", i to samo DTO-a, ne entiteta (entitet `GuestStayRecord.apartment` već postoji, samo dosad nije bio editabilan preko `correct()`). Ovo omogućuje da admin naknadno ispravi apartman preko već postojećeg `PUT /api/admin/checkin/records/{id}` ako je auto-detekcija pogriješila — bez novog endpointa.

Sve ostalo (`unreadableFields`, `blocksFilled`, itd.) je isključivo u response DTO-u tog jednog poziva, ne dira `GuestStayRecord` tablicu niti postojeće enume.

## 7. Ovisnosti

- `org.openpnp:opencv` — treba dodati u `pom.xml` (native OpenCV binding), skeleton komentar je već predvidio ovo.
- Tesseract (`tess4j`) je već u `pom.xml` i koristi ga `TesseractService` za self-service tok — dodat ću metodu za single-cell prepoznavanje (`--psm 10`) uz postojeće.

## 8. Što mi treba da mogu hardkodirati stvarne koordinate

Slike koje sam vidio u chatu su dovoljne da razumijem raspored, ali ne mogu iz njih precizno izmjeriti piksele. Treba mi:

- Original PDF/PNG export formulara u punoj rezoluciji (300dpi+), bilo koja jedna kombinacija jezik/apartman je dovoljna jer je raspored identičan za sve — iz nje izmjerim točne relativne (%) pozicije 6 kvadrata, oba bloka, svih polja i checkboxova, i to postaje `FieldTemplate` konstanta korištena za sve varijante.
- Idealno i par **stvarno fotografiranih** (ne skeniranih) popunjenih primjeraka — realni uvjeti (kut, svjetlo) su bitni za kalibraciju praga "prazna vs popunjena ćelija" i praga OCR pouzdanosti. Ako ih još nema, mogu krenuti s konzervativnim defaultima i fino podesiti kad budu dostupni.

## 9. Redoslijed implementacije

1. `FieldTemplate` klasa (konstante koordinata) — čeka stvarni template file.
2. Homografija/poravnanje (`PaperFormPreprocessor` ili slično u `paperform` paketu).
3. Identifikator (kod → apartmentId).
4. Čitanje ćelija + praznina/popunjenost.
5. Checkbox detekcija (generalizacija `CircleFillDetector`).
6. Spajanje u `PaperFormGridReader.process()`, `PaperScanResponse`, izmjena kontrolera/servisa (§6).
7. Dodavanje `apartmentId` polja u `AdminCorrectionRequest` + `correct()`.
8. Testiranje na stvarnim fotkama, podešavanje pragova.
