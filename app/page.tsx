import Opening from "@/components/Opening";
import Manifesto from "@/components/Manifesto";
import About from "@/components/About";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import CtaBand from "@/components/CtaBand";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CallButton from "@/components/CallButton";

export default function Home() {
  return (
    <>
      <Opening />
      <main>
        <Manifesto />
        <About />
        <Marquee />
        <Services />
        <Projects />
        <CtaBand />
        <Contact />
      </main>
      <Footer />
      <CallButton />
    </>
  );
}
