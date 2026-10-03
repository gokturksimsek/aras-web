import Opening from "@/components/Opening";
import Manifesto from "@/components/Manifesto";
import About from "@/components/About";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import References from "@/components/References";
import CtaBand from "@/components/CtaBand";

// Anasayfa: her bölümün özeti; ayrıntılar kendi sayfasında (OBES düzeni).
export default function Home() {
  return (
    <>
      <Opening />
      <main id="icerik">
        <Manifesto />
        <About no="01" more />
        <Marquee />
        <Services no="02" more />
        <Projects no="03" limit={6} />
        <References no="04" compact />
        <CtaBand />
      </main>
    </>
  );
}
