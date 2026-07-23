// ============================================================
// Ručno održavana mapa apartmentId → pravi Airbnb oglas.
//
// Backend NE izlaže ovo javno (ApartmentResponse.airbnbIcalUrl je
// admin-only polje i to je iCal feed za sync, ne javni URL oglasa).
// `roomId` je Airbnbov "rooms/{id}" broj — treba ga za embeddable
// widget (data-id), `url` je čisti link za fallback/"otvori u novom
// tabu" bez pogađanih tracking query parametara.
// ============================================================

export interface AirbnbListing {
  roomId: string;
  url: string;
}

export const AIRBNB_LISTINGS: Record<number, AirbnbListing> = {
  1: { roomId: "7397131", url: "https://www.airbnb.com/rooms/7397131" },
  2: { roomId: "7392911", url: "https://www.airbnb.com/rooms/7392911" },
  3: {
    roomId: "1493488998400480535",
    url: "https://www.airbnb.com/rooms/1493488998400480535",
  },
};

export function getAirbnbListing(apartmentId: number): AirbnbListing | null {
  return AIRBNB_LISTINGS[apartmentId] ?? null;
}
