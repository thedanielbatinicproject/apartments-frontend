# Plan: Reorganizacija Projekta + Auth Sustav + Login Screen

## Kontekst i Opseg

Projekt se reorganizira u **dvije glavne zone**:
- `/` — javni placeholder (ostaje jednostavan)
- `/intranet` — zaštićena intranet zona (svi admini)

Na temelju API-ja, auth sustav uključuje: **email/lozinka login, Google OAuth, zaboravljena lozinka, reset lozinke, prihvat pozivnice**. Tokeni su kratkotrazan `accessToken` + dugotrajan `refreshToken` s rotacijom.

---

## Predložene Promjene

### Arhitektura Mapa (Finalna Struktura)

```
src/
├── app/
│   ├── layout.tsx                    (root layout — minimal, samo HTML shell)
│   ├── globals.css
│   │
│   ├── (public)/                     ← javna zona
│   │   ├── layout.tsx                (jednostavni placeholder layout)
│   │   └── page.tsx                  (homepage placeholder)
│   │
│   └── (intranet)/                   ← zaštićena zona (RENAME od (admin))
│       ├── layout.tsx                (AuthGuard + IntranetShell layout)
│       │
│       ├── login/
│       │   └── page.tsx              (login ekran)
│       ├── forgot-password/
│       │   └── page.tsx              (forma za slanje reset maila)
│       ├── reset-password/
│       │   └── page.tsx              (nova lozinka — čita ?token= iz URL-a)
│       ├── invite/
│       │   └── accept/
│       │       └── page.tsx          (prihvat pozivnice — čita ?token= iz URL-a)
│       │
│       └── dashboard/
│           └── page.tsx              (placeholder dashboard)
│
├── components/
│   ├── ui/                           (shadcn komponente — NE DIRATI)
│   │
│   ├── intranet/                     ← intranet komponente
│   │   ├── layout/
│   │   │   ├── IntranetSidebar.tsx
│   │   │   ├── IntranetHeader.tsx
│   │   │   └── IntranetShell.tsx     (sidebar + header wrapper)
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       ├── ForgotPasswordForm.tsx
│   │       ├── ResetPasswordForm.tsx
│   │       └── AcceptInviteForm.tsx
│   │
│   └── public/                       ← javne komponente (za kasniji razvoj)
│
├── lib/
│   ├── utils.ts                      (shadcn — postoji)
│   │
│   ├── api/                          ← API sloj
│   │   ├── client.ts                 (fetch klijent — base URL, JWT header, auto-refresh)
│   │   ├── types.ts                  (ApiResponse<T> omotač, zajednički tipovi)
│   │   └── auth.ts                   (svi pozivi: login, google, refresh, logout, etc.)
│   │
│   └── auth/
│       ├── token-storage.ts          (čitanje/pisanje tokena u localStorage)
│       └── auth-context.tsx          (React Context — AuthProvider, useAuth hook)
│
├── hooks/
│   └── use-auth.ts                   (re-export iz auth-context za čišći import)
│
└── middleware.ts                     (Next.js middleware — zaštita /intranet/** ruta)
```

---

## Komponente po Prioritetu

### 1. `middleware.ts` — Route Protection

Next.js middleware koji se izvršava **na serveru** za svaki request na `/intranet/*`.

- **Logika:** čita `refresh_token` cookie (ili header). Ako ne postoji → redirect na `/intranet/login`.
- **Iznimke** (ne zahtijevaju token): `/intranet/login`, `/intranet/forgot-password`, `/intranet/reset-password`, `/intranet/invite/accept`

> [!IMPORTANT]
> Middleware koristi **cookie** za inicijalni check (SSR-friendly), a ne localStorage koji je nedostupan na serveru. Access token ostaje u memoriji (React Context) i ne sprema se nigdje trajno — ovo je sigurnosno ispravna praksa.

### 2. `lib/auth/token-storage.ts`

Helper koji enkapsulira pristup `localStorage`:
- `getRefreshToken()` / `setRefreshToken(token)` / `clearRefreshToken()`
- `getAccessToken()` / `setAccessToken(token)` / `clearAccessToken()`
- `clearAll()` — za logout

### 3. `lib/api/client.ts` — HTTP Klijent

Centralni fetch wrapper koji automatski:
1. Dodaje `Authorization: Bearer <accessToken>` header
2. Na **401** response → poziva `POST /api/auth/refresh` i retry-a originalni request
3. Ako i refresh fail → poziva `logout()` i redirect na login
4. Parsira `ApiResponse<T>` omotač i vraća samo `.data`

### 4. `lib/auth/auth-context.tsx` — Auth Context

React Context koji drži:
```ts
{
  user: AdminUserResponse | null,    // dohvaćeno s GET /api/admin/users/me
  isLoading: boolean,
  login(email, password): Promise<void>,
  loginWithGoogle(idToken): Promise<void>,
  logout(): Promise<void>,
}
```

Inicijalizacija: ako postoji `refreshToken` u localStorage → auto-refresh pri mount-u → dohvat `/api/admin/users/me`.

### 5. `(intranet)/layout.tsx` — Auth Guard

- Ako `isLoading` → loading spinner
- Ako `user === null` i ruta nije login/forgot/reset/invite → redirect na `/intranet/login`
- Inače → `<IntranetShell>` (sidebar + header + `{children}`)

---

## Auth Flowovi — Login Ekran

Login ekran ima **4 pogleda** unutar jedne stranice (bez navigacije između):

```
/intranet/login          → LoginForm (email + lozinka + Google gumb)
                           ↳ link "Zaboravili ste lozinku?" → ForgotPasswordForm (inline state)

/intranet/forgot-password → ForgotPasswordForm (zasebna stranica)

/intranet/reset-password  → ResetPasswordForm (čita ?token= iz URL query params)
                             POST /api/auth/reset-password → redirect na /intranet/login

/intranet/invite/accept   → AcceptInviteForm (čita ?token= iz URL query params)
                             POST /api/auth/invite/accept → auto-login → redirect na /intranet/dashboard
```

### Detalji LoginForm-a

| UI Element | Backend Poziv |
|---|---|
| Email + lozinka forma | `POST /api/auth/login` |
| "Nastavi s Googleom" gumb | Google SDK → `idToken` → `POST /api/auth/google` |
| "Zaboravili ste lozinku?" link | inline prebacuje na ForgotPasswordForm |
| Error prikaz | 401 → "Neispravni podaci", 403 → "Račun nije aktivan" |

---

## Interne Ovisnosti (novi npm paketi)

| Paket | Razlog |
|---|---|
| `@react-oauth/google` | Google Sign-In SDK za web (najlakša integracija za React) |
| `js-cookie` | Cross-browser cookie management za middleware ↔ klijent sync |
| `@types/js-cookie` | TypeScript tipovi |

---

## Verifikacijski Plan

1. `npm run dev` → nema TypeScript grešaka
2. Posjetiti `/intranet/dashboard` bez logina → redirect na `/intranet/login`
3. Posjetiti `/intranet/login` → stranica se učitava, forma je prikazana
4. Login s krivim podacima → error poruka prikazana
5. `/intranet/reset-password?token=abc` → forma prikazana s token handling logikom
6. `/intranet/invite/accept?token=abc` → forma prikazana

---

## Open Questions

> [!IMPORTANT]
> **Google OAuth Client ID:** Za `@react-oauth/google` treba Google OAuth Client ID koji se konfigurira u Google Cloud Console. Imaš li ga, ili ćemo zasad Google gumb prikazati ali onemogućiti s TODO placeholder-om?

> [!NOTE]
> **Backend base URL:** U `lib/api/client.ts` ćemo hardkodati `http://localhost:8080` kao dev URL. Jesi li već postavio environment variables (`.env.local` s `NEXT_PUBLIC_API_URL`)? Ako ne, sada je pravo vrijeme.
