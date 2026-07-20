// ============================================================
// Zajednički tipovi koji odgovaraju backend ApiResponse<T> omotaču
// i svim shared DTO-ovima koji se koriste u više API modula.
// ============================================================

// --- Backend omotač odgovora ---
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
  timestamp: string;
}

// --- Auth ---
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AdminUserResponse {
  id: number;
  email: string;
  fullName: string;
  role: "ADMIN" | "SUPERADMIN";
  authProvider: "LOCAL" | "GOOGLE";
  enabled: boolean;
  solarReportSubscribed: boolean;
}

// ============================================================
// ADMIN KORISNICI I POZIVNICE — §2 i §3
// ============================================================

export type AdminRole = "ADMIN" | "SUPERADMIN";

export interface AdminInviteResponse {
  id: number;
  email: string;
  role: AdminRole;
  /** Je li pozivnica već iskorištena (račun aktiviran) */
  used: boolean;
  expired: boolean;
  /** ISO-8601 UTC */
  expiryDate: string;
}

export interface InviteRequest {
  email: string;
  role: AdminRole;
}

// ============================================================
// APARTMANI — §4 i §5 API reference
// ============================================================

export interface ApartmentImageResponse {
  id: number;
  url: string;
  sortOrder: number;
  /** Backend šalje polje `cover` (ne `isCover`) */
  cover: boolean;
}

export interface ApartmentResponse {
  id: number;
  internalCode: string;
  roomCount: number | null;
  capacity: number | null;
  latitude: number | null;
  longitude: number | null;
  amenities: string[];
  active: boolean;
  sortOrder: number | null;
  /**
   * ADMIN POLJA — popunjena su SAMO na /api/admin/** rutama.
   * Na javnim rutama (/api/apartments) backend ih vraća kao null
   * (includeAdminFields=false).
   *
   * Zato forma za uređivanje MORA čitati s admin rute — inače bi
   * spremanje poslalo null i obrisalo postojeće vrijednosti.
   */
  companyId: number | null;
  airbnbIcalUrl: string | null;
  bookingIcalUrl: string | null;
  /** Razriješeno za traženi ?lang= */
  name: string;
  description: string;
  /** true ako traženi jezik ne postoji pa je vraćen fallback */
  translationFallbackUsed: boolean;
  /** Jezici koji stvarno postoje u bazi */
  availableLanguages: string[];
  coverImageUrl: string | null;
  images: ApartmentImageResponse[];
}

export interface ApartmentTranslationRequest {
  languageCode: string;
  name: string;
  description: string;
}

export type ApartmentTranslationResponse = ApartmentTranslationRequest;

export interface ApartmentRequest {
  internalCode: string;
  roomCount?: number | null;
  capacity?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  companyId: number;
  amenities?: string[];
  active?: boolean;
  sortOrder?: number | null;
  airbnbIcalUrl?: string | null;
  bookingIcalUrl?: string | null;
  /** Obavezno, minimalno jedan prijevod */
  translations: ApartmentTranslationRequest[];
}

// ============================================================
// KALENDAR — §6
// ============================================================

export type BookedPeriodSource = "AIRBNB" | "BOOKING" | "MANUAL";

/**
 * Zauzeti period.
 *
 * VAŽNO: backend spaja preklapajuće periode PRI ČITANJU. Ista
 * rezervacija s Airbnba, zrcaljena kao blokada na Bookingu, vraća
 * se kao JEDAN period sa `sources: ["AIRBNB", "BOOKING"]`.
 *
 * Posljedica za frontend: spojeni period nema vlastiti ID —
 * briše se po pojedinačnim zapisima iz `periodIds`.
 */
export interface BookedPeriodResponse {
  /** "YYYY-MM-DD" */
  startDate: string;
  /** Checkout, EKSKLUZIVAN — checkout i checkin istog dana nisu preklapanje */
  endDate: string;
  /**
   * Zadržano radi kompatibilnosti: naziv izvora za nespojeni
   * period, "MERGED" za spojeni. Za prikaz koristiti `sources`.
   */
  source: BookedPeriodSource | "MERGED" | string;
  /** Svi izvori koji su doprinijeli periodu. Uvijek popunjeno. */
  sources: string[];
  /** ID-evi pojedinačnih zapisa — za DELETE /admin/calendar/periods/{id} */
  periodIds: number[];
  /** Je li period nastao spajanjem više zapisa */
  merged: boolean;
  /**
   * true SAMO ako spojeni zapisi nisu imali identične datume —
   * potencijalni dvostruki booking. Identični datumi iz dva izvora
   * su normalno zrcaljenje i daju false.
   */
  mismatch: boolean;
}

export interface SyncStatusResponse {
  apartmentId: number;
  apartmentInternalCode: string;
  source: string;
  /** ISO-8601 UTC */
  lastSyncAt: string | null;
  lastSyncSuccess: boolean;
  lastErrorMessage: string | null;
  importedCount: number | null;
}

// ============================================================
// RECENZIJE — §12 i §13
// ============================================================

export type ReviewSource = "AIRBNB" | "BOOKING" | "GOOGLE" | "OTHER";

export interface AdminReviewResponse {
  id: number;
  apartmentId: number;
  apartmentInternalCode: string;
  authorName: string;
  rating: number;
  text: string | null;
  languageCode: string | null;
  source: ReviewSource | string;
  reviewDate: string | null;
  upvoteCount: number;
  visible: boolean;
  sortOrder: number | null;
}

/** POST/PUT /api/admin/reviews — isti oblik za kreiranje i ispravak */
export interface ReviewRequest {
  apartmentId: number;
  authorName: string;
  rating: number;
  text?: string | null;
  languageCode?: string | null;
  source?: ReviewSource | string | null;
  reviewDate?: string | null;
  visible?: boolean;
  sortOrder?: number | null;
}

// ============================================================
// FIRME — §10 (potrebno jer ApartmentRequest traži companyId)
// ============================================================

/**
 * Podaci firme.
 *
 * VAŽNO: ova se polja SNIMAJU u svaki dokument u trenutku
 * izdavanja (landlord* polja u InvoiceResponse). Kasnija izmjena
 * ovdje ne mijenja već izdane dokumente — to je namjerno, da
 * stari računi ostanu vjerni originalu.
 */
export interface CompanyResponse {
  id: number;
  brandName: string;
  ownerName: string | null;
  oib: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  bankName: string | null;
  iban: string | null;
  swift: string | null;
  logoUrl: string | null;
  currency: string | null;
  /** Porezna stopa; 0 za paušaliste izvan sustava PDV-a */
  taxRate: number | null;
  /** Napomena o oslobođenju od PDV-a — ispisuje se na dokumentu */
  vatExemptNoteHr: string | null;
  vatExemptNoteEn: string | null;
  /** Napomena o boravišnoj pristojbi */
  touristTaxNoteHr: string | null;
  touristTaxNoteEn: string | null;
  /** Tko potpisuje dokument */
  signatoryName: string | null;
  /** Katalozi dolaze i u punom odgovoru firme */
  unitDescriptionCatalog?: string[];
  serviceTypeCatalog?: string[];
  paymentMethodCatalog?: string[];
}

/** Tijelo za PUT /api/admin/companies/{id} */
export interface CompanyUpdateRequest {
  brandName: string;
  ownerName?: string | null;
  oib?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  bankName?: string | null;
  iban?: string | null;
  swift?: string | null;
  currency?: string | null;
  taxRate?: number | null;
  vatExemptNoteHr?: string | null;
  vatExemptNoteEn?: string | null;
  touristTaxNoteHr?: string | null;
  touristTaxNoteEn?: string | null;
  signatoryName?: string | null;
}

// ============================================================
// RAČUNI / PREDRAČUNI / PONUDE — §11
//
// Životni ciklus dokumenta:
//   DRAFT ──issue──> ISSUED ──cancel──> CANCELLED
//
// U DRAFT-u se smije uređivati i brisati. `issue` dodjeljuje
// konačni documentNumber i uid, nakon čega dokument postaje
// nepromjenjiv — može se samo stornirati.
//
// Polje `editable` je autoritativan signal iz backenda smije li
// se prikazati forma za uređivanje. Ne zaključivati iz statusa.
// ============================================================

export type InvoiceDocumentType = "INVOICE" | "PROFORMA" | "QUOTE";
export type InvoiceStatus = "DRAFT" | "ISSUED" | "CANCELLED";

/** Redak stavke pri slanju na backend */
export interface InvoiceItemRequest {
  unitDescription?: string | null;
  roomNumber?: number | null;
  serviceType?: string | null;
  quantity: number;
  unitPrice: number;
}

/** Redak stavke kako ga vraća backend (s izračunatim lineTotal) */
export interface InvoiceItemResponse {
  id: number;
  unitDescription: string | null;
  roomNumber: number | null;
  serviceType: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  sortOrder: number;
}

export interface InvoiceRequest {
  documentType: InvoiceDocumentType;
  /** Veza s apartmanom radi automatskog popunjavanja */
  apartmentId?: number | null;
  /**
   * Evidencija gosta (§9) iz koje su popunjeni podaci.
   * Čuva se radi sljedivosti — s kojeg je boravka račun nastao.
   */
  guestRecordId?: number | null;
  /** "YYYY-MM-DD"; ako izostane backend stavlja danas */
  invoiceDate?: string | null;
  recipientName: string;
  recipientAddress?: string | null;
  recipientOib?: string | null;
  recipientCountry?: string | null;
  guestCount?: number | null;
  childrenCount?: number | null;
  checkinDate?: string | null;
  checkoutDate?: string | null;
  /** Obavezno, minimalno jedna stavka */
  items: InvoiceItemRequest[];
  discountAmount?: number | null;
  paymentMethod?: string | null;
  customNotes?: string | null;
}

/** Sažetak za listu dokumenata */
export interface InvoiceSummaryResponse {
  id: number;
  documentType: InvoiceDocumentType;
  status: InvoiceStatus;
  /** null dok je DRAFT — broj se dodjeljuje tek pri izdavanju */
  documentNumber: string | null;
  invoiceDate: string;
  recipientName: string;
  totalDue: number;
  currency: string;
}

export interface InvoiceResponse {
  id: number;
  companyId: number;
  documentType: InvoiceDocumentType;
  status: InvoiceStatus;
  documentNumber: string | null;
  year: number | null;
  /** Jedinstvena oznaka za javnu provjeru (QR na PDF-u) */
  uid: string | null;
  invoiceDate: string;

  apartmentId: number | null;
  apartmentInternalCode: string | null;
  /** Evidencija gosta iz koje je dokument popunjen (§9) */
  guestRecordId: number | null;
  /** Ako je dokument nastao konverzijom, ID izvornika */
  convertedFromId: number | null;

  // --- Snimka podataka firme u trenutku izdavanja ---
  // Namjerno se NE mijenja ako firma kasnije promijeni podatke,
  // da stari računi ostanu vjerni originalu.
  landlordBrandName: string | null;
  landlordOwnerName: string | null;
  landlordOib: string | null;
  landlordAddress: string | null;
  landlordCity: string | null;
  landlordPostalCode: string | null;
  landlordCountry: string | null;
  landlordPhone: string | null;
  landlordEmail: string | null;
  landlordBankName: string | null;
  landlordIban: string | null;
  landlordSwift: string | null;
  landlordSignatory: string | null;

  recipientName: string;
  recipientAddress: string | null;
  recipientOib: string | null;
  recipientCountry: string | null;
  guestCount: number | null;
  childrenCount: number | null;
  checkinDate: string | null;
  checkoutDate: string | null;

  items: InvoiceItemResponse[];
  netAmount: number;
  discountAmount: number | null;
  totalDue: number;
  currency: string;
  paymentMethod: string | null;
  customNotes: string | null;

  /** true samo dok je status DRAFT */
  editable: boolean;
}

// ============================================================
// EVIDENCIJA GOSTIJU — §9
//
// VAŽNO: jedan zapis = JEDAN GOST, ne boravak. Obitelj od
// četvero daje četiri zapisa s istim apartmanom i datumima.
// Zato se broj osoba ne čita iz zapisa nego se prebrojava.
// ============================================================

export type GuestStayStatus =
  | "PENDING"
  | "PROCESSING"
  | "VERIFIED"
  | "FAILED"
  | "MANUAL_REVIEW"
  | "EXPIRED";

export type SubmissionMethod =
  | "OCR_SELF"
  | "MANUAL_FORM"
  | "ADMIN_PAPER_SCAN";

export type GuestDocumentType = "ID_CARD" | "PASSPORT" | "DRIVING_LICENCE";

export interface AdminGuestRecordResponse {
  id: number;
  apartmentId: number;
  apartmentInternalCode: string | null;
  fullName: string;
  /** "YYYY-MM-DD" — koristi se za razlikovanje djece od odraslih */
  dateOfBirth: string | null;
  placeOfBirth: string | null;
  /** Mjesto prebivališta — najbliže adresi koju imamo za račun */
  placeOfResidence: string | null;
  documentType: GuestDocumentType | string | null;
  documentNumber: string | null;
  nationality: string | null;
  sex: string | null;
  documentExpiryDate: string | null;
  arrivalDate: string | null;
  departureDate: string | null;
  status: GuestStayStatus;
  submissionMethod: SubmissionMethod | string | null;
  ocrConfidenceScore: number | null;
  unreliableExtraction: boolean;
  needsManualReview: boolean;
  reviewedAt: string | null;
  /**
   * Slike dokumenata / skeniranog obrasca.
   * URL-ovi su na /api/admin/files/** — GDPR zaštićeno, traže JWT
   * header, pa običan <img src> NE radi. Vidi lib/protected-image.
   */
  documentImageUrls: string[];
  /**
   * Postavljeno kad je admin pozvao DELETE (GDPR purge) — vidi §9.
   * DELETE ne briše red, samo trajno ukloni osjetljive podatke i
   * slike. Zapis s ovim poljem postavljenim se više ne smije
   * otvarati ni uređivati (documentNumber/documentExpiryDate su
   * nepovratno prazni, PUT na njih vraća 409).
   */
  personalDataPurgedAt: string | null;
  /**
   * ⚠️ NOVO POLJE — čeka backend (vidi BACKEND-ZAHTJEVI-CHECKIN.md).
   * Izvorno OCR čitanje po polju, prije admin ispravaka. Prikazuje
   * se sivo ispod polja da se vidi što je stroj pročitao.
   */
  originalExtraction?: Partial<
    Record<
      | "fullName"
      | "dateOfBirth"
      | "placeOfBirth"
      | "placeOfResidence"
      | "documentType"
      | "documentNumber"
      | "nationality"
      | "sex"
      | "documentExpiryDate",
      string | null
    >
  > | null;
}

/**
 * PUT /api/admin/checkin/records/{id} — sva polja opcionalna,
 * šalju se samo ona koja se mijenjaju.
 *
 * arrivalDate/departureDate ⚠️ čekaju backend (danas ih ruta ne prima).
 */
export interface AdminCorrectionRequest {
  fullName?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  placeOfResidence?: string;
  documentType?: string;
  documentNumber?: string;
  nationality?: string;
  sex?: string;
  documentExpiryDate?: string;
  arrivalDate?: string;
  departureDate?: string;
}

/** §11 javna ruta — provjera autentičnosti preko QR/UID */
export interface InvoiceVerificationResponse {
  valid: boolean;
  documentNumber: string | null;
  invoiceDate: string | null;
  landlordBrandName: string | null;
  recipientName: string | null;
  totalDue: number | null;
  currency: string | null;
  status: InvoiceStatus | null;
}

/** §10 — liste za autocomplete pri unosu stavki računa */
export interface CompanyCatalogs {
  unitDescriptionCatalog: string[];
  serviceTypeCatalog: string[];
  paymentMethodCatalog: string[];
}

// ============================================================
// §14 — Solar (ESP32 baterijski/solarni sustav)
//
// Frontend čita samo ADMIN rute (JWT). DEVICE rute (ingest,
// relay/pending, relay/ack) su ESP32 → backend i ovdje se ne
// koriste.
// ============================================================

/** GET /api/solar/latest, GET /api/solar/chart-data — jedno očitanje senzora */
export interface SolarReadingResponse {
  timestamp: string;
  batteryVoltage: number | null;
  batteryCurrent: number | null;
  batteryPower: number | null;
  batterySoc: number | null;
  batteryTemperature: number | null;
  pvVoltage: number | null;
  pvCurrent: number | null;
  pvPower: number | null;
  loadVoltage: number | null;
  loadCurrent: number | null;
  loadPower: number | null;
  yieldToday: number | null;
  consumptionToday: number | null;
  controllerStatus: number | null;
  extra: Record<string, unknown> | null;
}

/** GET /api/solar/chart-data?range= */
export type SolarChartRange = "24h" | "7d" | "30d";

/** GET /api/solar/variables — metapodaci za dinamičke labele/jedinice */
export interface SolarVariableResponse {
  key: string;
  labelHr: string;
  labelEn: string;
  unit: string;
  group: string;
}

export type SolarPeriodType = "WEEKLY" | "MONTHLY";

export type RelayAction = "ON" | "OFF" | "TOGGLE";
export type RelayCommandStatus = "SENT" | "ACKED" | "FAILED" | "TIMEOUT";

/**
 * GET /api/solar/relay/status, POST /api/solar/relay/{id}/toggle —
 * i payload broadcastan preko WebSocketa na /topic/solar-relay.
 */
export interface RelayStatusResponse {
  relayId: number;
  /** null = nikad potvrđeno (nepoznato stanje) */
  currentState: boolean | null;
  lastCommandStatus: RelayCommandStatus | null;
  lastCommandAt: string | null;
  lastAckAt: string | null;
  /** true = komanda čeka da je ESP32 povuče i potvrdi */
  pendingCommand: boolean;
}

/** GET /api/solar/reports/weekly, GET /api/solar/reports/monthly */
export interface SolarAggregateResponse {
  periodType: SolarPeriodType;
  periodStart: string;
  periodEnd: string;
  totalYieldKwh: number | null;
  totalConsumptionKwh: number | null;
  avgBatteryVoltage: number | null;
  minBatteryVoltage: number | null;
  maxBatteryVoltage: number | null;
  minBatterySoc: number | null;
  peakPvPower: number | null;
  avgPvPower: number | null;
  readingCount: number;
}

// --- Greške ---
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: ApiResponse<null>
  ) {
    super(message);
    this.name = "ApiError";
  }
}
