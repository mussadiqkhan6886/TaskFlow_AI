import DeveloperJourney from "@/components/DeveloperJourney";
import Engineering from "@/components/Engineering";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import Workflow from "@/components/Workflow";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0B0D]">
      <Hero />
      <Engineering />
      <Workflow />
      <Features />
      <TechStack />
      <DeveloperJourney />
      <Footer />
    </main>
  );
}