import Architecture from "@/components/Architecture";
import Availability from "@/components/Availability";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ImageBreak from "@/components/ImageBreak";
import Lifestyle from "@/components/Lifestyle";
import Location from "@/components/Location";
import Manifesto from "@/components/Manifesto";
import Materials from "@/components/Materials";
import Preloader from "@/components/Preloader";
import PrivateAccess from "@/components/PrivateAccess";
import Residences from "@/components/Residences";
import { ExperienceProvider } from "@/components/providers/ExperienceProvider";

export default function Home() {
  return (
    <ExperienceProvider>
      <Preloader />
      <Header />
      <main id="main">
        <Hero />
        <Manifesto />
        <Architecture />
        <Residences />
        <ImageBreak />
        <Location />
        <Lifestyle />
        <Materials />
        <Availability />
        <PrivateAccess />
      </main>
      <Footer />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </ExperienceProvider>
  );
}
