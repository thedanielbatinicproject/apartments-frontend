import type { Dictionary } from "./en";

export const de = {
  nav: {
    home: "Startseite",
    apartments: "Apartments",
    about: "Über Šibenik",
    contact: "Kontakt",
    book: "Jetzt buchen",
  },

  home: {
    hero: {
      greetingMorning: "Guten Morgen!",
      greetingDay: "Guten Tag!",
      greetingEvening: "Guten Abend!",
      greetingNight: "Willkommen, Nachteule!",
      tagline: "Drei familiengeführte Apartments im Herzen der steinernen Altstadt von Šibenik.",
      scrollCue: "Sehen Sie sich um",
    },

    apartments: {
      eyebrow: "Ihr Zuhause auf Zeit",
      title: "Drei Zuhause in der Altstadt",
      subtitle: "Familiengeführt, im Viertel Plišac — Altstadt, Kathedrale und Meer sind nur einen kurzen Spaziergang entfernt.",
      guestsLabel: "Gäste",
      roomsLabel: "Zimmer",
      cta: "Apartment ansehen",
      error: "Die Apartments konnten gerade nicht geladen werden.",
      retry: "Erneut versuchen",
      empty: "Derzeit sind keine Apartments verfügbar.",
    },

    about: {
      eyebrow: "Direkt vor Ihrer Tür",
      title: "Eine tausend Jahre alte Stadt",
      text: "Gegründet durch die Urkunde eines kroatischen Königs im Jahr 1066, bewacht von vier Festungen, gekrönt von einer UNESCO-Kathedrale aus reinem Stein — und all das beginnt am Ende Ihrer Straße.",
      cta: "Šibenik entdecken",
    },

    contact: {
      title: "Fragen vor der Buchung?",
      text: "Schreiben Sie uns direkt — wir helfen Ihnen gerne, das passende Apartment zu finden.",
      cta: "Kontakt aufnehmen",
      footerTagline: "Mit Liebe, aus Šibenik",
    },
  },

  apartmentDetail: {
    backToList: "Alle Apartments",
    capacity: "{n} Gäste",
    rooms: "{n} Zimmer",
    amenitiesTitle: "Ausstattung",

    gallery: {
      empty: "Noch keine Fotos.",
    },

    calendar: {
      title: "Verfügbarkeit",
      legendFree: "Frei",
      legendBooked: "Belegt",
      bookHint: "Dieser Kalender dient nur zur Orientierung — buchen Sie über Airbnb.",
      error: "Der Kalender konnte gerade nicht geladen werden.",
      retry: "Erneut versuchen",
      weekdays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    },

    reviews: {
      title: "Gästebewertungen",
      empty: "Noch keine Bewertungen.",
      error: "Bewertungen konnten gerade nicht geladen werden.",
      retry: "Erneut versuchen",
      upvote: "Hilfreich",
      averageSuffix: "/ 5 · {n} Bewertungen",
    },

    airbnb: {
      title: "Auf Airbnb buchen",
      text: "Buchungen für dieses Apartment laufen über Airbnb.",
      viewOnAirbnb: "Auf Airbnb ansehen",
      tapHint: "Tippen Sie auf die Karte, um das vollständige Inserat auf Airbnb zu öffnen",
      unavailable: "Der Airbnb-Link ist noch nicht verfügbar.",
    },

    notFound: {
      title: "Apartment nicht gefunden",
      text: "Dieses Apartment existiert nicht oder ist nicht mehr gelistet.",
      back: "Zurück zu den Apartments",
    },
  },

  aboutPage: {
    hero: {
      eyebrow: "Die Stadt vor Ihrer Tür",
      title: "Šibenik",
      subtitle: "Tausend Jahre alt, verteidigt von vier Festungen, und — unwahrscheinlicherweise — einst eine der am stärksten elektrifizierten Städte der Erde.",
    },

    history: {
      title: "Kroatisch von Anfang an",
      text: "Die meisten Städte an dieser Küste wurden von Griechen, Illyrern oder Römern gegründet. Šibenik nicht — es wird erstmals am Weihnachtstag 1066 in einer Urkunde des kroatischen Königs Petar Krešimir IV. erwähnt, weshalb es noch heute „Krešimirs Stadt\" genannt wird. Bis zu einer Pestepidemie im 17. Jahrhundert war es die größte Stadt an der gesamten östlichen Adriaküste.",
    },

    siege: {
      eyebrow: "1647",
      title: "Die gescheiterte Belagerung",
      text: "Während des Kandischen Krieges belagerte eine osmanische Streitmacht von angeblich über 25.000 Soldaten Šibenik — verteidigt von weniger als 6.000 Bürgern. Die Mauern hielten stand. Das ist einer der Gründe, warum die Stadt bis heute vier Festungen statt Ruinen hat.",
    },

    innovation: {
      eyebrow: "1895",
      title: "Die Nacht, in der die Lichter angingen",
      text: "Ein Wasserkraftwerk am nahen Fluss Krka machte Šibenik zu einer der allerersten Städte der Welt mit öffentlicher Straßenbeleuchtung durch Wechselstrom — unter Nutzung desselben Wechselstromsystems, das Nikola Tesla gerade patentiert hatte, errichtet in derselben Ära wie das bahnbrechende Kraftwerk an den Niagarafällen.",
    },

    parachute: {
      eyebrow: "1617",
      title: "Der erste Fallschirmsprung",
      text: "Faust Vrančić, ein in Šibenik geborener Universalgelehrter, der sieben Sprachen sprach, zeichnete eine verfeinerte Version von Leonardo da Vincis Fallschirm-Konzept und nannte sie „Homo Volans\" — den Fliegenden Menschen. Mit etwa 65 Jahren sprang er dann tatsächlich damit von einem Turm in Venedig. Er überlebte. Es ist einer der frühesten dokumentierten Fallschirmsprünge der Geschichte.",
    },

    cathedral: {
      eyebrow: "UNESCO seit 2000",
      title: "Die Kathedrale des Heiligen Jakobus",
      text: "Zwischen 1431 und 1536 vollständig aus Stein errichtet — ohne einen einzigen Holzbalken oder Tropfen Mörtel im gewölbten Dach — ist sie eines der großen Renaissance-Werke Kroatiens, größtenteils das Werk des Baumeisters Juraj Dalmatinac. Blicken Sie zur Fassade hinauf und 71 in Stein gemeißelte Gesichter blicken zurück — und 2015 spielte der ganze Platz die Eisenbank von Braavos in Game of Thrones.",
    },

    fortresses: {
      title: "Vier Festungen am Horizont",
      intro: "Ein seltener Anblick für eine Stadt dieser Größe — alle vier stehen noch, drei mittelalterlich und eine als moderne Augmented-Reality-Ausstellung wiederbelebt.",
      barone: {
        eyebrow: "Erbaut 1646",
        title: "Festung Barone",
        text: "1646 in aller Eile auf Befehl des Barons Christophe Martin von Degenfeld errichtet — eben jenes Kommandanten, dessen Verteidigung die oben geschilderte Belagerung brach. Seit ihrer vollständigen Restaurierung 2014 beherbergen ihre Bastionen eine Augmented-Reality-Ausstellung, die jene Schlacht nacherleben lässt, neben einer Terrasse mit heimischem Wein und Olivenöl bei der besten Aussicht der Stadt.",
      },
      stMichael: {
        title: "Festung St. Michael",
        text: "Dieser Hügel ist seit der Eisenzeit befestigt, und genau hier wurde Šibenik geboren — die oben erwähnte Urkunde von 1066 wurde innerhalb dieser Mauern unterzeichnet. 1663 schlug ein Blitz ins Pulverlager ein und sprengte die halbe Festung; was heute steht, ist größtenteils ein Wiederaufbau, jetzt eine Freiluftbühne für den Sommer.",
      },
      stJohn: {
        title: "Festung St. Johannes",
        text: "Sternförmig und 115 Meter hoch gelegen, erbaut in nur 45 Tagen, als sich die Bürger Šibeniks zusammenschlossen, um ihre eigene Stadt zu verteidigen. Ihre Wälle spielten Meereens Kampfgrube in Game of Thrones, mit Daenerys, die genau von diesen Mauern aus zusah.",
      },
      stNicholas: {
        eyebrow: "UNESCO seit 2017",
        title: "Festung St. Nikolaus",
        text: "Bewacht seit 1540 die Einfahrt zum Kanal des Heiligen Antonius, nur mit dem Boot erreichbar. 2017 gesellte sie sich zur Kathedrale als Šibeniks zweite UNESCO-Welterbestätte.",
      },
    },

    nature: {
      title: "Ausflüge direkt vor der Tür",
      krka: {
        title: "Nationalpark Krka",
        text: "Rund 17 km landeinwärts stürzt der Fluss Krka über den Skradinski buk — die längste Sinterwasserfall-Barriere Europas. Baden ist dort nicht mehr erlaubt: Seit 2021 gesperrt, um das lebende Moos zu schützen, das die Gesteinsbarrieren selbst noch immer langsam aufbaut.",
      },
      kornati: {
        title: "Die Kornaten-Inseln",
        text: "Ein Archipel aus 89 unbewohnten Inseln, Inselchen und Riffen — seit 1980 Nationalpark, umgeben von schroffen Kalksteinklippen und berühmt klarem Wasser, nur mit dem Boot erreichbar.",
      },
    },

    quest: {
      eyebrow: "Spielen",
      title: "Fliegen Sie die Tour",
      instruction: "Tippen, klicken oder die Leertaste drücken zum Flügelschlag — Sie steuern nur die Höhe, die Küste läuft von selbst vorbei.",
      start: "Flug starten",
      progress: "{n} / {total} entdeckt",
      lockedLabel: "Sehenswürdigkeit {n}",
      lockedHint: "Fliegen Sie hindurch, um sie aufzudecken",
      replay: "Noch einmal fliegen",
      complete: {
        title: "Kreis geschlossen!",
        text: "Jetzt wissen Sie, warum Šibenik einzigartig ist.",
      },
      landmarks: {
        cathedral: "2015 spielte dieser Platz die Eisenbank von Braavos in Game of Thrones.",
        stMichael: "Befestigt seit der Eisenzeit — und 1663 durch einen Blitzschlag gesprengt.",
        stJohn: "In nur 45 Tagen erbaut — spielte später Meereens Kampfgrube im Bild.",
        stNicholas: "Šibeniks zweite UNESCO-Stätte — nur mit dem Boot erreichbar.",
        siege: "1647: 6.000 Verteidiger hielten über 25.000 Angreifern stand.",
        barone: "Benannt nach dem Kommandanten, der eben diese Belagerung brach.",
        innovation: "1895: eine der ersten wechselstrombetriebenen Städte der Erde.",
        parachute: "1617: Ein gebürtiger Šibeniker sprang mit Fallschirm von einem Turm in Venedig — und überlebte.",
        krka: "Die Wasserfälle sind seit 2021 zum Baden gesperrt.",
        kornati: "89 unbewohnte Inseln, nur mit dem Boot erreichbar.",
      },
    },
  },

  kontaktPage: {
    hero: {
      eyebrow: "Sagen Sie Hallo",
      title: "Kontaktieren Sie uns",
      text: "Apartments Šibenik ist ein kleiner, familiengeführter Betrieb — wenn Sie uns schreiben oder anrufen, sprechen Sie direkt mit uns, nicht mit einer Buchungsstelle.",
    },
    hosts: {
      title: "Ihre Gastgeber",
      callLabel: "Anrufen",
      emailLabel: "E-Mail",
      whatsappLabel: "WhatsApp",
    },
    address: {
      title: "So finden Sie uns",
      directions: "Route anzeigen",
    },
    note: "Lieber über Airbnb? Dieselben Apartments finden Sie auch dort — den Link finden Sie auf der Seite jedes Apartments.",
  },

  checkin: {
    title: "Gäste-Check-in",

    stay: {
      title: "Ihr Aufenthalt",
      subtitle: "Wann sind Sie bei uns?",
      arrival: "Anreise",
      departure: "Abreise",
      night: "Nacht",
      nights: "Nächte",
      suggested: "Wir haben die Daten der aktuellen Buchung vorausgefüllt — passen Sie sie bei Bedarf an.",
      invalidRange: "Die Abreise muss nach der Anreise liegen.",
    },

    consent: {
      title: "Ihre Privatsphäre",
      text: "Das kroatische Gesetz verpflichtet uns, jeden Gast zu registrieren (eVisitor, Kurtaxengesetz). Ihre Daten werden ausschließlich für diese gesetzliche Pflicht verwendet — wir bewahren sie nicht auf: Dokumentenfotos und persönliche Daten werden innerhalb von 10 Tagen nach Ihrer Abreise automatisch von unseren Servern gelöscht.",
      checkbox: "Ich stimme der Verarbeitung meiner Daten zur Gästeregistrierung zu",
    },

    start: "Check-in starten",

    method: {
      title: "Wie möchten Sie einchecken?",
      recommended: "Am schnellsten",
      scanTitle: "Dokument scannen",
      scanDesc: "Richten Sie die Kamera auf Ihren Ausweis — die Daten werden automatisch ausgefüllt.",
      manualTitle: "Daten manuell eingeben",
      manualDesc: "Kein Dokument zur Hand? Nutzen Sie ein kurzes Formular.",
    },

    docType: {
      title: "Welches Dokument scannen Sie?",
      idCard: "Personalausweis",
      passport: "Reisepass",
      drivingLicence: "Führerschein",
      bothSides: "Vorder- und Rückseite",
      oneSide: "nur Fotoseite",
    },

    camera: {
      frontSide: "Vorderseite",
      backSide: "Rückseite",
      passportPage: "Fotoseite",
      fitFrame: "Dokument in den Rahmen einpassen",
      tooDark: "Zu dunkel — schalten Sie Licht ein oder gehen Sie ans Fenster.",
      confirmQuestion: "Ist das Dokument scharf und vollständig im Rahmen?",
      openCamera: "Kamera öffnen",
      unavailable: "Kamera nicht verfügbar. Prüfen Sie die Kameraberechtigung oder geben Sie die Daten manuell ein.",
      manualFallback: "Lieber manuell eingeben",
    },

    processing: {
      title: "Dokument wird gelesen…",
      hint: "Das dauert in der Regel wenige Sekunden.",
    },

    scanFailed: {
      title: "Dokument konnte nicht gelesen werden",
      text: "Das Foto ist möglicherweise unscharf oder das Licht zu schwach. Versuchen Sie es erneut oder tippen Sie die Daten einfach ein.",
      tryAgain: "Erneut scannen",
      goManual: "Daten manuell eingeben",
    },

    review: {
      title: "Daten überprüfen",
      subtitle: "Prüfen Sie, ob alles mit Ihrem Dokument übereinstimmt, und bestätigen Sie.",
      missingHint: "Dieses Feld konnten wir nicht lesen — bitte ergänzen.",
      confirm: "Daten bestätigen",
    },

    manual: {
      title: "Daten eingeben",
      subtitle: "Geben Sie die Daten genau so ein, wie sie auf dem Dokument stehen.",
      submit: "Weiter",
    },

    fields: {
      fullName: "Vor- und Nachname",
      dateOfBirth: "Geburtsdatum",
      placeOfBirth: "Geburtsort",
      placeOfResidence: "Wohnort",
      placeOfResidenceHint: "Ort oder Stadt, dann Land — z. B. Berlin, Deutschland",
      documentType: "Dokumenttyp",
      documentNumber: "Dokumentnummer",
      nationality: "Staatsangehörigkeit",
    },

    success: {
      title: "Check-in abgeschlossen!",
      verifiedText: "Alles erledigt. Genießen Sie Ihren Aufenthalt!",
      reviewText: "Fast fertig — Ihr Gastgeber prüft die Angaben kurz. Sie müssen nichts weiter tun. Genießen Sie Ihren Aufenthalt!",
      anotherQuestion: "Wohnt noch jemand bei Ihnen?",
      addAnother: "Weiteren Gast einchecken",
      finish: "Fertig",
    },

    newGuest: {
      title: "Neuer Gast, gleicher Aufenthalt",
      subtitle: "Die Daten bleiben gleich — jeder Gast gibt seine eigene Einwilligung.",
    },

    errors: {
      generic: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
      network: "Server nicht erreichbar. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
      expired: "Diese Check-in-Sitzung ist abgelaufen. Bitte beginnen Sie erneut.",
      startOver: "Neu beginnen",
    },

    cancel: {
      title: "Check-in abbrechen?",
      text: "Ihr bisheriger Fortschritt wird verworfen. Sie können jederzeit neu beginnen.",
      confirmButton: "Ja, abbrechen",
      dismissButton: "Nein, weiter",
    },

    common: {
      back: "Zurück",
      continue: "Weiter",
      retry: "Erneut versuchen",
      loading: "Wird geladen…",
      cancelCheckin: "Check-in abbrechen",
    },
  },

  checkInvoice: {
    title: "Rechnung prüfen",
    subtitle: "Geben Sie den auf Ihrer Rechnung aufgedruckten Code ein",
    codeHint: "8-stelliger Code, z. B. E710-59DE",
    verifying: "Wird geprüft…",
    incomplete: "Geben Sie alle 8 Zeichen des Codes ein.",

    keypad: {
      backspace: "Löschen",
      clear: "Zurücksetzen",
    },

    result: {
      validTitle: "Rechnung bestätigt",
      validText: "Dies ist eine echte, ausgestellte Rechnung.",
      cancelledTitle: "Rechnung storniert",
      cancelledText: "Diese Rechnung wurde vom Aussteller storniert und ist nicht mehr gültig.",
      notFoundTitle: "Rechnung nicht gefunden",
      notFoundText: "Wir konnten keine gültige Rechnung mit diesem Code finden. Prüfen Sie den Code und versuchen Sie es erneut.",
      checkAnother: "Weiteren Code prüfen",
    },

    fields: {
      documentNumber: "Belegnummer",
      invoiceDate: "Rechnungsdatum",
      issuedBy: "Ausgestellt von",
      recipient: "Empfänger",
      totalDue: "Gesamtbetrag",
      status: "Status",
    },

    status: {
      DRAFT: "Entwurf",
      ISSUED: "Ausgestellt",
      CANCELLED: "Storniert",
    },

    errors: {
      generic: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
      network: "Server nicht erreichbar. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    },
  },

  notFound: {
    title: "Seite nicht gefunden",
    description: "Die Seite „{path}“ existiert nicht oder wurde verschoben.",
    homeButton: "Zurück zur Startseite",
    adminButton: "Admin-Intranet",
    adminHint: "Suchen Sie das Admin-Intranet?",
    adminLinkText: "Hier klicken",
  },
} satisfies Dictionary;
