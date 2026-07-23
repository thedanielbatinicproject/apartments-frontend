import type { Dictionary } from "./en";

export const fr = {
  nav: {
    home: "Accueil",
    apartments: "Appartements",
    about: "À propos de Šibenik",
    contact: "Contact",
    book: "Réserver",
  },

  home: {
    hero: {
      greetingMorning: "Bonjour !",
      greetingDay: "Bon après-midi !",
      greetingEvening: "Bonsoir !",
      greetingNight: "Bienvenue, oiseau de nuit !",
      tagline: "Trois appartements familiaux au cœur de la vieille ville de pierre de Šibenik.",
      scrollCue: "Faites le tour",
    },

    apartments: {
      eyebrow: "Là où vous séjournerez",
      title: "Trois maisons dans la vieille ville",
      subtitle: "Tenus en famille, dans le quartier de Plišac — la vieille ville, la cathédrale et la mer sont à quelques minutes à pied.",
      guestsLabel: "Personnes",
      roomsLabel: "Pièces",
      cta: "Voir l'appartement",
      error: "Impossible de charger les appartements pour le moment.",
      retry: "Réessayer",
      empty: "Aucun appartement disponible pour le moment.",
    },

    about: {
      eyebrow: "Juste devant votre porte",
      title: "Une ville millénaire",
      text: "Fondée par la charte d'un roi croate en 1066, gardée par quatre forteresses, couronnée d'une cathédrale UNESCO tout en pierre — et tout cela commence au bout de votre rue.",
      cta: "Découvrir Šibenik",
    },

    contact: {
      title: "Des questions avant de réserver ?",
      text: "Écrivez-nous directement — nous serons ravis de vous aider à choisir le bon appartement.",
      cta: "Nous contacter",
      footerTagline: "Avec amour, depuis Šibenik",
    },
  },

  apartmentDetail: {
    backToList: "Tous les appartements",
    capacity: "{n} personnes",
    rooms: "{n} pièces",
    amenitiesTitle: "Équipements",

    gallery: {
      empty: "Aucune photo pour le moment.",
    },

    calendar: {
      title: "Disponibilité",
      legendFree: "Libre",
      legendBooked: "Réservé",
      bookHint: "Ce calendrier est fourni à titre indicatif — réservez via Airbnb.",
      error: "Impossible de charger le calendrier pour le moment.",
      retry: "Réessayer",
      weekdays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    },

    reviews: {
      title: "Avis des voyageurs",
      empty: "Aucun avis pour le moment.",
      error: "Impossible de charger les avis pour le moment.",
      retry: "Réessayer",
      upvote: "Utile",
      averageSuffix: "/ 5 · {n} avis",
    },

    airbnb: {
      title: "Réserver sur Airbnb",
      text: "Les réservations pour cet appartement se font via Airbnb.",
      viewOnAirbnb: "Voir sur Airbnb",
      tapHint: "Touchez la carte pour ouvrir l'annonce complète sur Airbnb",
      unavailable: "Le lien de l'annonce Airbnb n'est pas encore disponible.",
    },

    notFound: {
      title: "Appartement introuvable",
      text: "Cet appartement n'existe pas ou n'est plus disponible.",
      back: "Retour aux appartements",
    },
  },

  aboutPage: {
    hero: {
      eyebrow: "La ville devant votre porte",
      title: "Šibenik",
      subtitle: "Millénaire, défendue par quatre forteresses, et — chose improbable — autrefois l'une des villes les plus électrifiées de la planète.",
    },

    history: {
      title: "Croate depuis toujours",
      text: "La plupart des villes de cette côte ont été fondées par les Grecs, les Illyriens ou les Romains. Pas Šibenik — mentionnée pour la première fois le jour de Noël 1066 dans une charte du roi croate Petar Krešimir IV, d'où son surnom de « ville de Krešimir ». Jusqu'à une épidémie de peste au XVIIe siècle, elle fut la plus grande ville de toute la côte adriatique orientale.",
    },

    siege: {
      eyebrow: "1647",
      title: "Le siège qui a échoué",
      text: "Pendant la guerre de Crète, une force ottomane forte de plus de 25 000 soldats assiégea Šibenik — défendue par moins de 6 000 habitants. Les remparts tinrent bon. C'est l'une des raisons pour lesquelles la ville compte encore quatre forteresses au lieu de ruines.",
    },

    innovation: {
      eyebrow: "1895",
      title: "La nuit où les lumières se sont allumées",
      text: "Une centrale hydroélectrique sur la rivière Krka toute proche fit de Šibenik l'une des toutes premières villes au monde dotée d'un éclairage public en courant alternatif — utilisant le même système CA que Nikola Tesla venait de breveter, construite à la même époque que la centrale pionnière des chutes du Niagara.",
    },

    parachute: {
      eyebrow: "1617",
      title: "Le premier saut en parachute",
      text: "Faust Vrančić, un polymathe né à Šibenik parlant sept langues, dessina une version perfectionnée du concept de parachute de Léonard de Vinci et l'appela « Homo Volans » — l'Homme volant. Puis, à environ 65 ans, il sauta réellement d'une tour à Venise en le portant. Il survécut. C'est l'un des premiers sauts en parachute enregistrés de l'histoire.",
    },

    cathedral: {
      eyebrow: "UNESCO depuis 2000",
      title: "La cathédrale Saint-Jacques",
      text: "Édifiée entièrement en pierre entre 1431 et 1536 — sans une seule poutre de bois ni une goutte de mortier dans sa voûte — c'est l'une des grandes réalisations de la Renaissance croate, en grande partie l'œuvre du maître bâtisseur Juraj Dalmatinac. Levez les yeux vers la façade : 71 visages sculptés dans la pierre vous observent — et en 2015, toute la place a incarné la Banque de Fer de Braavos dans Game of Thrones.",
    },

    fortresses: {
      title: "Quatre forteresses sur l'horizon",
      intro: "Un spectacle rare pour une ville de cette taille — les quatre sont encore debout : trois médiévales, une renaissante en exposition de réalité augmentée.",
      barone: {
        eyebrow: "Construite en 1646",
        title: "La forteresse Barone",
        text: "Édifiée à la hâte en 1646 sur ordre du baron Christophe Martin von Degenfeld — le commandant même dont la défense brisa le siège évoqué plus haut. Entièrement restaurée en 2014, ses bastions abritent aujourd'hui une exposition en réalité augmentée qui rejoue cette bataille, à côté d'une terrasse servant vin et huile d'olive locaux avec la plus belle vue de la ville.",
      },
      stMichael: {
        title: "La forteresse Saint-Michel",
        text: "Cette colline est fortifiée depuis l'âge du fer, et c'est là que Šibenik est née — la charte de 1066 évoquée plus haut fut signée entre ces murs. En 1663, la foudre frappa la poudrière et souffla la moitié de la forteresse ; ce qui se dresse aujourd'hui est en grande partie une reconstruction, désormais une scène d'été en plein air.",
      },
      stJohn: {
        title: "La forteresse Saint-Jean",
        text: "En forme d'étoile, à 115 mètres de haut, érigée en seulement 45 jours lorsque les habitants de Šibenik se sont unis pour défendre leur ville. Ses remparts ont incarné la fosse aux combats de Meereen dans Game of Thrones, avec Daenerys observant depuis ces mêmes murs.",
      },
      stNicholas: {
        eyebrow: "UNESCO depuis 2017",
        title: "La forteresse Saint-Nicolas",
        text: "Elle garde l'entrée du chenal Saint-Antoine depuis 1540, accessible uniquement par bateau. En 2017, elle a rejoint la cathédrale comme deuxième site classé au patrimoine mondial de l'UNESCO de Šibenik.",
      },
    },

    nature: {
      title: "Excursions à deux pas",
      krka: {
        title: "Le parc national de Krka",
        text: "À environ 17 km à l'intérieur des terres, la rivière Krka dévale les chutes de Skradinski buk — la plus longue barrière de travertin d'Europe. On ne peut plus s'y baigner : interdit depuis 2021, pour protéger la mousse vivante qui continue de bâtir lentement ces barrières de pierre.",
      },
      kornati: {
        title: "Les îles Kornati",
        text: "Un archipel de 89 îles, îlots et récifs inhabités — parc national depuis 1980, ceint de falaises calcaires abruptes et réputé pour son eau limpide, accessible uniquement par bateau.",
      },
    },

    quest: {
      eyebrow: "Jouer",
      title: "Envolez-vous pour la quête",
      instruction: "Touchez, cliquez ou appuyez sur espace pour battre des ailes — vous ne contrôlez que l'altitude, le littoral défile tout seul.",
      start: "Commencer le vol",
      progress: "{n} / {total} découverts",
      lockedLabel: "Site {n}",
      lockedHint: "Traversez-le en vol pour le révéler",
      replay: "Voler à nouveau",
      complete: {
        title: "Boucle complète !",
        text: "Vous savez maintenant pourquoi Šibenik est unique.",
      },
      landmarks: {
        cathedral: "En 2015, cette place a incarné la Banque de Fer de Braavos dans Game of Thrones.",
        stMichael: "Fortifiée depuis l'âge du fer — et soufflée par la foudre en 1663.",
        stJohn: "Construite en 45 jours pile — elle a ensuite incarné la fosse aux combats de Meereen à l'écran.",
        stNicholas: "Le deuxième site UNESCO de Šibenik — accessible uniquement par bateau.",
        siege: "1647 : 6 000 défenseurs ont résisté à plus de 25 000 assaillants.",
        barone: "Nommée d'après le commandant qui a brisé ce siège même.",
        innovation: "1895 : l'une des premières villes électrifiées en courant alternatif au monde.",
        parachute: "1617 : un enfant de Šibenik a sauté d'une tour à Venise en parachute — et a survécu.",
        krka: "Ses chutes sont interdites à la baignade depuis 2021.",
        kornati: "89 îles inhabitées, accessibles uniquement par bateau.",
      },
    },
  },

  kontaktPage: {
    hero: {
      eyebrow: "Dites bonjour",
      title: "Contactez-nous",
      text: "Apartments Šibenik est une petite affaire familiale — quand vous nous écrivez ou nous appelez, vous parlez directement à nous, pas à un centre de réservation.",
    },
    hosts: {
      title: "Vos hôtes",
      callLabel: "Appeler",
      emailLabel: "E-mail",
      whatsappLabel: "WhatsApp",
    },
    address: {
      title: "Nous trouver",
      directions: "Itinéraire",
    },
    note: "Vous préférez Airbnb ? Les mêmes appartements y sont aussi listés — retrouvez le lien sur la page de chaque appartement.",
  },

  houseRules: {
    eyebrow: "Bon à savoir",
    title: "Règlement intérieur",
    subtitle: "Les deux appartements partagent la même adresse mais sont annoncés et gérés séparément. Choisissez l'hôte correspondant à votre réservation.",
    understand: "J'ai compris",
    switchLabels: { brigita: "Brigita", ivica: "Ivica" },
    hosts: {
      brigita: {
        propertyName: "Apartments Brigita",
        ownerLabel: "Propriétaire / Hôtesse",
        ownerName: "Brigita Batinić",
        phone: "+385 98 910 5640",
        address: "Slobodana Macure 13, 22000 Šibenik, Croatie",
        effective: "2025, valable jusqu'à nouvel ordre.",
        apartments: [
          {
            name: "Appartement Studio",
            description: "Capacité : jusqu'à 2 adultes. Un appartement compact et confortable, idéal pour les couples ou les voyageurs seuls en quête de tranquillité et de fonctionnalité.",
          },
          {
            name: "Appartement avec jardin",
            description: "Capacité : jusqu'à 3 adultes ou 2 adultes + 2 enfants. Comprend un jardin privé clos à l'usage exclusif des hôtes, sous réserve des règles de sécurité et de responsabilité supplémentaires décrites ci-dessous.",
          },
        ],
        sections: [
          {
            heading: "1. Dispositions générales",
            paragraphs: [
              "Ce règlement intérieur définit les responsabilités de l'hôtesse et des hôtes. En confirmant une réservation ou en effectuant le check-in, l'hôte reconnaît accepter pleinement ces conditions. L'objectif est de maintenir un environnement paisible, sûr et légal pour tous les occupants, et d'assurer la bonne conservation du bien et des équipements.",
            ],
          },
          {
            heading: "2. Arrivée, départ et enregistrement",
            bullets: [
              "**Arrivée (check-in) :** à partir de 14h00. **Départ (check-out) :** avant 10h00 le jour du départ.",
              "Les hôtes doivent présenter une pièce d'identité valide à leur arrivée pour l'enregistrement dans le système **eVisitor**, conformément à la loi croate sur le tourisme.",
              "Seuls les hôtes enregistrés sont autorisés à passer la nuit. Les visiteurs ou personnes supplémentaires doivent être approuvés au préalable par l'hôtesse.",
              "Le non-respect de l'obligation d'enregistrement peut entraîner la résiliation du séjour sans remboursement.",
            ],
          },
          {
            heading: "3. Usage des lieux et comportement",
            paragraphs: [
              "Les hôtes sont tenus de se comporter avec courtoisie, respect et responsabilité en toutes circonstances. Le logement se situe dans un quartier résidentiel calme ; le maintien de la tranquillité et de l'ordre public constitue donc une obligation légale et contractuelle.",
            ],
            highlight: {
              bullets: [
                "Il est **strictement interdit** d'organiser des fêtes, réunions ou événements impliquant des visiteurs non enregistrés, de la musique amplifiée ou des activités bruyantes.",
                "Les heures de silence sont observées de **22h00 à 8h00**. Durant cette période, les hôtes doivent éviter tout bruit susceptible de déranger les autres hôtes ou les voisins — y compris les conversations bruyantes, le déplacement de meubles ou l'utilisation d'appareils bruyants.",
                "Les hôtes doivent s'abstenir de tout comportement offensant, agressif ou menaçant envers l'hôtesse, les autres hôtes ou les riverains.",
                "La possession ou l'usage de substances illégales, d'armes, de feux d'artifice ou de matières dangereuses sur les lieux est **strictement interdit** et entraînera une expulsion immédiate et un signalement à la police.",
                "Fumer et vapoter ne sont pas autorisés à l'intérieur des appartements. Il est uniquement permis de fumer dans les espaces extérieurs désignés. Une élimination inappropriée des mégots entraînera des frais de nettoyage supplémentaires.",
                "Les hôtes sont tenus de faire preuve de bon sens et de respecter les coutumes locales, les lois et les règlements régissant le comportement résidentiel en Croatie.",
                "Le non-respect des normes de comportement peut entraîner la résiliation de l'hébergement sans remboursement et, dans les cas graves, un signalement aux autorités locales.",
              ],
              outro: "**Remarque :** l'hôtesse se réserve le droit d'entrer dans l'appartement en cas de trouble grave, de préoccupation en matière de sécurité ou de soupçon d'activités interdites. Une telle entrée sera consignée et justifiée uniquement dans le but de garantir la sécurité et le respect du règlement.",
            },
          },
          {
            heading: "4. Entretien du bien et dommages",
            bullets: [
              "Les hôtes doivent manipuler les meubles, appareils et l'ensemble du mobilier de manière responsable et conformément aux instructions fournies.",
              "Tout dommage, dysfonctionnement ou perte doit être signalé immédiatement. Le fait de ne pas le signaler peut entraîner des frais après le départ.",
              "Les hôtes sont financièrement responsables de tout dommage causé par négligence, mauvais usage ou acte intentionnel.",
              "Ne déplacez ni n'emportez aucun objet (par exemple, serviettes, ustensiles de cuisine, décoration) hors du logement.",
            ],
          },
          {
            heading: "5. Propreté et entretien",
            bullets: [
              "Les appartements sont nettoyés professionnellement avant l'arrivée. Les hôtes doivent maintenir la propreté pendant leur séjour.",
              "Jetez les déchets correctement et recyclez lorsque cela est possible. Les restes alimentaires, l'huile et les articles sanitaires ne doivent jamais être jetés dans les toilettes ou les canalisations.",
              "Des frais de nettoyage supplémentaires peuvent s'appliquer si l'appartement est laissé excessivement sale, taché, malodorant ou en cas de mauvaise utilisation des équipements.",
            ],
          },
          {
            heading: "6. Jardin et espace extérieur (Appartement avec jardin)",
            bullets: [
              "Le jardin est réservé à l'usage exclusif des hôtes séjournant dans l'Appartement avec jardin. Les enfants doivent toujours être surveillés par un adulte.",
              "Le feu ouvert est interdit, sauf usage sûr de la zone barbecue prévue à cet effet. Ne laissez jamais un feu sans surveillance et éteignez-le complètement après usage.",
              "N'endommagez pas ou ne cueillez pas les plantes, n'utilisez pas de verre près des pelouses et ne déplacez pas le mobilier extérieur.",
              "L'hôtesse décline toute responsabilité pour les accidents résultant d'un comportement imprudent ou négligent dans le jardin.",
            ],
          },
          {
            heading: "7. Responsabilité et assurance",
            bullets: [
              "L'hôtesse n'est pas responsable du vol, de la perte ou de l'endommagement d'effets personnels. Il est conseillé aux hôtes de sécuriser leurs objets de valeur et de souscrire une assurance voyage valide.",
              "Les hôtes sont pleinement responsables de tout dommage, blessure ou incident résultant de leurs actes ou de leur négligence.",
            ],
          },
          {
            heading: "8. Clés et sécurité",
            bullets: [
              "Les hôtes sont responsables de toutes les clés remises. La perte d'une clé entraîne des frais minimums de **30 €**.",
              "Verrouillez toujours les portes et fenêtres en quittant les lieux.",
              "Les codes d'accès ou les clés ne doivent pas être dupliqués ni partagés avec des personnes non enregistrées.",
            ],
          },
          {
            heading: "9. Urgences",
            bullets: [
              "En cas d'urgence, composez le **112** (numéro d'urgence unique en Croatie).",
              "Contactez immédiatement l'hôtesse pour tout problème urgent concernant le logement ou toute préoccupation de sécurité : **+385 98 910 5640**.",
            ],
          },
          {
            heading: "10. Violations du règlement",
            bullets: [
              "L'hôtesse peut résilier l'hébergement sans remboursement en cas de manquement grave tel qu'un comportement illégal, des dommages matériels ou des violations liées au bruit.",
              "Les frais liés aux dommages, au nettoyage supplémentaire ou aux objets perdus seront facturés en conséquence.",
              "Les infractions graves ou pénales seront signalées à la police et à l'inspection du tourisme.",
            ],
          },
          {
            heading: "11. Dispositions finales",
            paragraphs: [
              "Ce règlement intérieur fait partie intégrante du contrat d'hébergement entre l'hôte et Apartments Brigita. Tout litige est régi par le droit croate. Les hôtes confirment avoir lu et accepté l'ensemble des dispositions en effectuant le check-in.",
            ],
          },
        ],
        footerNote: [
          "© 2025 Apartmani Brigita — Tous droits réservés",
          "Adresse : Slobodana Macure 13, 22000 Šibenik, Croatie • Propriétaire : Brigita Batinić • Téléphone : +385 98 910 5640",
        ],
      },
      ivica: {
        propertyName: "Apartments Ivica",
        ownerLabel: "Propriétaire",
        ownerName: "Ivica Batinić",
        phone: "+385 99 593 7343",
        address: "Slobodana Macure 13, 22000 Šibenik, Croatie",
        sections: [
          {
            heading: "1. Dispositions générales",
            paragraphs: [
              "Bienvenue aux Apartments Ivica. Ce règlement intérieur garantit un séjour confortable, sûr et légal pour tous les hôtes. En séjournant dans l'appartement, chaque hôte confirme avoir lu, compris et accepté de se conformer à ces règles pendant toute la durée de son séjour.",
            ],
          },
          {
            heading: "2. Arrivée et départ",
            bullets: [
              "L'arrivée (check-in) est possible à partir de **14h00** le jour de l'arrivée.",
              "Le départ (check-out) doit être effectué avant **10h00** le jour du départ.",
              "Tous les hôtes doivent présenter une pièce d'identité ou un passeport valide pour l'enregistrement dans le système **eVisitor**.",
              "Seuls les hôtes enregistrés sont autorisés à séjourner dans l'appartement.",
              "Tout changement dans le nombre d'occupants doit être immédiatement signalé au propriétaire.",
            ],
          },
          {
            heading: "3. Interdiction des visiteurs, fêtes et rassemblements",
            highlight: {
              intro: "Strictement interdit :",
              bullets: [
                "Faire entrer des personnes non enregistrées dans l'appartement (même temporairement).",
                "Organiser des fêtes, réunions, célébrations ou toute forme d'activité de groupe.",
                "S'engager dans toute activité inappropriée ou illégale, y compris, mais sans s'y limiter, la fourniture ou l'utilisation de services sexuels, l'abus de substances, ou tout comportement perturbant l'ordre public ou enfreignant la loi croate.",
              ],
              outro: "Toute violation de cette règle entraînera la **résiliation immédiate du contrat de location sans remboursement**, et le propriétaire se réserve le droit de **contacter les forces de l'ordre** et de signaler tout comportement illégal.",
            },
          },
          {
            heading: "4. Règlement intérieur et comportement",
            bullets: [
              "Veuillez réduire le bruit au minimum entre **22h00 et 8h00**.",
              "Il est **interdit** de fumer à l'intérieur de l'appartement.",
              "Les substances ou objets illégaux sont strictement interdits.",
              "Les hôtes doivent traiter l'appartement et son inventaire avec soin et signaler immédiatement tout dommage.",
              "Les frais de réparation ou de remplacement dus à la négligence de l'hôte sont facturés à celui-ci.",
            ],
          },
          {
            heading: "5. Équipements de l'appartement",
            bullets: [
              "L'appartement comprend : 2 lits, une salle de bain avec toilettes et une kitchenette.",
              "Utilisez tous les appareils et le mobilier de manière responsable.",
              "Éteignez les lumières, la climatisation et les appareils électriques en quittant l'appartement.",
              "N'emportez aucun objet hors de l'appartement.",
            ],
          },
          {
            heading: "6. Responsabilité",
            bullets: [
              "Le propriétaire n'est pas responsable de la perte ou du vol d'effets personnels.",
              "Le propriétaire n'est pas responsable des blessures causées par la négligence de l'hôte.",
              "Les hôtes sont tenus de verrouiller l'appartement et de conserver les clés en lieu sûr. Une clé perdue entraînera des frais de remplacement de **30 €**.",
            ],
          },
          {
            heading: "7. Propreté et entretien",
            bullets: [
              "L'appartement est nettoyé et le linge de lit changé avant chaque nouveau séjour.",
              "Un nettoyage supplémentaire peut être organisé sur demande.",
              "Ne jetez aucun déchet ou reste alimentaire dans les toilettes ou les canalisations.",
            ],
          },
          {
            heading: "8. Sécurité",
            bullets: [
              "En cas d'incendie ou d'urgence, contactez immédiatement le propriétaire et les services d'urgence (**112**).",
              "Ne manipulez pas les installations électriques ou d'eau.",
            ],
          },
          {
            heading: "9. Conséquences des violations du règlement",
            paragraphs: ["En cas de violation de ces règles, le propriétaire se réserve le droit de :"],
            bullets: [
              "Résilier immédiatement le contrat d'hébergement.",
              "Demander à l'hôte de quitter l'appartement sans remboursement.",
              "Informer les autorités compétentes, y compris la police et l'inspection du tourisme.",
            ],
          },
          {
            heading: "10. Acceptation",
            paragraphs: [
              "En séjournant dans l'appartement, l'hôte confirme avoir lu, compris et accepté de se conformer intégralement à ce règlement intérieur.",
            ],
          },
        ],
        footerNote: ["© 2025 Apartments Ivica – Tous droits réservés"],
      },
    },
  },

  checkin: {
    title: "Enregistrement des voyageurs",

    stay: {
      title: "Votre séjour",
      subtitle: "Quand séjournez-vous chez nous ?",
      arrival: "Arrivée",
      departure: "Départ",
      night: "nuit",
      nights: "nuits",
      suggested: "Nous avons prérempli les dates de la réservation en cours — ajustez-les si besoin.",
      invalidRange: "Le départ doit être après l'arrivée.",
    },

    consent: {
      title: "Votre vie privée",
      text: "La loi croate nous impose d'enregistrer chaque voyageur (eVisitor, loi sur la taxe de séjour). Vos données ne servent qu'à cette obligation légale — nous ne les conservons pas : les photos de documents et les données personnelles sont automatiquement supprimées de nos serveurs dans les 10 jours suivant votre départ.",
      checkbox: "J'accepte le traitement de mes données pour l'enregistrement des voyageurs",
    },

    start: "Commencer l'enregistrement",

    method: {
      title: "Comment souhaitez-vous vous enregistrer ?",
      recommended: "Le plus rapide",
      scanTitle: "Scanner votre document",
      scanDesc: "Visez votre pièce d'identité — les champs se remplissent automatiquement.",
      manualTitle: "Saisie manuelle",
      manualDesc: "Pas de document sous la main ? Remplissez un court formulaire.",
    },

    docType: {
      title: "Quel document scannez-vous ?",
      idCard: "Carte d'identité",
      passport: "Passeport",
      drivingLicence: "Permis de conduire",
      bothSides: "recto et verso",
      oneSide: "page photo uniquement",
    },

    camera: {
      frontSide: "Recto",
      backSide: "Verso",
      passportPage: "Page photo",
      fitFrame: "Placez le document dans le cadre",
      tooDark: "Trop sombre — allumez une lumière ou approchez-vous d'une fenêtre.",
      confirmQuestion: "Le document est-il net et entièrement dans le cadre ?",
      openCamera: "Ouvrir l'appareil photo",
      unavailable: "Caméra indisponible. Vérifiez les autorisations de la caméra ou saisissez vos informations manuellement.",
      manualFallback: "Saisir manuellement",
    },

    processing: {
      title: "Lecture du document…",
      hint: "Cela prend généralement quelques secondes.",
    },

    scanFailed: {
      title: "Impossible de lire le document",
      text: "La photo est peut-être floue ou la lumière insuffisante. Réessayez, ou saisissez simplement vos informations.",
      tryAgain: "Scanner à nouveau",
      goManual: "Saisir manuellement",
    },

    review: {
      title: "Vérifiez vos informations",
      subtitle: "Assurez-vous que tout correspond à votre document, puis confirmez.",
      missingHint: "Nous n'avons pas pu lire ce champ — merci de le compléter.",
      confirm: "Confirmer",
    },

    manual: {
      title: "Saisissez vos informations",
      subtitle: "Saisissez les informations exactement comme sur votre document.",
      submit: "Continuer",
    },

    fields: {
      fullName: "Nom et prénom",
      dateOfBirth: "Date de naissance",
      placeOfBirth: "Lieu de naissance",
      placeOfResidence: "Lieu de résidence",
      placeOfResidenceHint: "Ville, puis pays — ex. Lyon, France",
      documentType: "Type de document",
      documentNumber: "Numéro du document",
      nationality: "Nationalité",
    },

    success: {
      title: "Enregistrement terminé !",
      verifiedText: "Tout est en ordre. Bon séjour !",
      reviewText: "Presque fini — votre hôte vérifiera rapidement les informations. Rien d'autre à faire de votre côté. Bon séjour !",
      anotherQuestion: "Quelqu'un d'autre séjourne avec vous ?",
      addAnother: "Enregistrer un autre voyageur",
      finish: "Terminer",
    },

    newGuest: {
      title: "Nouveau voyageur, même séjour",
      subtitle: "Les dates restent les mêmes — chaque voyageur donne son propre consentement.",
    },

    errors: {
      generic: "Une erreur s'est produite. Veuillez réessayer.",
      network: "Serveur injoignable. Vérifiez votre connexion et réessayez.",
      expired: "Cette session d'enregistrement a expiré. Veuillez recommencer.",
      startOver: "Recommencer",
    },

    cancel: {
      title: "Abandonner cet enregistrement ?",
      text: "Votre progression sera perdue. Vous pouvez recommencer à tout moment.",
      confirmButton: "Oui, abandonner",
      dismissButton: "Non, continuer",
    },

    common: {
      back: "Retour",
      continue: "Continuer",
      retry: "Réessayer",
      loading: "Chargement…",
      cancelCheckin: "Abandonner l'enregistrement",
    },
  },

  checkInvoice: {
    title: "Vérifier une facture",
    subtitle: "Saisissez le code imprimé sur votre facture",
    codeHint: "Code à 8 caractères, ex. E710-59DE",
    verifying: "Vérification…",
    incomplete: "Saisissez les 8 caractères du code.",

    keypad: {
      backspace: "Effacer",
      clear: "Réinitialiser",
    },

    result: {
      validTitle: "Facture vérifiée",
      validText: "Il s'agit d'une facture authentique et émise.",
      cancelledTitle: "Facture annulée",
      cancelledText: "Cette facture a été annulée par l'émetteur et n'est plus valable.",
      notFoundTitle: "Facture introuvable",
      notFoundText: "Nous n'avons trouvé aucune facture valide avec ce code. Vérifiez le code et réessayez.",
      checkAnother: "Vérifier un autre code",
    },

    fields: {
      documentNumber: "Numéro du document",
      invoiceDate: "Date de la facture",
      issuedBy: "Émis par",
      recipient: "Destinataire",
      totalDue: "Montant total",
      status: "Statut",
    },

    status: {
      DRAFT: "Brouillon",
      ISSUED: "Émise",
      CANCELLED: "Annulée",
    },

    errors: {
      generic: "Une erreur s'est produite. Veuillez réessayer.",
      network: "Serveur injoignable. Vérifiez votre connexion et réessayez.",
    },
  },

  notFound: {
    title: "Page introuvable",
    description: "La page « {path} » n'existe pas ou a été déplacée.",
    homeButton: "Retour à l'accueil",
    adminButton: "Intranet admin",
    adminHint: "Vous cherchez l'intranet admin ?",
    adminLinkText: "Cliquez ici",
  },
} satisfies Dictionary;
