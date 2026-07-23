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

  houseRules: {
    eyebrow: "Gut zu wissen",
    title: "Hausordnung",
    subtitle: "Beide Apartments teilen sich dieselbe Adresse, werden aber separat inseriert und verwaltet. Wählen Sie den Gastgeber, der zu Ihrer Reservierung passt.",
    understand: "Verstanden",
    switchLabels: { brigita: "Brigita", ivica: "Ivica" },
    hosts: {
      brigita: {
        propertyName: "Apartments Brigita",
        ownerLabel: "Eigentümerin / Gastgeberin",
        ownerName: "Brigita Batinić",
        phone: "+385 98 910 5640",
        address: "Slobodana Macure 13, 22000 Šibenik, Kroatien",
        effective: "2025 und gültig bis auf Weiteres.",
        apartments: [
          {
            name: "Studio-Apartment",
            description: "Kapazität: bis zu 2 Erwachsene. Ein kompaktes und komfortables Apartment, ideal für Paare oder Alleinreisende, die Ruhe und Funktionalität suchen.",
          },
          {
            name: "Apartment mit Garten",
            description: "Kapazität: bis zu 3 Erwachsene oder 2 Erwachsene + 2 Kinder. Verfügt über einen privaten, umzäunten Garten zur exklusiven Nutzung durch die Gäste, vorbehaltlich der zusätzlichen Sicherheits- und Haftungsregeln weiter unten.",
          },
        ],
        sections: [
          {
            heading: "1. Allgemeine Bestimmungen",
            paragraphs: [
              "Diese Hausordnung legt die Verantwortlichkeiten von Gastgeberin und Gästen fest. Mit der Bestätigung einer Reservierung oder beim Check-in erkennt der Gast diese Bedingungen vollständig an. Ziel ist es, ein friedliches, sicheres und gesetzeskonformes Umfeld für alle Bewohner zu gewährleisten und die ordnungsgemäße Erhaltung von Eigentum und Ausstattung sicherzustellen.",
            ],
          },
          {
            heading: "2. Check-in, Check-out und Anmeldung",
            bullets: [
              "**Check-in:** ab 14:00 Uhr. **Check-out:** bis 10:00 Uhr am Abreisetag.",
              "Gäste müssen bei der Ankunft einen gültigen Ausweis zur Registrierung im **eVisitor**-System gemäß dem kroatischen Tourismusgesetz vorlegen.",
              "Nur registrierte Gäste dürfen übernachten. Besucher oder zusätzliche Personen müssen vorher von der Gastgeberin genehmigt werden.",
              "Die Nichteinhaltung der Registrierungspflicht kann zur Beendigung des Aufenthalts ohne Rückerstattung führen.",
            ],
          },
          {
            heading: "3. Nutzung der Räumlichkeiten und Verhalten",
            paragraphs: [
              "Von den Gästen wird erwartet, dass sie sich jederzeit höflich, respektvoll und verantwortungsbewusst verhalten. Die Unterkunft liegt in einem ruhigen Wohngebiet; daher ist die Wahrung von Ruhe und öffentlicher Ordnung eine gesetzliche und vertragliche Pflicht.",
            ],
            highlight: {
              bullets: [
                "Es ist **strengstens untersagt**, Partys, Zusammenkünfte oder Veranstaltungen mit nicht registrierten Besuchern, verstärkter Musik oder lauten geselligen Aktivitäten zu organisieren.",
                "Die Ruhezeiten gelten von **22:00 bis 8:00 Uhr**. In diesem Zeitraum müssen Gäste jeden Lärm vermeiden, der andere Gäste oder Nachbarn stören könnte — einschließlich lauter Gespräche, Möbelrücken oder laute Geräte.",
                "Gäste müssen jegliches beleidigende, aggressive oder bedrohliche Verhalten gegenüber der Gastgeberin, anderen Gästen oder Anwohnern unterlassen.",
                "Der Besitz oder Konsum illegaler Substanzen, Waffen, Feuerwerkskörper oder gefährlicher Materialien auf dem Grundstück ist **strengstens untersagt** und führt zu sofortiger Räumung und Meldung an die Polizei.",
                "Rauchen und Dampfen sind innerhalb der Apartments nicht gestattet. Rauchen ist nur an den dafür vorgesehenen Außenbereichen erlaubt. Unsachgemäße Entsorgung von Zigarettenstummeln kann zusätzliche Reinigungsgebühren nach sich ziehen.",
                "Gäste sind verpflichtet, gesunden Menschenverstand walten zu lassen und die örtlichen Sitten, Gesetze und Vorschriften für das Wohnverhalten in Kroatien zu respektieren.",
                "Die Nichteinhaltung der Verhaltensstandards kann zur Beendigung der Unterkunft ohne Rückerstattung und in schweren Fällen zur Meldung an die örtlichen Behörden führen.",
              ],
              outro: "**Hinweis:** Die Gastgeberin behält sich das Recht vor, das Apartment bei schwerwiegenden Störungen, Sicherheitsbedenken oder dem Verdacht auf verbotene Aktivitäten zu betreten. Ein solcher Zutritt wird dokumentiert und ausschließlich zur Wahrung von Sicherheit und Einhaltung der Regeln gerechtfertigt.",
            },
          },
          {
            heading: "4. Pflege des Eigentums und Schäden",
            bullets: [
              "Gäste müssen Möbel, Geräte und das gesamte Inventar verantwortungsvoll und gemäß den bereitgestellten Anweisungen behandeln.",
              "Jeder Schaden, jede Fehlfunktion oder jeder Verlust muss sofort gemeldet werden. Unterlassene Meldung kann zu Kosten nach dem Check-out führen.",
              "Gäste haften finanziell für alle Schäden, die durch Fahrlässigkeit, Missbrauch oder Vorsatz verursacht werden.",
              "Kein Gegenstand (z. B. Handtücher, Küchengeschirr, Dekoration) darf aus der Unterkunft entfernt werden.",
            ],
          },
          {
            heading: "5. Sauberkeit und Instandhaltung",
            bullets: [
              "Die Apartments werden vor der Ankunft professionell gereinigt. Gäste sollten die Sauberkeit während des Aufenthalts aufrechterhalten.",
              "Entsorgen Sie Abfall ordnungsgemäß und recyceln Sie, wo möglich. Essensreste, Öl und Hygieneartikel dürfen niemals über Toilette oder Abfluss entsorgt werden.",
              "Zusätzliche Reinigungsgebühren können anfallen, wenn das Apartment übermäßig verschmutzt, verfleckt, übelriechend oder die Ausstattung unsachgemäß genutzt hinterlassen wird.",
            ],
          },
          {
            heading: "6. Garten und Außenbereich (Apartment mit Garten)",
            bullets: [
              "Der Garten steht ausschließlich den Gästen des Apartments mit Garten zur Verfügung. Kinder müssen stets von einem Erwachsenen beaufsichtigt werden.",
              "Offenes Feuer ist verboten, außer bei sicherer Nutzung des dafür vorgesehenen Grillbereichs. Lassen Sie ein Feuer niemals unbeaufsichtigt und löschen Sie es nach Gebrauch vollständig.",
              "Pflanzen dürfen nicht beschädigt oder gepflückt werden, Glas darf nicht in der Nähe von Rasenflächen verwendet und Gartenmöbel dürfen nicht versetzt werden.",
              "Die Gastgeberin übernimmt keine Haftung für Unfälle infolge unsicheren oder fahrlässigen Verhaltens im Garten.",
            ],
          },
          {
            heading: "7. Haftung und Versicherung",
            bullets: [
              "Die Gastgeberin haftet nicht für Diebstahl, Verlust oder Beschädigung persönlicher Gegenstände. Gästen wird empfohlen, Wertsachen zu sichern und eine gültige Reiseversicherung abzuschließen.",
              "Gäste haften vollständig für alle Schäden, Verletzungen oder Vorfälle, die aus ihrem Handeln oder ihrer Fahrlässigkeit resultieren.",
            ],
          },
          {
            heading: "8. Schlüssel und Sicherheit",
            bullets: [
              "Gäste sind für alle ausgehändigten Schlüssel verantwortlich. Verlorene Schlüssel ziehen eine Gebühr von mindestens **30 €** nach sich.",
              "Verschließen Sie beim Verlassen der Unterkunft stets Türen und Fenster.",
              "Zugangscodes oder Schlüssel dürfen nicht vervielfältigt oder an nicht registrierte Personen weitergegeben werden.",
            ],
          },
          {
            heading: "9. Notfälle",
            bullets: [
              "Wählen Sie im Notfall **112** (einheitliche Notrufnummer in Kroatien).",
              "Kontaktieren Sie die Gastgeberin sofort bei dringenden Problemen mit der Unterkunft oder Sicherheitsbedenken: **+385 98 910 5640**.",
            ],
          },
          {
            heading: "10. Regelverstöße",
            bullets: [
              "Die Gastgeberin kann die Unterkunft bei schwerwiegenden Verstößen wie rechtswidrigem Verhalten, Sachschäden oder Lärmverstößen ohne Rückerstattung beenden.",
              "Kosten für Schäden, zusätzliche Reinigung oder verlorene Gegenstände werden entsprechend in Rechnung gestellt.",
              "Schwerwiegende oder strafbare Handlungen werden der Polizei und der Tourismusinspektion gemeldet.",
            ],
          },
          {
            heading: "11. Schlussbestimmungen",
            paragraphs: [
              "Diese Hausordnung ist wesentlicher Bestandteil des Beherbergungsvertrags zwischen dem Gast und Apartments Brigita. Alle Streitigkeiten unterliegen kroatischem Recht. Mit Abschluss des Check-ins bestätigen die Gäste, dass sie alle Bestimmungen gelesen und akzeptiert haben.",
            ],
          },
        ],
        footerNote: [
          "© 2025 Apartmani Brigita — Alle Rechte vorbehalten",
          "Adresse: Slobodana Macure 13, 22000 Šibenik, Kroatien • Eigentümerin: Brigita Batinić • Telefon: +385 98 910 5640",
        ],
      },
      ivica: {
        propertyName: "Apartments Ivica",
        ownerLabel: "Eigentümer",
        ownerName: "Ivica Batinić",
        phone: "+385 99 593 7343",
        address: "Slobodana Macure 13, 22000 Šibenik, Kroatien",
        sections: [
          {
            heading: "1. Allgemeine Bestimmungen",
            paragraphs: [
              "Willkommen in den Apartments Ivica. Diese Hausordnung gewährleistet einen komfortablen, sicheren und rechtmäßigen Aufenthalt für alle Gäste. Mit dem Aufenthalt im Apartment bestätigt jeder Gast, dass er diese Regeln gelesen und verstanden hat und sich während der gesamten Dauer seines Aufenthalts daran hält.",
            ],
          },
          {
            heading: "2. Check-in und Check-out",
            bullets: [
              "Der Check-in ist ab **14:00 Uhr** am Anreisetag möglich.",
              "Der Check-out muss bis **10:00 Uhr** am Abreisetag abgeschlossen sein.",
              "Alle Gäste müssen einen gültigen Ausweis oder Reisepass zur Registrierung im **eVisitor**-System vorlegen.",
              "Nur registrierte Gäste dürfen im Apartment übernachten.",
              "Jede Änderung der Personenzahl muss dem Eigentümer sofort gemeldet werden.",
            ],
          },
          {
            heading: "3. Verbot von Besuchern, Partys und Zusammenkünften",
            highlight: {
              intro: "Strengstens untersagt:",
              bullets: [
                "Das Mitbringen nicht registrierter Personen in das Apartment (auch nur vorübergehend).",
                "Das Veranstalten von Partys, Zusammenkünften, Feiern oder jeglicher Art von Gruppenaktivitäten.",
                "Die Beteiligung an unangemessenen oder illegalen Aktivitäten, einschließlich, aber nicht beschränkt auf das Anbieten oder die Nutzung sexueller Dienstleistungen, Drogenmissbrauch oder jegliches Verhalten, das die öffentliche Ordnung stört oder gegen kroatisches Recht verstößt.",
              ],
              outro: "Jeder Verstoß gegen diese Regel führt zur **sofortigen Beendigung des Mietvertrags ohne Rückerstattung**, und der Eigentümer behält sich das Recht vor, **Strafverfolgungsbehörden zu kontaktieren** und rechtswidriges Verhalten zu melden.",
            },
          },
          {
            heading: "4. Hausordnung und Verhalten",
            bullets: [
              "Bitte reduzieren Sie Lärm zwischen **22:00 und 8:00 Uhr** auf ein Minimum.",
              "Rauchen im Apartment ist **nicht gestattet**.",
              "Illegale Substanzen oder Gegenstände sind strengstens untersagt.",
              "Gäste müssen das Apartment und dessen Inventar sorgfältig behandeln und jeden Schaden sofort melden.",
              "Kosten für Reparatur oder Ersatz aufgrund von Fahrlässigkeit des Gastes werden dem Gast in Rechnung gestellt.",
            ],
          },
          {
            heading: "5. Ausstattung des Apartments",
            bullets: [
              "Das Apartment umfasst: 2 Betten, ein Badezimmer mit WC und eine Kochnische.",
              "Nutzen Sie alle Geräte und Möbel verantwortungsvoll.",
              "Schalten Sie Licht, Klimaanlage und elektrische Geräte aus, wenn Sie das Apartment verlassen.",
              "Entfernen Sie keine Gegenstände aus dem Apartment.",
            ],
          },
          {
            heading: "6. Haftung",
            bullets: [
              "Der Eigentümer haftet nicht für Verlust oder Diebstahl persönlicher Gegenstände.",
              "Der Eigentümer haftet nicht für Verletzungen, die durch Fahrlässigkeit des Gastes verursacht wurden.",
              "Gäste müssen das Apartment abschließen und die Schlüssel sicher aufbewahren. Ein verlorener Schlüssel zieht eine Ersatzgebühr von **30 €** nach sich.",
            ],
          },
          {
            heading: "7. Sauberkeit und Instandhaltung",
            bullets: [
              "Das Apartment wird gereinigt und die Bettwäsche vor jedem neuen Aufenthalt gewechselt.",
              "Zusätzliche Reinigung kann auf Anfrage vereinbart werden.",
              "Entsorgen Sie keinen Abfall oder Essensreste über Toilette oder Abfluss.",
            ],
          },
          {
            heading: "8. Sicherheit",
            bullets: [
              "Kontaktieren Sie bei Feuer oder Notfall sofort den Eigentümer und den Notdienst (**112**).",
              "Manipulieren Sie keine elektrischen oder Wasserinstallationen.",
            ],
          },
          {
            heading: "9. Folgen von Regelverstößen",
            paragraphs: ["Im Falle eines Verstoßes gegen diese Regeln behält sich der Eigentümer das Recht vor:"],
            bullets: [
              "Die Unterkunftsvereinbarung sofort zu beenden.",
              "Zu verlangen, dass der Gast das Apartment ohne Rückerstattung verlässt.",
              "Die zuständigen Behörden, einschließlich Polizei und Tourismusinspektion, zu benachrichtigen.",
            ],
          },
          {
            heading: "10. Annahme",
            paragraphs: [
              "Mit dem Aufenthalt im Apartment bestätigt der Gast, dass er dieses Hausordnungsdokument vollständig gelesen, verstanden und akzeptiert hat.",
            ],
          },
        ],
        footerNote: ["© 2025 Apartments Ivica – Alle Rechte vorbehalten"],
      },
    },
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
