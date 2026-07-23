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

  houseRules: {
    eyebrow: "Da sapere",
    title: "Regolamento della casa",
    subtitle: "Entrambi gli appartamenti condividono lo stesso indirizzo ma sono pubblicati e gestiti separatamente. Scegliete l'host corrispondente alla vostra prenotazione.",
    understand: "Ho capito",
    switchLabels: { brigita: "Brigita", ivica: "Ivica" },
    hosts: {
      brigita: {
        propertyName: "Apartments Brigita",
        ownerLabel: "Proprietaria / Host",
        ownerName: "Brigita Batinić",
        phone: "+385 98 910 5640",
        address: "Slobodana Macure 13, 22000 Šibenik, Croazia",
        effective: "2025 e valido fino a nuovo avviso.",
        apartments: [
          {
            name: "Appartamento Studio",
            description: "Capacità: fino a 2 adulti. Un appartamento compatto e confortevole, ideale per coppie o viaggiatori singoli in cerca di tranquillità e funzionalità.",
          },
          {
            name: "Appartamento con giardino",
            description: "Capacità: fino a 3 adulti o 2 adulti + 2 bambini. Include un giardino privato recintato a uso esclusivo degli ospiti, soggetto alle ulteriori norme di sicurezza e responsabilità descritte di seguito.",
          },
        ],
        sections: [
          {
            heading: "1. Disposizioni generali",
            paragraphs: [
              "Questo regolamento della casa definisce le responsabilità sia dell'host sia degli ospiti. Confermando una prenotazione o effettuando il check-in, l'ospite riconosce di accettare pienamente questi termini. L'obiettivo è mantenere un ambiente tranquillo, sicuro e conforme alla legge per tutti gli occupanti e garantire la corretta conservazione dell'immobile e delle attrezzature.",
            ],
          },
          {
            heading: "2. Check-in, check-out e registrazione",
            bullets: [
              "**Check-in:** dalle ore 14:00. **Check-out:** entro le ore 10:00 del giorno di partenza.",
              "Gli ospiti devono fornire un documento d'identità valido all'arrivo per la registrazione nel sistema **eVisitor**, conformemente alla legge croata sul turismo.",
              "Solo gli ospiti registrati sono autorizzati a pernottare. Visitatori o persone aggiuntive devono essere approvati in anticipo dall'host.",
              "Il mancato rispetto degli obblighi di registrazione può comportare la cessazione del soggiorno senza rimborso.",
            ],
          },
          {
            heading: "3. Uso dei locali e comportamento",
            paragraphs: [
              "Gli ospiti sono tenuti a comportarsi sempre con cortesia, rispetto e responsabilità. L'immobile si trova in un tranquillo quartiere residenziale; pertanto, il mantenimento della quiete e dell'ordine pubblico è un obbligo legale e contrattuale.",
            ],
            highlight: {
              bullets: [
                "È **severamente vietato** organizzare feste, riunioni o eventi con visitatori non registrati, musica amplificata o attività sociali rumorose.",
                "Le ore di silenzio vanno osservate dalle **22:00 alle 8:00**. Durante questo periodo, gli ospiti devono evitare qualsiasi rumore che possa disturbare altri ospiti o vicini — incluse conversazioni ad alta voce, spostamento di mobili o uso di dispositivi rumorosi.",
                "Gli ospiti devono astenersi da qualsiasi comportamento offensivo, aggressivo o minaccioso verso l'host, altri ospiti o residenti locali.",
                "Il possesso o l'uso di sostanze illegali, armi, fuochi d'artificio o materiali pericolosi nei locali è **severamente vietato** e comporterà l'immediato allontanamento e la segnalazione alla polizia.",
                "Fumare e usare sigarette elettroniche non è consentito all'interno degli appartamenti. Si può fumare solo nelle aree esterne designate. Lo smaltimento improprio dei mozziconi comporta costi di pulizia aggiuntivi.",
                "Gli ospiti sono tenuti a usare buon senso e a rispettare le usanze locali, le leggi e i regolamenti che disciplinano il comportamento residenziale in Croazia.",
                "Il mancato rispetto degli standard di comportamento può comportare la cessazione dell'alloggio senza rimborso e, nei casi più gravi, la segnalazione alle autorità locali.",
              ],
              outro: "**Nota:** l'host si riserva il diritto di accedere all'appartamento in caso di gravi disturbi, preoccupazioni per la sicurezza o sospetto di attività vietate. Tale accesso sarà registrato e giustificato esclusivamente allo scopo di mantenere la sicurezza e il rispetto delle regole.",
            },
          },
          {
            heading: "4. Cura dell'immobile e danni",
            bullets: [
              "Gli ospiti devono utilizzare mobili, elettrodomestici e l'intero inventario in modo responsabile e secondo le istruzioni fornite.",
              "Qualsiasi danno, malfunzionamento o perdita deve essere segnalato immediatamente. La mancata segnalazione può comportare addebiti dopo il check-out.",
              "Gli ospiti sono finanziariamente responsabili di tutti i danni causati da negligenza, uso improprio o atti intenzionali.",
              "Non spostare né portare via alcun oggetto (ad es. asciugamani, utensili da cucina, decorazioni) dall'immobile.",
            ],
          },
          {
            heading: "5. Pulizia e manutenzione",
            bullets: [
              "Gli appartamenti vengono puliti professionalmente prima dell'arrivo. Gli ospiti dovrebbero mantenere la pulizia durante il soggiorno.",
              "Smaltire i rifiuti correttamente e riciclare ove applicabile. Rifiuti alimentari, olio e articoli igienici non devono mai essere gettati nel water o negli scarichi.",
              "Possono essere applicati costi di pulizia aggiuntivi se l'appartamento viene lasciato eccessivamente sporco, macchiato, maleodorante o con attrezzature usate impropriamente.",
            ],
          },
          {
            heading: "6. Giardino e area esterna (Appartamento con giardino)",
            bullets: [
              "Il giardino è a uso esclusivo degli ospiti che soggiornano nell'Appartamento con giardino. I bambini devono essere sempre sorvegliati da un adulto.",
              "Il fuoco libero è vietato, salvo l'uso sicuro dell'area barbecue designata. Non lasciare mai un fuoco incustodito e spegnerlo completamente dopo l'uso.",
              "Non danneggiare né raccogliere piante, non usare vetro vicino alle aree erbose e non spostare i mobili da esterno.",
              "L'host declina ogni responsabilità per incidenti dovuti a comportamenti non sicuri o negligenti nel giardino.",
            ],
          },
          {
            heading: "7. Responsabilità e assicurazione",
            bullets: [
              "L'host non è responsabile per furto, perdita o danneggiamento di effetti personali. Si consiglia agli ospiti di custodire gli oggetti di valore e di stipulare una valida assicurazione di viaggio.",
              "Gli ospiti sono pienamente responsabili per qualsiasi danno, lesione o incidente derivante dalle loro azioni o negligenza.",
            ],
          },
          {
            heading: "8. Chiavi e sicurezza",
            bullets: [
              "Gli ospiti sono responsabili di tutte le chiavi consegnate. Lo smarrimento di una chiave comporta una spesa minima di **30 €**.",
              "Chiudere sempre a chiave porte e finestre quando si lascia l'immobile.",
              "I codici di accesso o le chiavi non devono essere duplicati né condivisi con persone non registrate.",
            ],
          },
          {
            heading: "9. Emergenze",
            bullets: [
              "In caso di emergenza, chiamare il **112** (numero unico di emergenza in Croazia).",
              "Contattare immediatamente l'host per problemi urgenti relativi all'immobile o preoccupazioni per la sicurezza: **+385 98 910 5640**.",
            ],
          },
          {
            heading: "10. Violazioni del regolamento",
            bullets: [
              "L'host può terminare l'alloggio senza rimborso in caso di gravi violazioni come comportamento illegale, danni alla proprietà o violazioni relative al rumore.",
              "I costi per danni, pulizia extra o oggetti smarriti saranno addebitati di conseguenza.",
              "Reati gravi o penali saranno segnalati alla polizia e all'ispettorato del turismo.",
            ],
          },
          {
            heading: "11. Disposizioni finali",
            paragraphs: [
              "Questo regolamento della casa costituisce parte integrante del contratto di alloggio tra l'ospite e Apartments Brigita. Eventuali controversie sono disciplinate dalla legge croata. Gli ospiti confermano di aver letto e accettato tutte le disposizioni completando il check-in.",
            ],
          },
        ],
        footerNote: [
          "© 2025 Apartmani Brigita — Tutti i diritti riservati",
          "Indirizzo: Slobodana Macure 13, 22000 Šibenik, Croazia • Proprietaria: Brigita Batinić • Telefono: +385 98 910 5640",
        ],
      },
      ivica: {
        propertyName: "Apartments Ivica",
        ownerLabel: "Proprietario",
        ownerName: "Ivica Batinić",
        phone: "+385 99 593 7343",
        address: "Slobodana Macure 13, 22000 Šibenik, Croazia",
        sections: [
          {
            heading: "1. Disposizioni generali",
            paragraphs: [
              "Benvenuti agli Apartments Ivica. Questo regolamento della casa garantisce un soggiorno confortevole, sicuro e legale per tutti gli ospiti. Soggiornando nell'appartamento, ogni ospite conferma di aver letto, compreso e accettato di rispettare queste regole per l'intera durata del soggiorno.",
            ],
          },
          {
            heading: "2. Check-in e check-out",
            bullets: [
              "Il check-in è disponibile dalle **14:00** del giorno di arrivo.",
              "Il check-out deve essere completato entro le **10:00** del giorno di partenza.",
              "Tutti gli ospiti devono presentare un documento d'identità o passaporto valido per la registrazione nel sistema **eVisitor**.",
              "Solo gli ospiti registrati sono autorizzati a soggiornare nell'appartamento.",
              "Qualsiasi variazione nel numero di occupanti deve essere immediatamente comunicata al proprietario.",
            ],
          },
          {
            heading: "3. Divieto di visitatori, feste e assembramenti",
            highlight: {
              intro: "Severamente vietato:",
              bullets: [
                "Portare persone non registrate nell'appartamento (anche solo temporaneamente).",
                "Organizzare feste, riunioni, celebrazioni o qualsiasi forma di attività di gruppo.",
                "Impegnarsi in attività inappropriate o illegali, incluse, a titolo esemplificativo ma non esaustivo, la fornitura o l'uso di servizi sessuali, l'abuso di sostanze o qualsiasi comportamento che disturbi l'ordine pubblico o violi la legge croata.",
              ],
              outro: "Qualsiasi violazione di questa regola comporterà la **risoluzione immediata del contratto di locazione senza rimborso**, e il proprietario si riserva il diritto di **contattare le forze dell'ordine** e segnalare comportamenti illegali.",
            },
          },
          {
            heading: "4. Regolamento della casa e comportamento",
            bullets: [
              "Si prega di ridurre al minimo il rumore tra le **22:00 e le 8:00**.",
              "Fumare all'interno dell'appartamento **non è consentito**.",
              "Sostanze o oggetti illegali sono severamente vietati.",
              "Gli ospiti devono trattare con cura l'appartamento e il suo inventario e segnalare immediatamente eventuali danni.",
              "I costi di riparazione o sostituzione dovuti a negligenza dell'ospite saranno addebitati a quest'ultimo.",
            ],
          },
          {
            heading: "5. Dotazioni dell'appartamento",
            bullets: [
              "L'appartamento include: 2 letti, un bagno con WC e un angolo cottura.",
              "Utilizzare tutti gli elettrodomestici e i mobili in modo responsabile.",
              "Spegnere luci, aria condizionata e dispositivi elettrici quando si lascia l'appartamento.",
              "Non portare via alcun oggetto dall'appartamento.",
            ],
          },
          {
            heading: "6. Responsabilità",
            bullets: [
              "Il proprietario non è responsabile per la perdita o il furto di effetti personali.",
              "Il proprietario non è responsabile per lesioni causate dalla negligenza dell'ospite.",
              "Gli ospiti devono chiudere a chiave l'appartamento e custodire le chiavi. Una chiave smarrita comporterà una spesa di sostituzione di **30 €**.",
            ],
          },
          {
            heading: "7. Pulizia e manutenzione",
            bullets: [
              "L'appartamento viene pulito e la biancheria da letto cambiata prima di ogni nuovo soggiorno.",
              "È possibile richiedere una pulizia aggiuntiva su richiesta.",
              "Non gettare rifiuti o cibo nel water o negli scarichi.",
            ],
          },
          {
            heading: "8. Sicurezza",
            bullets: [
              "In caso di incendio o emergenza, contattare immediatamente il proprietario e i servizi di emergenza (**112**).",
              "Non manomettere gli impianti elettrici o idrici.",
            ],
          },
          {
            heading: "9. Conseguenze delle violazioni del regolamento",
            paragraphs: ["In caso di violazione di queste regole, il proprietario si riserva il diritto di:"],
            bullets: [
              "Terminare immediatamente il contratto di alloggio.",
              "Richiedere che l'ospite lasci l'appartamento senza rimborso.",
              "Informare le autorità competenti, inclusi la polizia e l'ispettorato del turismo.",
            ],
          },
          {
            heading: "10. Accettazione",
            paragraphs: [
              "Soggiornando nell'appartamento, l'ospite conferma di aver letto, compreso e accettato di rispettare integralmente questo documento sul regolamento della casa.",
            ],
          },
        ],
        footerNote: ["© 2025 Apartments Ivica – Tutti i diritti riservati"],
      },
    },
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
