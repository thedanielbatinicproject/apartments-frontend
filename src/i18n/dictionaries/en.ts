// ============================================================
// ENGLESKI — IZVOR TIPA za sve prijevode.
//
// Novi tekst se dodaje OVDJE prvo; TypeScript zatim prisili sve
// ostale jezike da ga prevedu (satisfies Dictionary).
// ============================================================

export const en = {
  nav: {
    home: "Home",
    apartments: "Apartments",
    about: "About Šibenik",
    contact: "Contact",
    book: "Book now",
  },

  home: {
    hero: {
      greetingMorning: "Good morning!",
      greetingDay: "Good afternoon!",
      greetingEvening: "Good evening!",
      greetingNight: "Welcome, night owl!",
      tagline: "Three family-run apartments in the heart of Šibenik's old stone town.",
      scrollCue: "Take a look around",
    },

    apartments: {
      eyebrow: "Where you'll stay",
      title: "Three homes in the old town",
      subtitle: "Family-run, in the Plišac quarter — the old town, the cathedral and the sea are all a short stroll away.",
      guestsLabel: "Guests",
      roomsLabel: "Rooms",
      cta: "View apartment",
      error: "We couldn't load the apartments right now.",
      retry: "Try again",
      empty: "No apartments available at the moment.",
    },

    about: {
      eyebrow: "Right on your doorstep",
      title: "A town a thousand years old",
      text: "Founded by a Croatian king's charter in 1066, guarded by four fortresses, crowned by a UNESCO cathedral of pure stone — and all of it begins at the end of your street.",
      cta: "Discover Šibenik",
    },

    contact: {
      title: "Questions before you book?",
      text: "Write to us directly — we're happy to help you choose the right apartment.",
      cta: "Get in touch",
      footerTagline: "With love, from Šibenik",
    },
  },

  apartmentDetail: {
    backToList: "All apartments",
    capacity: "{n} guests",
    rooms: "{n} rooms",
    amenitiesTitle: "Amenities",

    gallery: {
      empty: "No photos yet.",
    },

    calendar: {
      title: "Availability",
      legendFree: "Free",
      legendBooked: "Booked",
      bookHint: "This calendar is for reference only — book through Airbnb.",
      error: "Couldn't load the calendar right now.",
      retry: "Try again",
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },

    reviews: {
      title: "Guest reviews",
      empty: "No reviews yet.",
      error: "Couldn't load reviews right now.",
      retry: "Try again",
      upvote: "Helpful",
      averageSuffix: "/ 5 · {n} reviews",
    },

    airbnb: {
      title: "Book on Airbnb",
      text: "Reservations for this apartment are handled through Airbnb.",
      viewOnAirbnb: "View On Airbnb",
      tapHint: "Tap the card to open the full listing on Airbnb",
      unavailable: "The Airbnb listing link isn't available yet.",
    },

    notFound: {
      title: "Apartment not found",
      text: "This apartment doesn't exist or is no longer listed.",
      back: "Back to apartments",
    },
  },

  aboutPage: {
    hero: {
      eyebrow: "The city outside your window",
      title: "Šibenik",
      subtitle: "A thousand years old, defended by four fortresses, and — improbably — once one of the most electrified cities on Earth.",
    },

    history: {
      title: "Croatia's own, from the very start",
      text: "Most towns on this coast were founded by Greeks, Illyrians or Romans. Šibenik wasn't — it's first mentioned on Christmas Day 1066, in a charter of the Croatian king Petar Krešimir IV, which is why it's still nicknamed \"Krešimir's town\". Until a 17th-century plague, it was the largest city on the entire eastern Adriatic.",
    },

    siege: {
      eyebrow: "1647",
      title: "The siege that failed",
      text: "During the Cretan War, an Ottoman force reported at over 25,000 soldiers laid siege to Šibenik — defended by fewer than 6,000 townspeople. The walls held. It's one of the reasons the city still has four fortresses instead of ruins.",
    },

    innovation: {
      eyebrow: "1895",
      title: "The night the lights came on",
      text: "A hydroelectric plant on the nearby Krka river made Šibenik one of the very first cities in the world with public street lighting powered by alternating current — using the same AC system Nikola Tesla had just patented, built in the same era as the pioneering plant at Niagara Falls.",
    },

    parachute: {
      eyebrow: "1617",
      title: "The first parachute jump",
      text: "Faust Vrančić, a Šibenik-born polymath who spoke seven languages, sketched a refinement of Leonardo da Vinci's parachute concept and called it \"Homo Volans\" — the Flying Man. Then, at about 65 years old, he actually jumped off a tower in Venice wearing it. He survived. It's one of the earliest recorded parachute jumps in history.",
    },

    cathedral: {
      eyebrow: "UNESCO since 2000",
      title: "The Cathedral of St. James",
      text: "Raised entirely from stone between 1431 and 1536 — without a single wooden beam or drop of mortar in its vaulted roof — it's one of the great Renaissance achievements of Croatia, largely the work of master builder Juraj Dalmatinac. Look up at the facade and you'll find 71 carved stone faces staring back — and in 2015 the whole square played the Iron Bank of Braavos in Game of Thrones.",
    },

    fortresses: {
      title: "Four fortresses on the skyline",
      intro: "A rare sight for a town this size — all four still standing, three medieval and one reborn as a modern augmented-reality exhibit.",
      barone: {
        eyebrow: "Built 1646",
        title: "Barone Fortress",
        text: "Raised in a hurry in 1646 by Baron Christophe Martin von Degenfeld — the very commander whose defence broke the siege recounted above. Fully restored in 2014, its bastions now hold an augmented-reality exhibit replaying that battle, next to a terrace pouring local wine and olive oil over the best view in town.",
      },
      stMichael: {
        title: "St. Michael's Fortress",
        text: "This hill has been fortified since the Iron Age, and it's where Šibenik itself was born — the 1066 charter above was signed within these walls. In 1663, lightning struck the gunpowder store and blew half the fortress apart; what stands today is mostly a rebuild, now an open-air summer stage.",
      },
      stJohn: {
        title: "St. John's Fortress",
        text: "Star-shaped and 115 metres up, built in just 45 days when the citizens of Šibenik banded together to defend their own town. Its ramparts played Meereen's fighting pit in Game of Thrones, with Daenerys watching from these very walls.",
      },
      stNicholas: {
        eyebrow: "UNESCO since 2017",
        title: "St. Nicholas' Fortress",
        text: "Guarding the mouth of St. Anthony's Channel since 1540, reachable only by boat. In 2017 it joined the cathedral as Šibenik's second UNESCO World Heritage listing.",
      },
    },

    nature: {
      title: "Day trips from your doorstep",
      krka: {
        title: "Krka National Park",
        text: "About 17 km inland, the Krka River tumbles over Skradinski buk — the longest tufa waterfall barrier in Europe. You can no longer swim there: since 2021 it's off-limits, to protect the living moss that's still slowly building the stone barriers themselves.",
      },
      kornati: {
        title: "The Kornati Islands",
        text: "An archipelago of 89 uninhabited islands, islets and reefs — a national park since 1980, ringed by stark limestone cliffs and famously clear water, reachable only by boat.",
      },
    },

    quest: {
      eyebrow: "Play",
      title: "Fly the quest",
      instruction: "Tap, click, or press space to flap — you only control your altitude, the coastline scrolls by on its own.",
      start: "Start flying",
      progress: "{n} / {total} discovered",
      lockedLabel: "Landmark {n}",
      lockedHint: "Fly through it to reveal",
      replay: "Fly again",
      complete: {
        title: "Full circle!",
        text: "Now you know why Šibenik is one of a kind.",
      },
      landmarks: {
        cathedral: "In 2015, this square played the Iron Bank of Braavos in Game of Thrones.",
        stMichael: "Fortified since the Iron Age — and blown apart by a lightning strike in 1663.",
        stJohn: "Built in 45 days flat — and later played Meereen's fighting pit on screen.",
        stNicholas: "Šibenik's second UNESCO site — reachable only by boat.",
        siege: "1647: 6,000 defenders held off over 25,000 attackers.",
        barone: "Named after the commander who broke that very siege.",
        innovation: "1895: one of the first AC-powered cities on Earth.",
        parachute: "1617: a Šibenik native jumped off a Venice tower wearing a parachute — and lived.",
        krka: "Its waterfalls have been off-limits for swimming since 2021.",
        kornati: "89 uninhabited islands, reachable only by boat.",
      },
    },
  },

  kontaktPage: {
    hero: {
      eyebrow: "Say hello",
      title: "Get in touch",
      text: "Apartments Šibenik is a small, family-run place — when you write or call, you're talking directly to us, not a booking desk.",
    },
    hosts: {
      title: "Your hosts",
      callLabel: "Call",
      emailLabel: "Email",
      whatsappLabel: "WhatsApp",
    },
    address: {
      title: "Find us",
      directions: "Get directions",
    },
    note: "Prefer Airbnb? You'll find the same apartments listed there too — see each apartment's page for a direct link.",
  },

  checkin: {
    title: "Guest check-in",

    stay: {
      title: "Your stay",
      subtitle: "When are you staying with us?",
      arrival: "Arrival",
      departure: "Departure",
      night: "night",
      nights: "nights",
      suggested: "We pre-filled the dates of the current booking — adjust them if needed.",
      invalidRange: "Departure must be after arrival.",
    },

    consent: {
      title: "Your privacy",
      text: "Croatian law requires us to register every guest (eVisitor, Tourist Tax Act). Your details are used only for this legal obligation — we never keep them: document photos and personal data are automatically deleted from our servers within 10 days after your departure.",
      checkbox: "I agree to the processing of my data for guest registration",
    },

    start: "Start check-in",

    method: {
      title: "How would you like to check in?",
      recommended: "Fastest",
      scanTitle: "Scan your document",
      scanDesc: "Point the camera at your ID — details fill in automatically.",
      manualTitle: "Type details manually",
      manualDesc: "No document at hand, or prefer typing? Use a short form.",
    },

    docType: {
      title: "Which document will you scan?",
      idCard: "ID card",
      passport: "Passport",
      drivingLicence: "Driving licence",
      bothSides: "front and back",
      oneSide: "photo page only",
    },

    camera: {
      frontSide: "Front side",
      backSide: "Back side",
      passportPage: "Photo page",
      fitFrame: "Fit the document inside the frame",
      tooDark: "Too dark — turn on a light or move to a window.",
      confirmQuestion: "Is the document sharp and fully inside the frame?",
      openCamera: "Open camera",
      unavailable: "Camera is not available. Check camera permissions for this page, or enter your details manually.",
      manualFallback: "Enter manually instead",
    },

    processing: {
      title: "Reading your document…",
      hint: "This usually takes a few seconds.",
    },

    scanFailed: {
      title: "We couldn't read the document",
      text: "The photo may be blurry or the light too low. You can try again, or simply type the details in.",
      tryAgain: "Scan again",
      goManual: "Type details manually",
    },

    review: {
      title: "Check your details",
      subtitle: "Make sure everything matches your document, then confirm.",
      missingHint: "We couldn't read this field — please fill it in.",
      confirm: "Confirm details",
    },

    manual: {
      title: "Enter your details",
      subtitle: "Fill in the details exactly as they appear on your document.",
      submit: "Continue",
    },

    fields: {
      fullName: "Full name",
      dateOfBirth: "Date of birth",
      placeOfBirth: "Place of birth",
      placeOfResidence: "Place of residence",
      placeOfResidenceHint: "Town or city, then country — e.g. Berlin, Germany",
      documentType: "Document type",
      documentNumber: "Document number",
      nationality: "Nationality",
    },

    success: {
      title: "Check-in complete!",
      verifiedText: "You're all set. Enjoy your stay!",
      reviewText: "Almost done — your host will quickly review the details. Nothing more to do on your side. Enjoy your stay!",
      anotherQuestion: "Is anyone else staying with you?",
      addAnother: "Check in another guest",
      finish: "Finish",
    },

    newGuest: {
      title: "New guest, same stay",
      subtitle: "The dates stay the same — each guest gives their own consent.",
    },

    errors: {
      generic: "Something went wrong. Please try again.",
      network: "Can't reach the server. Check your connection and try again.",
      expired: "This check-in session has expired. Please start again.",
      startOver: "Start again",
    },

    cancel: {
      title: "Abandon this check-in?",
      text: "Your progress will be discarded. You can start over any time.",
      confirmButton: "Yes, abandon",
      dismissButton: "No, keep going",
    },

    common: {
      back: "Back",
      continue: "Continue",
      retry: "Try again",
      loading: "Loading…",
      cancelCheckin: "Abandon check-in",
    },
  },

  checkInvoice: {
    title: "Verify invoice",
    subtitle: "Enter the code printed on your invoice",
    codeHint: "8-character code, e.g. E710-59DE",
    verifying: "Checking…",
    incomplete: "Enter all 8 characters of the code.",

    keypad: {
      backspace: "Delete",
      clear: "Clear",
    },

    result: {
      validTitle: "Invoice verified",
      validText: "This is a genuine, issued invoice.",
      cancelledTitle: "Invoice cancelled",
      cancelledText: "This invoice was cancelled by the issuer and is no longer valid.",
      notFoundTitle: "Invoice not found",
      notFoundText: "We couldn't find a valid invoice with this code. Double-check the code and try again.",
      checkAnother: "Check another code",
    },

    fields: {
      documentNumber: "Document number",
      invoiceDate: "Invoice date",
      issuedBy: "Issued by",
      recipient: "Recipient",
      totalDue: "Total due",
      status: "Status",
    },

    status: {
      DRAFT: "Draft",
      ISSUED: "Issued",
      CANCELLED: "Cancelled",
    },

    errors: {
      generic: "Something went wrong. Please try again.",
      network: "Can't reach the server. Check your connection and try again.",
    },
  },

  notFound: {
    title: "Page not found",
    // "{path}" se zamjenjuje stvarno zatraženom putanjom (usePathname)
    description: "The page “{path}” doesn't exist or may have been moved.",
    homeButton: "Back to homepage",
    adminButton: "Admin intranet",
    adminHint: "Looking for the admin intranet?",
    adminLinkText: "Click here",
  },
};

/** Tip rječnika — svi jezici moraju točno pratiti ovu strukturu */
export type Dictionary = typeof en;
