import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Steps } from "@/components/sections/steps";
import { Calculator } from "@/components/sections/calculator";
import { Services } from "@/components/sections/services";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Results } from "@/components/sections/results";
import { PageLoader } from "@/components/page-loader";

export default function Home() {
  return (
    <>
      <PageLoader />
      <Header />
      <main >
        <Hero />
        <Problem />
        <Steps />
        <Results />
        <Services />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
