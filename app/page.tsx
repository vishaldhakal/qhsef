import Header from "@/components/layout/header/header";
import Hero from "@/components/hero /landingpage";
import About from "@/components/hero /about";
import { Objective } from "@/components/hero /objective";
import { Advantage } from "@/components/hero /advantage";
import Contact from "@/components/hero /contact";
import { Footer } from "@/components/layout/footer/footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Objective />
      <Advantage />
      <Contact />
      <Footer />
    </>
  );
}
