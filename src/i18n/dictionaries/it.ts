import type { Dictionary } from "./en";

export const it = {
  nav: {
    home: "Home",
    apartments: "Appartamenti",
    about: "Su Šibenik",
    contact: "Contatti",
    book: "Prenota ora",
  },

  home: {
    hero: {
      greetingMorning: "Buongiorno!",
      greetingDay: "Buon pomeriggio!",
      greetingEvening: "Buonasera!",
      greetingNight: "Benvenuti, nottambuli!",
      tagline: "Tre appartamenti a gestione familiare nel cuore della città vecchia in pietra di Šibenik.",
      scrollCue: "Date un'occhiata",
    },

    apartments: {
      eyebrow: "Dove soggiornerete",
      title: "Tre case nel centro storico",
      subtitle: "A gestione familiare, nel quartiere Plišac — centro storico, cattedrale e mare a pochi passi.",
      guestsLabel: "Ospiti",
      roomsLabel: "Stanze",
      cta: "Vedi l'appartamento",
      error: "Al momento non è possibile caricare gli appartamenti.",
      retry: "Riprova",
      empty: "Al momento non ci sono appartamenti disponibili.",
    },

    about: {
      eyebrow: "Appena fuori dalla porta",
      title: "Una città millenaria",
      text: "Fondata con la carta di un re croato nel 1066, custodita da quattro fortezze, coronata da una cattedrale UNESCO di pura pietra — e tutto questo inizia in fondo alla vostra via.",
      cta: "Scopri Šibenik",
    },

    contact: {
      title: "Domande prima di prenotare?",
      text: "Scriveteci direttamente — saremo felici di aiutarvi a scegliere l'appartamento giusto.",
      cta: "Contattaci",
      footerTagline: "Con amore, da Šibenik",
    },
  },

  apartmentDetail: {
    backToList: "Tutti gli appartamenti",
    capacity: "{n} ospiti",
    rooms: "{n} stanze",
    amenitiesTitle: "Servizi",

    gallery: {
      empty: "Nessuna foto per ora.",
    },

    calendar: {
      title: "Disponibilità",
      legendFree: "Libero",
      legendBooked: "Occupato",
      bookHint: "Questo calendario è solo indicativo — prenota tramite Airbnb.",
      error: "Al momento non è possibile caricare il calendario.",
      retry: "Riprova",
      weekdays: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
    },

    reviews: {
      title: "Recensioni degli ospiti",
      empty: "Nessuna recensione per ora.",
      error: "Al momento non è possibile caricare le recensioni.",
      retry: "Riprova",
      upvote: "Utile",
      averageSuffix: "/ 5 · {n} recensioni",
    },

    airbnb: {
      title: "Prenota su Airbnb",
      text: "Le prenotazioni per questo appartamento avvengono tramite Airbnb.",
      viewOnAirbnb: "Vedi su Airbnb",
      tapHint: "Tocca la scheda per aprire l'annuncio completo su Airbnb",
      unavailable: "Il link all'annuncio Airbnb non è ancora disponibile.",
    },

    notFound: {
      title: "Appartamento non trovato",
      text: "Questo appartamento non esiste o non è più disponibile.",
      back: "Torna agli appartamenti",
    },
  },

  aboutPage: {
    hero: {
      eyebrow: "La città fuori dalla vostra porta",
      title: "Šibenik",
      subtitle: "Millenaria, difesa da quattro fortezze, e — cosa improbabile — un tempo una delle città più elettrificate della Terra.",
    },

    history: {
      title: "Croata fin dall'inizio",
      text: "La maggior parte delle città di questa costa fu fondata da Greci, Illiri o Romani. Šibenik no — è menzionata per la prima volta il giorno di Natale del 1066 in una carta del re croato Petar Krešimir IV, motivo per cui è ancora soprannominata \"la città di Krešimir\". Fino a un'epidemia di peste nel XVII secolo, fu la città più grande di tutta la costa adriatica orientale.",
    },

    siege: {
      eyebrow: "1647",
      title: "L'assedio fallito",
      text: "Durante la guerra di Candia, una forza ottomana di oltre 25.000 soldati assediò Šibenik — difesa da meno di 6.000 cittadini. Le mura ressero. È uno dei motivi per cui la città ha ancora quattro fortezze invece di rovine.",
    },

    innovation: {
      eyebrow: "1895",
      title: "La notte in cui si accesero le luci",
      text: "Una centrale idroelettrica sul vicino fiume Krka rese Šibenik una delle prime città al mondo con illuminazione pubblica a corrente alternata — utilizzando lo stesso sistema CA che Nikola Tesla aveva appena brevettato, costruita nella stessa epoca della pionieristica centrale delle cascate del Niagara.",
    },

    parachute: {
      eyebrow: "1617",
      title: "Il primo salto con il paracadute",
      text: "Faust Vrančić, un poliedrico nato a Šibenik che parlava sette lingue, disegnò una versione perfezionata del concetto di paracadute di Leonardo da Vinci e lo chiamò \"Homo Volans\" — l'Uomo Volante. Poi, a circa 65 anni, si lanciò davvero da una torre a Venezia indossandolo. Sopravvisse. È uno dei primi salti con il paracadute documentati nella storia.",
    },

    cathedral: {
      eyebrow: "UNESCO dal 2000",
      title: "La cattedrale di San Giacomo",
      text: "Costruita interamente in pietra tra il 1431 e il 1536 — senza una sola trave di legno o goccia di malta nel tetto a volta — è una delle grandi opere rinascimentali della Croazia, in gran parte opera del maestro costruttore Juraj Dalmatinac. Alzate lo sguardo verso la facciata: 71 volti scolpiti nella pietra vi osservano — e nel 2015 l'intera piazza ha interpretato la Banca di Ferro di Braavos in Game of Thrones.",
    },

    fortresses: {
      title: "Quattro fortezze sull'orizzonte",
      intro: "Uno spettacolo raro per una città di queste dimensioni — tutte e quattro sono ancora in piedi, tre medievali e una rinata come moderna mostra in realtà aumentata.",
      barone: {
        eyebrow: "Costruita nel 1646",
        title: "Fortezza Barone",
        text: "Eretta in fretta nel 1646 per ordine del barone Christophe Martin von Degenfeld — proprio il comandante la cui difesa spezzò l'assedio raccontato sopra. Completamente restaurata nel 2014, i suoi bastioni ospitano oggi una mostra in realtà aumentata che rivive quella battaglia, accanto a una terrazza che serve vino e olio d'oliva locali con la vista migliore della città.",
      },
      stMichael: {
        title: "Fortezza di San Michele",
        text: "Questa collina è fortificata fin dall'età del ferro, ed è qui che è nata Šibenik — la carta del 1066 citata sopra fu firmata tra queste mura. Nel 1663 un fulmine colpì il deposito di polvere da sparo facendo saltare in aria metà fortezza; ciò che si vede oggi è in gran parte una ricostruzione, ora un palcoscenico estivo all'aperto.",
      },
      stJohn: {
        title: "Fortezza di San Giovanni",
        text: "A forma di stella, a 115 metri di altezza, eretta in soli 45 giorni quando i cittadini di Šibenik si unirono per difendere la propria città. I suoi bastioni hanno interpretato la fossa dei combattimenti di Meereen in Game of Thrones, con Daenerys che osservava proprio da queste mura.",
      },
      stNicholas: {
        eyebrow: "UNESCO dal 2017",
        title: "Fortezza di San Nicola",
        text: "Custodisce l'imboccatura del canale di Sant'Antonio dal 1540, raggiungibile solo in barca. Nel 2017 si è unita alla cattedrale come secondo sito patrimonio mondiale UNESCO di Šibenik.",
      },
    },

    nature: {
      title: "Gite di un giorno a due passi",
      krka: {
        title: "Parco nazionale di Krka",
        text: "A circa 17 km nell'entroterra, il fiume Krka precipita sulle cascate di Skradinski buk — la barriera di travertino più lunga d'Europa. Non ci si può più fare il bagno: vietato dal 2021, per proteggere il muschio vivo che sta ancora lentamente costruendo le stesse barriere di roccia.",
      },
      kornati: {
        title: "Le isole Kornati",
        text: "Un arcipelago di 89 isole, isolotti e scogli disabitati — parco nazionale dal 1980, cinto da ripide scogliere calcaree e acque famose per la loro limpidezza, raggiungibile solo in barca.",
      },
    },

    quest: {
      eyebrow: "Gioca",
      title: "Vola nella storia",
      instruction: "Tocca, clicca o premi la barra spaziatrice per battere le ali — controlli solo l'altitudine, la costa scorre da sola.",
      start: "Inizia il volo",
      progress: "{n} / {total} scoperti",
      lockedLabel: "Luogo {n}",
      lockedHint: "Volaci attraverso per scoprirlo",
      replay: "Vola di nuovo",
      complete: {
        title: "Cerchio completo!",
        text: "Ora sai perché Šibenik è unica.",
      },
      landmarks: {
        cathedral: "Nel 2015 questa piazza ha interpretato la Banca di Ferro di Braavos in Game of Thrones.",
        stMichael: "Fortificata fin dall'età del ferro — e fatta saltare da un fulmine nel 1663.",
        stJohn: "Costruita in appena 45 giorni — ha poi interpretato la fossa dei combattimenti di Meereen sullo schermo.",
        stNicholas: "Il secondo sito UNESCO di Šibenik — raggiungibile solo in barca.",
        siege: "1647: 6.000 difensori resistettero a oltre 25.000 assalitori.",
        barone: "Chiamata così in onore del comandante che spezzò proprio quell'assedio.",
        innovation: "1895: una delle prime città al mondo elettrificate in corrente alternata.",
        parachute: "1617: un nativo di Šibenik saltò da una torre a Venezia con un paracadute — e sopravvisse.",
        krka: "Le sue cascate sono vietate al bagno dal 2021.",
        kornati: "89 isole disabitate, raggiungibili solo in barca.",
      },
    },
  },

  kontaktPage: {
    hero: {
      eyebrow: "Scrivici",
      title: "Contattaci",
      text: "Apartments Šibenik è una piccola realtà a gestione familiare — quando scrivete o chiamate, parlate direttamente con noi, non con un centro prenotazioni.",
    },
    hosts: {
      title: "I vostri host",
      callLabel: "Chiama",
      emailLabel: "Email",
      whatsappLabel: "WhatsApp",
    },
    address: {
      title: "Dove siamo",
      directions: "Indicazioni",
    },
    note: "Preferite Airbnb? Trovate gli stessi appartamenti anche lì — il link è nella pagina di ogni appartamento.",
  },

  checkin: {
    title: "Check-in degli ospiti",

    stay: {
      title: "Il vostro soggiorno",
      subtitle: "Quando soggiornate da noi?",
      arrival: "Arrivo",
      departure: "Partenza",
      night: "notte",
      nights: "notti",
      suggested: "Abbiamo precompilato le date della prenotazione attuale — modificatele se necessario.",
      invalidRange: "La partenza deve essere successiva all'arrivo.",
    },

    consent: {
      title: "La vostra privacy",
      text: "La legge croata ci obbliga a registrare ogni ospite (eVisitor, legge sulla tassa di soggiorno). I vostri dati sono usati solo per questo obbligo di legge — non li conserviamo: le foto dei documenti e i dati personali vengono cancellati automaticamente dai nostri server entro 10 giorni dalla partenza.",
      checkbox: "Acconsento al trattamento dei miei dati per la registrazione degli ospiti",
    },

    start: "Inizia il check-in",

    method: {
      title: "Come volete fare il check-in?",
      recommended: "Più veloce",
      scanTitle: "Scansiona il documento",
      scanDesc: "Puntate la fotocamera sul documento — i dati si compilano da soli.",
      manualTitle: "Inserimento manuale",
      manualDesc: "Documento non a portata di mano? Compilate un breve modulo.",
    },

    docType: {
      title: "Quale documento scansionate?",
      idCard: "Carta d'identità",
      passport: "Passaporto",
      drivingLicence: "Patente di guida",
      bothSides: "fronte e retro",
      oneSide: "solo pagina con foto",
    },

    camera: {
      frontSide: "Fronte",
      backSide: "Retro",
      passportPage: "Pagina con foto",
      fitFrame: "Posizionate il documento dentro la cornice",
      tooDark: "Troppo buio — accendete la luce o avvicinatevi a una finestra.",
      confirmQuestion: "Il documento è nitido e interamente nella cornice?",
      openCamera: "Apri fotocamera",
      unavailable: "Fotocamera non disponibile. Controllate i permessi della fotocamera o inserite i dati manualmente.",
      manualFallback: "Preferisco inserire manualmente",
    },

    processing: {
      title: "Lettura del documento…",
      hint: "Di solito richiede pochi secondi.",
    },

    scanFailed: {
      title: "Non siamo riusciti a leggere il documento",
      text: "La foto potrebbe essere sfocata o la luce troppo scarsa. Riprovate, oppure digitate i dati.",
      tryAgain: "Scansiona di nuovo",
      goManual: "Inserisci manualmente",
    },

    review: {
      title: "Controllate i dati",
      subtitle: "Verificate che tutto corrisponda al documento, poi confermate.",
      missingHint: "Non siamo riusciti a leggere questo campo — compilatelo.",
      confirm: "Conferma i dati",
    },

    manual: {
      title: "Inserite i vostri dati",
      subtitle: "Inserite i dati esattamente come appaiono sul documento.",
      submit: "Continua",
    },

    fields: {
      fullName: "Nome e cognome",
      dateOfBirth: "Data di nascita",
      placeOfBirth: "Luogo di nascita",
      placeOfResidence: "Luogo di residenza",
      placeOfResidenceHint: "Città, poi paese — es. Trieste, Italia",
      documentType: "Tipo di documento",
      documentNumber: "Numero del documento",
      nationality: "Nazionalità",
    },

    success: {
      title: "Check-in completato!",
      verifiedText: "Tutto pronto. Godetevi il soggiorno!",
      reviewText: "Quasi fatto — l'host verificherà rapidamente i dati. Non dovete fare altro. Godetevi il soggiorno!",
      anotherQuestion: "C'è qualcun altro con voi?",
      addAnother: "Registra un altro ospite",
      finish: "Fine",
    },

    newGuest: {
      title: "Nuovo ospite, stesso soggiorno",
      subtitle: "Le date restano le stesse — ogni ospite dà il proprio consenso.",
    },

    errors: {
      generic: "Qualcosa è andato storto. Riprovate.",
      network: "Server non raggiungibile. Controllate la connessione e riprovate.",
      expired: "Questa sessione di check-in è scaduta. Ricominciate da capo.",
      startOver: "Ricomincia",
    },

    cancel: {
      title: "Annullare il check-in?",
      text: "I dati inseriti finora verranno eliminati. Potete ricominciare in qualsiasi momento.",
      confirmButton: "Sì, annulla",
      dismissButton: "No, continua",
    },

    common: {
      back: "Indietro",
      continue: "Continua",
      retry: "Riprova",
      loading: "Caricamento…",
      cancelCheckin: "Annulla check-in",
    },
  },

  checkInvoice: {
    title: "Verifica fattura",
    subtitle: "Inserite il codice stampato sulla fattura",
    codeHint: "Codice di 8 caratteri, es. E710-59DE",
    verifying: "Verifica in corso…",
    incomplete: "Inserite tutti gli 8 caratteri del codice.",

    keypad: {
      backspace: "Elimina",
      clear: "Azzera",
    },

    result: {
      validTitle: "Fattura verificata",
      validText: "Questa è una fattura autentica ed emessa.",
      cancelledTitle: "Fattura annullata",
      cancelledText: "Questa fattura è stata annullata dall'emittente e non è più valida.",
      notFoundTitle: "Fattura non trovata",
      notFoundText: "Non abbiamo trovato una fattura valida con questo codice. Controllate il codice e riprovate.",
      checkAnother: "Verifica un altro codice",
    },

    fields: {
      documentNumber: "Numero documento",
      invoiceDate: "Data fattura",
      issuedBy: "Emesso da",
      recipient: "Destinatario",
      totalDue: "Totale da pagare",
      status: "Stato",
    },

    status: {
      DRAFT: "Bozza",
      ISSUED: "Emessa",
      CANCELLED: "Annullata",
    },

    errors: {
      generic: "Qualcosa è andato storto. Riprovate.",
      network: "Server non raggiungibile. Controllate la connessione e riprovate.",
    },
  },

  notFound: {
    title: "Pagina non trovata",
    description: "La pagina «{path}» non esiste o è stata spostata.",
    homeButton: "Torna alla home",
    adminButton: "Intranet admin",
    adminHint: "Cercate l'intranet admin?",
    adminLinkText: "Cliccate qui",
  },
} satisfies Dictionary;
