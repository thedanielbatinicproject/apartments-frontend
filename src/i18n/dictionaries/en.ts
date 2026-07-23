// ============================================================
// ENGLESKI — IZVOR TIPA za sve prijevode.
//
// Novi tekst se dodaje OVDJE prvo; TypeScript zatim prisili sve
// ostale jezike da ga prevedu (satisfies Dictionary).
// ============================================================

// houseRules sekcije variraju (Brigita ima "apartments"/"effective",
// highlight.intro postoji samo kod Ivice) — eksplicitni tip osigurava
// da su ta polja DOSLJEDNO opcionalna u izvedenom Dictionary tipu,
// umjesto da TS zaključi usko-doslovni oblik po hostu.
interface HouseRulesSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  highlight?: {
    intro?: string;
    bullets: string[];
    outro?: string;
  };
}

interface HouseRulesHost {
  propertyName: string;
  ownerLabel: string;
  ownerName: string;
  phone: string;
  address: string;
  effective?: string;
  apartments?: { name: string; description: string }[];
  sections: HouseRulesSection[];
  footerNote: string[];
}

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

  houseRules: {
    eyebrow: "Good to know",
    title: "House Rules",
    subtitle: "Both apartments share the same address but are listed and managed separately. Pick the host that matches your reservation.",
    understand: "I understand",
    switchLabels: { brigita: "Brigita", ivica: "Ivica" },
    hosts: {
      brigita: {
        propertyName: "Apartments Brigita",
        ownerLabel: "Owner / Host",
        ownerName: "Brigita Batinić",
        phone: "+385 98 910 5640",
        address: "Slobodana Macure 13, 22000 Šibenik, Croatia",
        effective: "2025 and valid until further notice.",
        apartments: [
          {
            name: "Studio Apartment",
            description: "Capacity: up to 2 adults. A compact and comfortable apartment ideal for couples or individual travelers seeking tranquility and functionality.",
          },
          {
            name: "Apartment With Garden",
            description: "Capacity: up to 3 adults or 2 adults + 2 children. Includes a private enclosed garden for exclusive guest use, subject to additional safety and liability rules described below.",
          },
        ],
        sections: [
          {
            heading: "1. General Provisions",
            paragraphs: [
              "These House Rules define the responsibilities of both the host and the guests. By confirming a reservation or checking in, the guest acknowledges full acceptance of these terms. The aim is to maintain a peaceful, safe, and lawful environment for all occupants and to ensure the proper preservation of property and equipment.",
            ],
          },
          {
            heading: "2. Check-In, Check-Out, and Registration",
            bullets: [
              "**Check-in:** from 2:00 PM. **Check-out:** by 10:00 AM on departure day.",
              "Guests must provide valid identification upon arrival for registration in the **eVisitor** system, in accordance with Croatian tourism law.",
              "Only registered guests are permitted to stay overnight. Visitors or additional occupants must be approved by the host in advance.",
              "Failure to comply with registration requirements may result in termination of stay without refund.",
            ],
          },
          {
            heading: "3. Use of Premises and Behavior",
            paragraphs: [
              "Guests are expected to conduct themselves with courtesy, respect, and responsibility at all times. The property is located in a quiet residential neighborhood; therefore, maintaining peace and public order is a legal and contractual obligation.",
            ],
            highlight: {
              bullets: [
                "It is **strictly prohibited** to organize parties, gatherings, or events involving unregistered visitors, amplified music, or loud social activities.",
                "Quiet hours are observed from **10:00 PM to 8:00 AM**. During this period, guests must avoid any noise that may disturb other guests or neighbors — including loud conversations, moving furniture, or operating loud devices.",
                "Guests shall refrain from any behavior that is offensive, aggressive, or threatening toward the host, other guests, or local residents.",
                "Possession or use of illegal substances, weapons, fireworks, or hazardous materials on the premises is **strictly forbidden** and will result in immediate eviction and police notification.",
                "Smoking and vaping are not permitted inside the apartments. Smoking is allowed only in designated outdoor areas. Improper disposal of cigarette butts is subject to additional cleaning charges.",
                "Guests are obliged to use common sense and respect local customs, laws, and regulations governing residential conduct in Croatia.",
                "Failure to comply with behavioral standards may result in termination of accommodation without refund and, in severe cases, reporting to local authorities.",
              ],
              outro: "**Note:** The host reserves the right to enter the apartment in cases of serious disturbance, safety concerns, or suspicion of prohibited activities. Such entry will be recorded and justified solely for the purpose of maintaining safety and compliance.",
            },
          },
          {
            heading: "4. Property Care and Damages",
            bullets: [
              "Guests must handle furniture, appliances, and all inventory responsibly and in accordance with instructions provided.",
              "Any damage, malfunction, or loss must be reported immediately. Neglecting to do so may lead to post-checkout charges.",
              "Guests are financially liable for all damages caused by negligence, misuse, or intentional acts.",
              "Do not relocate or remove any item (e.g., towels, kitchenware, décor) from the property.",
            ],
          },
          {
            heading: "5. Cleanliness and Maintenance",
            bullets: [
              "The apartments are professionally cleaned before arrival. Guests should maintain cleanliness throughout their stay.",
              "Dispose of waste properly and recycle where applicable. Food waste, oil, and sanitary items must never be flushed down toilets or drains.",
              "Extra cleaning fees may apply if the apartment is left excessively dirty, with stains, odors, or misuse of equipment.",
            ],
          },
          {
            heading: "6. Garden and Outdoor Use (Apartment With Garden)",
            bullets: [
              "The garden is for exclusive use of guests staying in the Apartment With Garden. Children must always be supervised by an adult.",
              "Open fire is prohibited except for safe use of the designated barbecue area. Never leave a fire unattended, and extinguish completely after use.",
              "Do not damage or pick plants, use glass near grass areas, or displace outdoor furniture.",
              "The host disclaims liability for accidents due to unsafe or negligent behavior in the garden area.",
            ],
          },
          {
            heading: "7. Liability and Insurance",
            bullets: [
              "The host is not responsible for theft, loss, or damage of personal items. Guests are advised to secure valuables and hold valid travel insurance.",
              "Guests are fully liable for any damage, injury, or incident resulting from their actions or negligence.",
            ],
          },
          {
            heading: "8. Keys and Security",
            bullets: [
              "Guests are responsible for all issued keys. Lost keys incur a minimum fee of **€30**.",
              "Always lock doors and windows when leaving the premises.",
              "Access codes or keys must not be duplicated or shared with non-registered persons.",
            ],
          },
          {
            heading: "9. Emergencies",
            bullets: [
              "For emergencies, dial **112** (universal emergency number in Croatia).",
              "Contact the host immediately for urgent property issues or safety concerns: **+385 98 910 5640**.",
            ],
          },
          {
            heading: "10. Rule Violations",
            bullets: [
              "The host may terminate accommodation without refund for serious breaches such as illegal behavior, property damage, or noise violations.",
              "Costs for damages, extra cleaning, or lost items will be charged accordingly.",
              "Severe or criminal offenses will be reported to police and tourism inspection authorities.",
            ],
          },
          {
            heading: "11. Final Provisions",
            paragraphs: [
              "These House Rules form an integral part of the accommodation agreement between the guest and Apartments Brigita. All disputes shall be governed by Croatian law. Guests confirm they have read and accepted all provisions by completing check-in.",
            ],
          },
        ],
        footerNote: [
          "© 2025 Apartmani Brigita — All Rights Reserved",
          "Address: Slobodana Macure 13, 22000 Šibenik, Croatia • Owner: Brigita Batinić • Phone: +385 98 910 5640",
        ],
      } as HouseRulesHost,
      ivica: {
        propertyName: "Apartments Ivica",
        ownerLabel: "Owner",
        ownerName: "Ivica Batinić",
        phone: "+385 99 593 7343",
        address: "Slobodana Macure 13, 22000 Šibenik, Croatia",
        sections: [
          {
            heading: "1. General Provisions",
            paragraphs: [
              "Welcome to Apartments Ivica. These house rules ensure a comfortable, safe, and lawful stay for all guests. By staying in the apartment, each guest confirms that they have read, understood, and agree to comply with these rules during the entire duration of their stay.",
            ],
          },
          {
            heading: "2. Check-In and Check-Out",
            bullets: [
              "Check-in is available from **2:00 PM** on the day of arrival.",
              "Check-out must be completed by **10:00 AM** on the day of departure.",
              "All guests must present a valid ID or passport for registration in the **eVisitor** system.",
              "Only registered guests are allowed to stay in the apartment.",
              "Any change in the number of occupants must be immediately reported to the owner.",
            ],
          },
          {
            heading: "3. Prohibition of Visitors, Parties, and Gatherings",
            highlight: {
              intro: "Strictly forbidden:",
              bullets: [
                "Bringing any unregistered persons into the apartment (even temporarily).",
                "Hosting parties, gatherings, celebrations, or any form of group activity.",
                "Engaging in any inappropriate or illegal activities, including but not limited to the provision or use of sexual services, substance abuse, or any behavior that disturbs public order or violates Croatian law.",
              ],
              outro: "Any violation of this rule will result in **immediate termination of the rental agreement without refund**, and the owner reserves the right to **contact law enforcement authorities** and report unlawful behavior.",
            },
          },
          {
            heading: "4. House Rules and Conduct",
            bullets: [
              "Please keep noise to a minimum between **10:00 PM and 8:00 AM**.",
              "Smoking inside the apartment is **not allowed**.",
              "Illegal substances or items are strictly prohibited.",
              "Guests must treat the apartment and its inventory with care and report any damages immediately.",
              "Costs of repair or replacement due to guest negligence are charged to the guest.",
            ],
          },
          {
            heading: "5. Apartment Facilities",
            bullets: [
              "The apartment includes: 2 beds, a bathroom with toilet, and a kitchenette.",
              "Use all appliances and furniture responsibly.",
              "Turn off lights, air conditioning, and electrical devices when leaving the apartment.",
              "Do not remove any items from the apartment.",
            ],
          },
          {
            heading: "6. Liability",
            bullets: [
              "The owner is not responsible for the loss or theft of personal belongings.",
              "The owner is not liable for injuries caused by guest negligence.",
              "Guests are required to lock the apartment and keep the keys safe. A lost key will incur a replacement fee of **€30**.",
            ],
          },
          {
            heading: "7. Cleanliness and Maintenance",
            bullets: [
              "The apartment is cleaned and bed linen is changed before each new stay.",
              "Additional cleaning can be arranged upon request.",
              "Do not dispose of waste or food in the toilet or drains.",
            ],
          },
          {
            heading: "8. Safety",
            bullets: [
              "In case of fire or emergency, immediately contact the owner and emergency services (**112**).",
              "Do not tamper with electrical or water installations.",
            ],
          },
          {
            heading: "9. Consequences of Rule Violations",
            paragraphs: ["In the event of violation of these rules, the owner reserves the right to:"],
            bullets: [
              "Terminate the accommodation agreement immediately.",
              "Request that the guest vacate the apartment without refund.",
              "Notify the competent authorities, including the police and tourism inspection.",
            ],
          },
          {
            heading: "10. Acceptance",
            paragraphs: [
              "By staying in the apartment, the guest confirms that they have read, understood, and agreed to comply with this House Rules document in its entirety.",
            ],
          },
        ],
        footerNote: ["© 2025 Apartments Ivica – All Rights Reserved"],
      } as HouseRulesHost,
    },
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
