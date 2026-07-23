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

  const canonical = `/apartmani/${id}`;

  try {
    const apartment = await getPublicApartment(Number(id));
    return {
      title: apartment.name,
      description: apartment.description,
      alternates: { canonical },
      openGraph: {
        title: `${apartment.name} | Apartments Šibenik`,
        description: apartment.description,
        siteName: "Apartments Šibenik",
        locale: "hr_HR",
        type: "website",
        url: canonical,
      },
      twitter: {
        card: "summary_large_image",
        title: `${apartment.name} | Apartments Šibenik`,
        description: apartment.description,
      },
    };
  } catch {
    return {
      title: "Apartman",
      alternates: { canonical },
    };
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
