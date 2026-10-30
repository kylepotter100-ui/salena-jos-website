import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Statement } from "@/components/Statement";
import { TreatmentsPan } from "@/components/TreatmentsPan";
import { GoodToKnow } from "@/components/GoodToKnow";
import { Academy } from "@/components/Academy";
import { Shopfront } from "@/components/Shopfront";
import { Visit } from "@/components/Visit";
import { BookingBox } from "@/components/BookingBox";
import { Footer } from "@/components/Footer";

// Nine sections, nine layout families, one theme. See README for the family of each section.
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Statement />
        <TreatmentsPan />
        <GoodToKnow />
        <Academy />
        <Shopfront />
        <Visit />
        <BookingBox />
      </main>
      <Footer />
    </>
  );
}
