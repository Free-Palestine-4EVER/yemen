import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { Destinations } from "@/components/landing/Destinations";
import { Trust } from "@/components/landing/Trust";
import { CTA } from "@/components/landing/CTA";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Pricing />
        <Destinations />
        <Trust />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
