import About from "@/components/hero /about";
import Hero from "@/components/hero /landingpage";
import { Objective } from "@/components/hero /objective";
import Contact from "@/components/hero /contact";
import { Advantage } from "@/components/hero /advantage";
import Header from "@/components/layout/header/header";
import { Footer } from "@/components/layout/footer/footer";
const LandingPage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <About />
      <Objective />
      <Advantage />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;
