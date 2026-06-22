# MovieWatchlist

## Opis projekta

MovieWatchlist je mobilna aplikacija razvijena korišćenjem Ionic i Angular tehnologija. Aplikacija omogućava korisnicima da kreiraju i organizuju liste filmova, dodaju nove filmove, uređuju postojeće i prate koje su filmove odgledali.

Podaci o korisnicima i filmovima čuvaju se korišćenjem Firebase Realtime Database, dok je autentifikacija korisnika realizovana preko Firebase Authentication sistema.

---

## Funkcionalnosti

### Autentifikacija korisnika

- Registracija novog korisnika
- Prijava postojećeg korisnika
- Odjava korisnika
- Zaštita ruta pomoću Auth Guard mehanizma

### Upravljanje listama

- Kreiranje novih lista filmova
- Pregled svih korisničkih lista
- Izmena naziva i opisa liste
- Brisanje liste

### Upravljanje filmovima

- Dodavanje novog filma u listu
- Pregled svih filmova iz odabrane liste
- Izmena podataka o filmu
- Brisanje filma
- Označavanje da li je film odgledan

### Dodatne funkcionalnosti

- Prikaz datuma kreiranja liste
- Validacija korisničkog unosa
- Toast poruke za prikaz obaveštenja korisniku
- Automatsko osvežavanje podataka pri povratku na stranicu

---

## Korišćene tehnologije

### Ionic

Korišćen za razvoj mobilnog korisničkog interfejsa i prilagođavanje aplikacije mobilnim uređajima.

### Angular

Front-end framework korišćen za organizaciju aplikacije kroz komponente, servise i rutiranje.

### TypeScript

Programski jezik korišćen za implementaciju logike aplikacije.

### Firebase Authentication

Servis korišćen za registraciju i prijavu korisnika.

### Firebase Realtime Database

Servis korišćen za skladištenje podataka o korisnicima, listama i filmovima.

### Git

Korišćen za verzionisanje i čuvanje izvornog koda projekta.

---

## Struktura projekta

src/app

├── pages
│   ├── login
│   ├── register
│   ├── home
│   ├── movies
│   └── add-movie
│
├── services
│   ├── auth.service
│   ├── movie.service
│   └── movie-list.service
│
├── models
│   ├── movie.model
│   └── movie-list.model
│
└── guards
    └── auth-guard

---

## Arhitektura aplikacije

Aplikacija je razvijena korišćenjem Angular arhitekture zasnovane na komponentama i servisima.

Tok rada aplikacije:

Korisnik

↓

Angular komponente (Pages)

↓

Servisi (AuthService, MovieService, MovieListService)

↓

HttpClient

↓

Firebase Authentication / Firebase Realtime Database

### Komponente

Komponente predstavljaju korisnički interfejs aplikacije i odgovorne su za interakciju sa korisnikom.

Implementirane stranice:

- Login Page
- Register Page
- Home Page
- Movies Page
- Add Movie Page

### Servisi

#### AuthService

Zadužen za:

- registraciju korisnika
- prijavu korisnika
- odjavu korisnika
- čuvanje tokena i korisničkih podataka
- proveru da li je korisnik prijavljen

#### MovieListService

Zadužen za:

- kreiranje lista
- učitavanje lista
- izmenu lista
- brisanje lista

#### MovieService

Zadužen za:

- dodavanje filmova
- učitavanje filmova
- izmenu filmova
- brisanje filmova

### Modeli

#### Movie

Predstavlja jedan film i sadrži:

- naziv filma
- žanr
- godinu
- ocenu
- status odgledanosti
- datum kreiranja

#### MovieList

Predstavlja jednu listu filmova i sadrži:

- naziv liste
- datum kreiranja
- identifikator liste

### Zaštita ruta

Za zaštitu pristupa određenim stranicama korišćen je Auth Guard.

Auth Guard proverava da li korisnik poseduje validan token u localStorage memoriji.

Ukoliko korisnik nije prijavljen:

- pristup zaštićenim stranicama se zabranjuje
- korisnik se preusmerava na Login stranicu

### Upravljanje podacima

Za komunikaciju sa Firebase servisima koristi se Angular HttpClient.

Komunikacija se ostvaruje korišćenjem HTTP metoda:

- GET – preuzimanje podataka
- POST – dodavanje novih podataka
- PUT – izmena postojećih podataka
- DELETE – brisanje podataka
- PATCH – delimična izmena postojećih podataka

Prilikom prijave Firebase Authentication generiše autentifikacioni token i jedinstveni identifikator korisnika (UID). UID se koristi za organizaciju podataka u Firebase Realtime Database bazi, čime se obezbeđuje da svaki korisnik pristupa isključivo svojim listama i filmovima.

---

## Način rada aplikacije

Korisnik se najpre registruje ili prijavljuje u aplikaciju. Nakon uspešne prijave Firebase Authentication generiše jedinstveni identifikator korisnika (UID) i autentifikacioni token.

Na početnoj stranici korisnik može da kreira liste filmova. Svaka lista može sadržati proizvoljan broj filmova. Filmovi se čuvaju u Firebase Realtime Database bazi i povezani su sa korisnikom preko njegovog UID identifikatora.

Prilikom svakog pristupa zaštićenim stranicama Auth Guard proverava da li postoji validan token u localStorage memoriji i na osnovu toga dozvoljava ili zabranjuje pristup aplikaciji.

---

## Moguća buduća unapređenja

- Sortiranje po oceni i godini
- Dodavanje slike ili postera filma
- Omiljeni filmovi
- Integracija sa spoljnim filmskim API servisima

---

## Autori

Projekat je razvijen kao studentski projekat u okviru predmeta Mobilne aplikacije.

Autori:
- Irena Stankovic 2022/0430
- Jovana Sekulic 2022/1004

Tehnologije: Ionic, Angular, TypeScript, Firebase Authentication, Firebase Realtime Database i Git.