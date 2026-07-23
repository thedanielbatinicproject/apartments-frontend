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
