import ServicesSection from "@/components/elements/services-section";
import UspSection from "@/components/elements/Usp";
import { VideoSection } from "@/components/elements/video-section";
import Layout from "@/components/layout/Layout";
import BusinessJourney from "@/components/sections/home1/BusinessJourney";
import Section1 from "@/components/sections/home1/Section1";
import Section10 from "@/components/sections/home1/Section10";
import Section11 from "@/components/sections/home1/Section11";
import Section12 from "@/components/sections/home1/Section12";
import Section13 from "@/components/sections/home1/Section13";
import Section14 from "@/components/sections/home1/Section14";
import Section2 from "@/components/sections/home1/Section2";
import Section3 from "@/components/sections/home1/Section3";
import Section4 from "@/components/sections/home1/Section4";
import Section5 from "@/components/sections/home1/Section5";
import Section6 from "@/components/sections/home1/Section6";
import Section7 from "@/components/sections/home1/Section7";
import Section8 from "@/components/sections/home1/Section8";
import Section9 from "@/components/sections/home1/Section9";
export default function Home() {
  return (
    <>
      <Layout headerStyle={1} footerStyle={1} logoWhite>
        <Section1 />
        <Section2 />
        <UspSection />
        <VideoSection />
        <Section3 />
        <Section14 />
        <Section9 />
        <Section11 />
        <Section12 />
        {/* <Section13 /> */}
      </Layout>
    </>
  );
}
