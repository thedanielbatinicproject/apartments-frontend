# Auth i Intranet Setup - Walkthrough

Ovaj dokument opisuje sve što je napravljeno tijekom postavljanja autentikacijskog sustava i infrastrukture za zaštićeni `intranet` dio aplikacije.

## 1. Environment Varijable (.env)
- Kreiran je `.env.example` koji sadrži opise potrebnih varijabli.
- Lokalno smo stvorili `.env.local` datoteku s postavljenim `NEXT_PUBLIC_API_URL=http://localhost:8080` (ovdje trebaš zalijepiti Google Client ID za OAuth).

## 2. API Klijent i Autentikacija
- **`lib/api/client.ts`**: Napravljen napredni `api` wrapper (oko standardnog `fetch`). On automatski parsira backendove `ApiResponse<T>` odgovore. U slučaju `401 Unauthorized`, automatski poziva refresh endpoint i ako on uspije, re-fetch-a originalni propali API poziv.
- **`lib/api/auth.ts`**: Implementirane i tipizirane sve metode s API dokumentacije (`login`, `loginWithGoogle`, `forgotPassword`, `resetPassword`, `acceptInvite`, `getMe`).
- **`lib/auth/token-storage.ts`**: Access token se sigurno čuva u memoriji (`sessionStorage`), a `refreshToken` preživljava refresh stranice (`localStorage`).
- Postavljen je signal-cookie `apsi_auth` samo zato da bi `middleware.ts` na edge okruženju mogao presresti posjetitelje bez ijednog tokena.

## 3. Globalni Auth Context
- U `<AuthProvider>` (u `lib/auth/auth-context.tsx`) imamo globalni state: `user` i `isLoading`.
- Čim se aplikacija upali, ako imamo refresh token, Context prvo pokuša u pozadini osvježiti sesiju i dohvatiti `/api/admin/users/me`. Sve dok to traje prikazuje se loading ekran na `/intranet`.
- `<GoogleOAuthProvider>` omata cijelu app aplikaciju preko glavnog `layout.tsx`.

## 4. Middleware Route Protection
- Kreiran je `middleware.ts` u `src/`. On se pokreće _prije_ ikakvog renderiranja stranica na `/intranet/**` stazama.
- Ako nema auth signala, proslijeđuje na `/intranet/login` uz dodavanje `callbackUrl` query parametra kako bi se korisnik, nakon prijave, automatski vratio na stranicu na koju je pokušao ući (npr. `/intranet/solar`).

## 5. UI Komponente
- **Layouts**: Kreiran `IntranetShell`, `IntranetHeader` i dinamični `IntranetSidebar` s linkovima iz tvog `AGENTS.md` priručnika (Dashboard, Solar, Recenzije, Računi...).
- **Login Stranica (`/intranet/login`)**: Potpuno responsivan dizajn. Podijeljena na "Email/Lozinka" formu, s fallback opcijom "Zaboravljena Lozinka" koja dijeli isti page, te gumbom za Google prijavu koji okida OAuth Popup flow.
- **Aktivacija računa (`/intranet/invite/accept`)**: Forma za postavljanje inicijalne lozinke admina (backend ruta vraća usputno i `accessToken`/`refreshToken` tako da ne mora odmah nakon toga ići na čisti Login ekran, nego odmah na Dashboard).
- **Reset lozinke (`/intranet/reset-password`)**: Čita token iz url-a, i radi provjeru uparivanja lozinki.
- **Dashboard Placeholder (`/intranet/dashboard`)**: Čista, mala nadzorna ploča koja pozdravlja korisnika njegovom titulom (Admin / Super Admin).

## Kako Testirati Ovo?
Otvori terminal i pokreni aplikaciju:
```bash
npm run dev
```

Pokušaj otvoriti `http://localhost:3000/intranet/dashboard` — middleware će te momentalno izbaciti na `/intranet/login`. Ako tamo stisneš login, a imaš upaljen backend i validne podatke, nakon logina će te preusmjeriti natrag!

> [!WARNING]
> Zasad, sve dok ne iskopiraš pravi Google Client ID iz GCP-a u tvoju lokalnu `.env.local` datoteku, Google gumb će javljati grešku, ali je potpuno operabilan čim dobije valjani Client ID!
