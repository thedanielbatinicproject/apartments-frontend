import type { Metadata } from "next";
import { getPublicApartment } from "@/lib/api/apartments";
import { ApartmentDetailClient } from "@/components/public/apartment/ApartmentDetailClient";

interface RouteParams {
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const apartment = await getPublicApartment(Number(id));
    return {
      title: `${apartment.name} — Apartments Šibenik`,
      description: apartment.description,
    };
  } catch {
    return { title: "Apartments Šibenik" };
  }
}

export default async function ApartmentDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  return <ApartmentDetailClient apartmentId={Number(id)} />;
}
