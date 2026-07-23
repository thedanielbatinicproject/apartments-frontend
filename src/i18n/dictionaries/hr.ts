import type { Dictionary } from "./en";

export const hr = {
  nav: {
    home: "Početna",
    apartments: "Apartmani",
    about: "O Šibeniku",
    contact: "Kontakt",
    book: "Rezerviraj",
  },

  home: {
    hero: {
      greetingMorning: "Dobro jutro!",
      greetingDay: "Dobar dan!",
      greetingEvening: "Dobra večer!",
      greetingNight: "Dobrodošli, noćne ptice!",
      tagline: "Tri obiteljska apartmana u srcu starog kamenog grada Šibenika.",
      scrollCue: "Zavirite",
    },

    apartments: {
      eyebrow: "Mjesto gdje boravite",
      title: "Tri doma u srcu grada",
      subtitle: "Apartmani u obiteljskoj kući, u centru grada, na kratkoj šetnji od mora, tvrđava i plaže.",
      guestsLabel: "Gosti",
      roomsLabel: "Sobe",
      cta: "Pogledaj apartman",
      error: "Trenutačno ne možemo učitati apartmane.",
      retry: "Pokušaj ponovno",
      empty: "Trenutačno nema dostupnih apartmana.",
    },

    about: {
      eyebrow: "Pred vašim pragom",
      title: "Grad star tisuću godina",
      text: "Utemeljen poveljom hrvatskoga kralja 1066., čuvan četirima tvrđavama, okrunjen UNESCO-ovom katedralom od čistog kamena — i sve to počinje na kraju vaše ulice.",
      cta: "Istražite Šibenik",
    },

    contact: {
      title: "Pitanja prije rezervacije?",
      text: "Javite nam se izravno — rado ćemo pomoći odabrati pravi apartman.",
      cta: "Kontaktirajte nas",
      footerTagline: "S ljubavlju, iz Šibenika",
    },
  },

  apartmentDetail: {
    backToList: "Svi apartmani",
    capacity: "{n} gostiju",
    rooms: "{n} soba",
    amenitiesTitle: "Sadržaji",

    gallery: {
      empty: "Još nema fotografija.",
    },

    calendar: {
      title: "Dostupnost",
      legendFree: "Slobodno",
      legendBooked: "Zauzeto",
      bookHint: "Ovaj kalendar služi samo za orijentaciju — rezervacija ide preko Airbnba.",
      error: "Trenutačno ne možemo učitati kalendar.",
      retry: "Pokušaj ponovno",
      weekdays: ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"],
    },

    reviews: {
      title: "Recenzije gostiju",
      empty: "Još nema recenzija.",
      error: "Trenutačno ne možemo učitati recenzije.",
      retry: "Pokušaj ponovno",
      upvote: "Korisno",
      averageSuffix: "/ 5 · {n} recenzija",
    },

    airbnb: {
      title: "Rezervirajte na Airbnbu",
      text: "Rezervacije za ovaj apartman idu preko Airbnba.",
      viewOnAirbnb: "Pogledaj na Airbnbu",
      tapHint: "Dodirni karticu za puni oglas na Airbnbu",
      unavailable: "Poveznica na Airbnb oglas još nije dostupna.",
    },

    notFound: {
      title: "Apartman nije pronađen",
      text: "Ovaj apartman ne postoji ili više nije na popisu.",
      back: "Natrag na apartmane",
    },
  },

  aboutPage: {
    hero: {
      eyebrow: "Grad iza vaših vrata",
      title: "Šibenik",
      subtitle: "Grad star tisuću godina, branjen sa četiri tvrđave, i — nevjerojatno — nekad jedan od najelektrificiranijih gradova na svijetu.",
    },

    history: {
      title: "Hrvatski od samog početka",
      text: "Većinu gradova na ovoj obali osnovali su Grci, Iliri ili Rimljani. Šibenik nije — prvi put se spominje na Božić 1066. godine, u ispravi hrvatskog kralja Petra Krešimira IV, po čemu ga i danas zovu \"Krešimirov grad\". Sve do epidemije kuge u 17. stoljeću bio je najveći grad na cijeloj istočnoj obali Jadrana.",
    },

    siege: {
      eyebrow: "1647.",
      title: "Opsada koja nije uspjela",
      text: "Tijekom Kandijskog rata, osmanska vojska od navodno preko 25.000 vojnika opsjedala je Šibenik — kojeg je branilo manje od 6.000 građana. Zidine su izdržale. To je jedan od razloga zašto grad i danas ima četiri tvrđave umjesto ruševina.",
    },

    innovation: {
      eyebrow: "1895.",
      title: "Noć kad su se upalila svjetla",
      text: "Hidroelektrana na obližnjoj rijeci Krki učinila je Šibenik jednim od prvih gradova na svijetu s javnom rasvjetom na izmjeničnu struju — koristeći isti AC sustav koji je upravo patentirao Nikola Tesla, izgrađena u istom razdoblju kad i pionirska elektrana na Niagarinim slapovima.",
    },

    parachute: {
      eyebrow: "1617.",
      title: "Prvi skok padobranom",
      text: "Faust Vrančić, šibenski polihistor koji je govorio sedam jezika, nacrtao je usavršenu verziju Leonardova koncepta padobrana i nazvao ga \"Homo Volans\" — Leteći čovjek. Zatim je, u dobi od otprilike 65 godina, stvarno skočio s tornja u Veneciji noseći ga. Preživio je. To je jedan od najranijih zabilježenih skokova padobranom u povijesti.",
    },

    cathedral: {
      eyebrow: "UNESCO od 2000.",
      title: "Katedrala svetog Jakova",
      text: "Izgrađena u potpunosti od kamena između 1431. i 1536. godine — bez ijedne drvene grede ili kapi morta u svođenom krovu — jedno je od najvećih renesansnih ostvarenja u Hrvatskoj, najvećim dijelom djelo graditelja Jurja Dalmatinca. Pogledajte pročelje i pronaći ćete 71 uklesano kameno lice kako vas gleda — a 2015. godine cijeli je trg glumio Željezničku banku Braavosa u seriji Igra prijestolja.",
    },

    fortresses: {
      title: "Četiri tvrđave na obzoru",
      intro: "Rijetkost za grad ove veličine — Tvrđava sv. Mihovila, Tvrđava Barone, Tvrđava sv. Ivana i morska Tvrđava sv. Nikole.",
      barone: {
        eyebrow: "Izgrađena 1646.",
        title: "Tvrđava Barone",
        text: "Podignuta na brzinu 1646. po nalogu baruna Christophea Martina von Degenfelda — baš zapovjednika čija je obrana slomila opsadu opisanu iznad. Potpuno obnovljena 2014., njeni bastioni danas nose AR izložbu koja oživljava tu bitku, uz terasu s domaćim vinom i maslinovim uljem i najboljim pogledom u gradu.",
      },
      stMichael: {
        title: "Tvrđava svetog Mihovila",
        text: "Ovo brdo utvrđeno je još od željeznog doba, i baš je ovdje rođen Šibenik — povelja iz 1066. potpisana je unutar ovih zidina. Godine 1663. munja je udarila u skladište baruta i raznijela pola tvrđave; ono što danas stoji uglavnom je obnova, sada ljetna pozornica pod otvorenim nebom.",
      },
      stJohn: {
        title: "Tvrđava svetog Ivana",
        text: "U obliku zvijezde, 115 metara iznad grada, izgrađena za samo 45 dana kad su se građani Šibenika udružili u obrani vlastitog grada. Njeni bedemi odigrali su borilište Meereena u seriji Igra prijestolja, s Daenerys koja gleda baš s ovih zidina.",
      },
      stNicholas: {
        eyebrow: "UNESCO od 2017.",
        title: "Tvrđava svetog Nikole",
        text: "Čuva ulaz u kanal svetog Ante od 1540. godine, dostupna samo brodom. Godine 2017. pridružila se katedrali kao Šibenikov drugi UNESCO-ov spomenik svjetske baštine.",
      },
    },

    nature: {
      title: "Izleti nadomak ruke",
      krka: {
        title: "Nacionalni park Krka",
        text: "Oko 17 km od obale, rijeka Krka se prelijeva preko Skradinskog buka — najduže sedrene barijere u Europi. Ondje se više ne može plivati: od 2021. je zabranjeno, kako bi se zaštitio živi mahovinasti sloj koji i dalje polako gradi same sedrene barijere.",
      },
      kornati: {
        title: "Kornatski otoci",
        text: "Arhipelag od 89 nenaseljenih otoka, otočića i grebena — nacionalni park od 1980. godine, okružen strmim vapnenačkim liticama i čuveno čistim morem, dostupan samo brodom.",
      },
    },

    quest: {
      eyebrow: "Igraj",
      title: "Odleti kroz priču",
      instruction: "Dodirni, klikni ili pritisni razmaknicu za zamah — kontroliraš samo visinu, obala se sama odmotava.",
      start: "Započni let",
      progress: "{n} / {total} otkriveno",
      lockedLabel: "Znamenitost {n}",
      lockedHint: "Preleti kroz nju da je otkriješ",
      replay: "Poleti ponovno",
      complete: {
        title: "Puni krug!",
        text: "Sad znaš zašto je Šibenik jedinstven.",
      },
      landmarks: {
        cathedral: "2015. godine ovaj je trg odigrao Željezničku banku Braavosa u Igri prijestolja.",
        stMichael: "Utvrđeno još od željeznog doba — i raznešeno udarom munje 1663.",
        stJohn: "Izgrađena za točno 45 dana — kasnije je odigrala borilište Meereena na ekranu.",
        stNicholas: "Šibenikov drugi UNESCO spomenik — dostupan samo brodom.",
        siege: "1647.: 6.000 branitelja odoljelo je vojsci od preko 25.000 napadača.",
        barone: "Nazvana po zapovjedniku koji je slomio baš tu opsadu.",
        innovation: "1895.: jedan od prvih gradova na svijetu s izmjeničnom strujom.",
        parachute: "1617.: Šibenčanin je skočio s tornja u Veneciji s padobranom — i preživio.",
        krka: "Slapovi su zabranjeni za plivanje od 2021. godine.",
        kornati: "89 nenaseljenih otoka, dostupnih samo brodom.",
      },
    },
  },

  kontaktPage: {
    hero: {
      eyebrow: "Javite se",
      title: "Kontaktirajte nas",
      text: "Apartmani Šibenik su mala, obiteljska priča — kad nam pišete ili zovete, razgovarate izravno s nama, ne s pozivnim centrom.",
    },
    hosts: {
      title: "Vaši domaćini",
      callLabel: "Nazovi",
      emailLabel: "E-mail",
      whatsappLabel: "WhatsApp",
    },
    address: {
      title: "Pronađite nas",
      directions: "Upute do nas",
    },
    note: "Radije preko Airbnba? Isti apartmani nalaze se i tamo — link pronađite na stranici svakog apartmana.",
  },

  checkin: {
    title: "Prijava gostiju",

    stay: {
      title: "Vaš boravak",
      subtitle: "Kada boravite kod nas?",
      arrival: "Dolazak",
      departure: "Odlazak",
      night: "noć",
      nights: "noći",
      suggested: "Datume smo popunili prema trenutnoj rezervaciji — po potrebi ih prilagodite.",
      invalidRange: "Odlazak mora biti nakon dolaska.",
    },

    consent: {
      title: "Vaša privatnost",
      text: "Hrvatski zakon nalaže prijavu svakog gosta (eVisitor, Zakon o boravišnoj pristojbi). Vaši podaci koriste se isključivo za tu zakonsku obvezu — ne čuvamo ih: fotografije dokumenata i osobni podaci automatski se brišu s naših servera u roku od 10 dana nakon odlaska.",
      checkbox: "Pristajem na obradu podataka za prijavu gostiju",
    },

    start: "Započni prijavu",

    method: {
      title: "Kako se želite prijaviti?",
      recommended: "Najbrže",
      scanTitle: "Skenirajte dokument",
      scanDesc: "Usmjerite kameru na dokument — podaci se popune sami.",
      manualTitle: "Ručni unos podataka",
      manualDesc: "Nemate dokument pri ruci? Ispunite kratki obrazac.",
    },

    docType: {
      title: "Koji dokument skenirate?",
      idCard: "Osobna iskaznica",
      passport: "Putovnica",
      drivingLicence: "Vozačka dozvola",
      bothSides: "prednja i stražnja strana",
      oneSide: "samo stranica sa slikom",
    },

    camera: {
      frontSide: "Prednja strana",
      backSide: "Stražnja strana",
      passportPage: "Stranica sa slikom",
      fitFrame: "Smjestite dokument unutar okvira",
      tooDark: "Premalo svjetla — upalite rasvjetu ili priđite prozoru.",
      confirmQuestion: "Je li dokument oštar i cijeli unutar okvira?",
      openCamera: "Otvori kameru",
      unavailable: "Kamera nije dostupna. Provjerite dopuštenje za kameru, ili unesite podatke ručno.",
      manualFallback: "Radije unesi ručno",
    },

    processing: {
      title: "Čitamo vaš dokument…",
      hint: "Obično traje nekoliko sekundi.",
    },

    scanFailed: {
      title: "Dokument nismo uspjeli pročitati",
      text: "Fotografija je možda mutna ili je svjetlo preslabo. Pokušajte ponovo ili jednostavno upišite podatke.",
      tryAgain: "Skeniraj ponovo",
      goManual: "Upiši podatke ručno",
    },

    review: {
      title: "Provjerite podatke",
      subtitle: "Provjerite odgovara li sve dokumentu, pa potvrdite.",
      missingHint: "Ovo polje nismo uspjeli pročitati — molimo dopunite.",
      confirm: "Potvrdi podatke",
    },

    manual: {
      title: "Unesite podatke",
      subtitle: "Upišite podatke točno kako stoje na dokumentu.",
      submit: "Nastavi",
    },

    fields: {
      fullName: "Ime i prezime",
      dateOfBirth: "Datum rođenja",
      placeOfBirth: "Mjesto rođenja",
      placeOfResidence: "Mjesto prebivališta",
      placeOfResidenceHint: "Mjesto ili grad, pa država — npr. Split, Hrvatska",
      documentType: "Vrsta dokumenta",
      documentNumber: "Broj dokumenta",
      nationality: "Državljanstvo",
    },

    success: {
      title: "Prijava dovršena!",
      verifiedText: "Sve je spremno. Uživajte u boravku!",
      reviewText: "Još samo trenutak — domaćin će brzo pregledati podatke. Vi ne trebate ništa više. Uživajte u boravku!",
      anotherQuestion: "Boravi li s vama još netko?",
      addAnother: "Prijavi još jednog gosta",
      finish: "Završi",
    },

    newGuest: {
      title: "Novi gost, isti boravak",
      subtitle: "Datumi ostaju isti — svaki gost daje vlastitu privolu.",
    },

    errors: {
      generic: "Nešto je pošlo po zlu. Pokušajte ponovo.",
      network: "Server nije dostupan. Provjerite vezu i pokušajte ponovo.",
      expired: "Prijava je istekla. Molimo, krenite ispočetka.",
      startOver: "Kreni ispočetka",
    },

    cancel: {
      title: "Odustati od prijave?",
      text: "Dosadašnji unos će se odbaciti. Možete krenuti ispočetka bilo kad.",
      confirmButton: "Da, odustani",
      dismissButton: "Ne, nastavi",
    },

    common: {
      back: "Natrag",
      continue: "Nastavi",
      retry: "Pokušaj ponovo",
      loading: "Učitavanje…",
      cancelCheckin: "Odustani od prijave",
    },
  },

  checkInvoice: {
    title: "Provjera računa",
    subtitle: "Upišite kod otisnut na vašem računu",
    codeHint: "Kod od 8 znakova, npr. E710-59DE",
    verifying: "Provjeravam…",
    incomplete: "Upišite svih 8 znakova koda.",

    keypad: {
      backspace: "Obriši",
      clear: "Poništi",
    },

    result: {
      validTitle: "Račun je važeći",
      validText: "Ovo je pravi, izdani račun.",
      cancelledTitle: "Račun je storniran",
      cancelledText: "Ovaj je račun storniran od strane izdavatelja i više ne vrijedi.",
      notFoundTitle: "Račun nije pronađen",
      notFoundText: "Nismo pronašli važeći račun s ovim kodom. Provjerite kod i pokušajte ponovo.",
      checkAnother: "Provjeri drugi kod",
    },

    fields: {
      documentNumber: "Broj dokumenta",
      invoiceDate: "Datum računa",
      issuedBy: "Izdavatelj",
      recipient: "Primatelj",
      totalDue: "Za platiti",
      status: "Status",
    },

    status: {
      DRAFT: "Nedovršen",
      ISSUED: "Izdan",
      CANCELLED: "Storniran",
    },

    errors: {
      generic: "Nešto je pošlo po zlu. Pokušajte ponovo.",
      network: "Server nije dostupan. Provjerite vezu i pokušajte ponovo.",
    },
  },

  notFound: {
    title: "Stranica nije pronađena",
    description: "Zatražena stranica „{path}” nije pronađena ili je premještena.",
    homeButton: "Natrag na početnu",
    adminButton: "Admin intranet",
    adminHint: "Tražite admin intranet?",
    adminLinkText: "Kliknite ovdje",
  },
} satisfies Dictionary;
