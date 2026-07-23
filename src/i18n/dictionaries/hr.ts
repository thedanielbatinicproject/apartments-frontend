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

  houseRules: {
    eyebrow: "Dobro je znati",
    title: "Kućni red",
    subtitle: "Oba apartmana dijele istu adresu, ali se oglašavaju i vode zasebno. Odaberite domaćina koji odgovara vašoj rezervaciji.",
    understand: "Razumijem",
    switchLabels: { brigita: "Brigita", ivica: "Ivica" },
    hosts: {
      brigita: {
        propertyName: "Apartmani Brigita",
        ownerLabel: "Vlasnica / Domaćica",
        ownerName: "Brigita Batinić",
        phone: "+385 98 910 5640",
        address: "Slobodana Macure 13, 22000 Šibenik, Hrvatska",
        effective: "2025. i vrijedi do daljnjeg.",
        apartments: [
          {
            name: "Studio Apartman",
            description: "Kapacitet: do 2 odrasle osobe. Kompaktan i udoban apartman, idealan za parove ili individualne putnike koji traže mir i funkcionalnost.",
          },
          {
            name: "Apartman s vrtom",
            description: "Kapacitet: do 3 odrasle osobe ili 2 odrasle osobe + 2 djece. Uključuje privatni ograđeni vrt za isključivu upotrebu gostiju, uz dodatna sigurnosna pravila opisana niže.",
          },
        ],
        sections: [
          {
            heading: "1. Opće odredbe",
            paragraphs: [
              "Ovaj kućni red definira odgovornosti domaćice i gostiju. Potvrdom rezervacije ili prijavom, gost potvrđuje potpuno prihvaćanje ovih uvjeta. Cilj je održati miran, siguran i zakonit boravak za sve te osigurati pravilno očuvanje imovine i opreme.",
            ],
          },
          {
            heading: "2. Prijava, odjava i registracija",
            bullets: [
              "**Prijava (check-in):** od 14:00. **Odjava (check-out):** do 10:00 na dan odlaska.",
              "Gosti su dužni predočiti valjanu identifikacijsku ispravu po dolasku radi prijave u sustav **eVisitor**, sukladno hrvatskom zakonu o turizmu.",
              "Boraviti smiju samo registrirani gosti. Posjetitelje ili dodatne osobe potrebno je unaprijed odobriti s domaćicom.",
              "Nepridržavanje obveze registracije može rezultirati prekidom boravka bez povrata novca.",
            ],
          },
          {
            heading: "3. Korištenje prostora i ponašanje",
            paragraphs: [
              "Od gostiju se očekuje pristojno, s poštovanjem i odgovorno ponašanje u svakom trenutku. Nekretnina se nalazi u mirnom stambenom naselju, stoga je očuvanje mira i javnog reda zakonska i ugovorna obveza.",
            ],
            highlight: {
              bullets: [
                "**Strogo je zabranjeno** organiziranje zabava, okupljanja ili događaja s neregistriranim posjetiteljima, pojačanom glazbom ili glasnim društvenim aktivnostima.",
                "Tišina se poštuje od **22:00 do 8:00**. U tom razdoblju gosti moraju izbjegavati svaku buku koja bi mogla ometati druge goste ili susjede — uključujući glasne razgovore, pomicanje namještaja ili korištenje glasnih uređaja.",
                "Gosti se moraju suzdržati od svakog ponašanja koje je uvredljivo, agresivno ili prijeteće prema domaćici, drugim gostima ili lokalnim stanovnicima.",
                "Posjedovanje ili korištenje ilegalnih supstanci, oružja, pirotehnike ili opasnih materijala u prostoru **strogo je zabranjeno** i rezultirat će trenutnim iseljenjem i prijavom policiji.",
                "Pušenje i vejpanje nisu dopušteni unutar apartmana. Pušenje je dopušteno samo na za to predviđenim vanjskim mjestima. Neispravno odlaganje opušaka podliježe dodatnoj naplati čišćenja.",
                "Gosti su dužni koristiti zdrav razum i poštovati lokalne običaje, zakone i propise koji uređuju stambeno ponašanje u Hrvatskoj.",
                "Nepridržavanje standarda ponašanja može rezultirati prekidom smještaja bez povrata novca, a u ozbiljnijim slučajevima i prijavom nadležnim tijelima.",
              ],
              outro: "**Napomena:** Domaćica zadržava pravo ulaska u apartman u slučaju ozbiljnog ometanja, sigurnosnih razloga ili sumnje na zabranjene aktivnosti. Takav ulazak bit će zabilježen i opravdan isključivo u svrhu održavanja sigurnosti i pridržavanja pravila.",
            },
          },
          {
            heading: "4. Briga o imovini i šteta",
            bullets: [
              "Gosti su dužni odgovorno rukovati namještajem, uređajima i cjelokupnim inventarom, sukladno danim uputama.",
              "Svaku štetu, kvar ili gubitak potrebno je odmah prijaviti. Propuštanje prijave može dovesti do naplate nakon odjave.",
              "Gosti su financijski odgovorni za svu štetu uzrokovanu nemarom, nepravilnom uporabom ili namjerom.",
              "Zabranjeno je premještati ili iznositi bilo koji predmet (npr. ručnike, kuhinjski pribor, dekoraciju) iz nekretnine.",
            ],
          },
          {
            heading: "5. Čistoća i održavanje",
            bullets: [
              "Apartmani se profesionalno čiste prije dolaska. Gosti bi trebali održavati čistoću tijekom boravka.",
              "Otpad odlažite pravilno i reciklirajte gdje je primjenjivo. Otpad od hrane, ulje i higijenski proizvodi nikada se ne smiju bacati u WC školjku ili odvode.",
              "Dodatna naknada za čišćenje može se naplatiti ako je apartman ostavljen pretjerano prljav, s mrljama, neugodnim mirisima ili neispravnom uporabom opreme.",
            ],
          },
          {
            heading: "6. Vrt i vanjski prostor (Apartman s vrtom)",
            bullets: [
              "Vrt je namijenjen isključivoj upotrebi gostiju koji borave u Apartmanu s vrtom. Djeca moraju uvijek biti pod nadzorom odrasle osobe.",
              "Otvorena vatra je zabranjena osim sigurne upotrebe za to predviđenog roštilj mjesta. Vatru nikada ne ostavljajte bez nadzora i u potpunosti je ugasite nakon upotrebe.",
              "Zabranjeno je oštećivati ili brati biljke, koristiti staklo blizu travnatih površina ili premještati vanjski namještaj.",
              "Domaćica se odriče odgovornosti za nezgode uzrokovane nesigurnim ili nemarnim ponašanjem u vrtu.",
            ],
          },
          {
            heading: "7. Odgovornost i osiguranje",
            bullets: [
              "Domaćica nije odgovorna za krađu, gubitak ili štetu na osobnim stvarima. Gostima se preporučuje da osiguraju vrijedne predmete i imaju važeće putno osiguranje.",
              "Gosti su u potpunosti odgovorni za svu štetu, ozljedu ili incident nastao njihovim djelovanjem ili nemarom.",
            ],
          },
          {
            heading: "8. Ključevi i sigurnost",
            bullets: [
              "Gosti su odgovorni za sve izdane ključeve. Izgubljeni ključ podliježe naknadi u minimalnom iznosu od **30 €**.",
              "Uvijek zaključajte vrata i prozore prilikom napuštanja prostora.",
              "Pristupni kodovi ili ključevi ne smiju se umnožavati niti dijeliti s neregistriranim osobama.",
            ],
          },
          {
            heading: "9. Hitni slučajevi",
            bullets: [
              "U hitnim slučajevima nazovite **112** (jedinstveni broj za hitne službe u Hrvatskoj).",
              "Za hitne probleme s nekretninom ili sigurnosne razloge odmah kontaktirajte domaćicu: **+385 98 910 5640**.",
            ],
          },
          {
            heading: "10. Kršenje pravila",
            bullets: [
              "Domaćica može prekinuti smještaj bez povrata novca u slučaju ozbiljnih kršenja poput nezakonitog ponašanja, oštećenja imovine ili kršenja pravila o buci.",
              "Troškovi štete, dodatnog čišćenja ili izgubljenih predmeta bit će naplaćeni sukladno tome.",
              "Teža ili kaznena djela bit će prijavljena policiji i turističkoj inspekciji.",
            ],
          },
          {
            heading: "11. Završne odredbe",
            paragraphs: [
              "Ovaj kućni red čini sastavni dio ugovora o smještaju između gosta i Apartmana Brigita. Za sve sporove mjerodavno je hrvatsko pravo. Gosti potvrđuju da su pročitali i prihvatili sve odredbe dovršavanjem prijave (check-in).",
            ],
          },
        ],
        footerNote: [
          "© 2025 Apartmani Brigita — Sva prava pridržana",
          "Adresa: Slobodana Macure 13, 22000 Šibenik, Hrvatska • Vlasnica: Brigita Batinić • Telefon: +385 98 910 5640",
        ],
      },
      ivica: {
        propertyName: "Apartmani Ivica",
        ownerLabel: "Vlasnik",
        ownerName: "Ivica Batinić",
        phone: "+385 99 593 7343",
        address: "Slobodana Macure 13, 22000 Šibenik, Hrvatska",
        sections: [
          {
            heading: "1. Opće odredbe",
            paragraphs: [
              "Dobrodošli u Apartmane Ivica. Ovaj kućni red osigurava ugodan, siguran i zakonit boravak za sve goste. Boravkom u apartmanu, svaki gost potvrđuje da je pročitao, razumio i pristaje na poštivanje ovih pravila tijekom cijelog trajanja boravka.",
            ],
          },
          {
            heading: "2. Prijava i odjava",
            bullets: [
              "Prijava (check-in) je moguća od **14:00** na dan dolaska.",
              "Odjava (check-out) mora biti obavljena do **10:00** na dan odlaska.",
              "Svi gosti moraju predočiti valjanu osobnu iskaznicu ili putovnicu radi registracije u sustavu **eVisitor**.",
              "U apartmanu smiju boraviti samo registrirani gosti.",
              "Svaka promjena broja osoba mora se odmah prijaviti vlasniku.",
            ],
          },
          {
            heading: "3. Zabrana posjetitelja, zabava i okupljanja",
            highlight: {
              intro: "Strogo zabranjeno:",
              bullets: [
                "Dovođenje neregistriranih osoba u apartman (čak i privremeno).",
                "Organiziranje zabava, okupljanja, proslava ili bilo kakvih grupnih aktivnosti.",
                "Uključivanje u bilo kakve neprimjerene ili nezakonite aktivnosti, uključujući, ali ne ograničavajući se na pružanje ili korištenje seksualnih usluga, zlouporabu supstanci, ili bilo kakvo ponašanje koje remeti javni red ili krši hrvatski zakon.",
              ],
              outro: "Svako kršenje ovog pravila rezultirat će **trenutnim raskidom ugovora o najmu bez povrata novca**, a vlasnik zadržava pravo **kontaktiranja tijela za provedbu zakona** i prijave nezakonitog ponašanja.",
            },
          },
          {
            heading: "4. Kućni red i ponašanje",
            bullets: [
              "Molimo svedite buku na minimum između **22:00 i 8:00**.",
              "Pušenje unutar apartmana **nije dopušteno**.",
              "Ilegalne supstance ili predmeti strogo su zabranjeni.",
              "Gosti su dužni brižno se odnositi prema apartmanu i inventaru te odmah prijaviti svaku štetu.",
              "Troškovi popravka ili zamjene uslijed nemara gosta naplaćuju se gostu.",
            ],
          },
          {
            heading: "5. Sadržaji apartmana",
            bullets: [
              "Apartman uključuje: 2 kreveta, kupaonicu s WC-om i kuhinjski kutak.",
              "Sve uređaje i namještaj koristite odgovorno.",
              "Isključite svjetla, klima uređaj i električne uređaje prilikom napuštanja apartmana.",
              "Ne iznosite nikakve predmete iz apartmana.",
            ],
          },
          {
            heading: "6. Odgovornost",
            bullets: [
              "Vlasnik nije odgovoran za gubitak ili krađu osobnih stvari.",
              "Vlasnik nije odgovoran za ozljede uzrokovane nemarom gosta.",
              "Gosti su dužni zaključavati apartman i čuvati ključeve. Izgubljeni ključ podliježe naknadi zamjene u iznosu od **30 €**.",
            ],
          },
          {
            heading: "7. Čistoća i održavanje",
            bullets: [
              "Apartman se čisti, a posteljina mijenja prije svakog novog boravka.",
              "Dodatno čišćenje moguće je dogovoriti na zahtjev.",
              "Ne bacajte otpad ili hranu u WC školjku ili odvode.",
            ],
          },
          {
            heading: "8. Sigurnost",
            bullets: [
              "U slučaju požara ili hitnog slučaja, odmah kontaktirajte vlasnika i hitne službe (**112**).",
              "Ne dirajte električne ili vodovodne instalacije.",
            ],
          },
          {
            heading: "9. Posljedice kršenja pravila",
            paragraphs: ["U slučaju kršenja ovih pravila, vlasnik zadržava pravo:"],
            bullets: [
              "Odmah raskinuti ugovor o smještaju.",
              "Zatražiti da gost napusti apartman bez povrata novca.",
              "Obavijestiti nadležna tijela, uključujući policiju i turističku inspekciju.",
            ],
          },
          {
            heading: "10. Prihvaćanje",
            paragraphs: [
              "Boravkom u apartmanu, gost potvrđuje da je pročitao, razumio i pristao na poštivanje ovog kućnog reda u cijelosti.",
            ],
          },
        ],
        footerNote: ["© 2025 Apartmani Ivica – Sva prava pridržana"],
      },
    },
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
