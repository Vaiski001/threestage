import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Testimonials } from "@/components/home/Testimonials";
import { PricingPlans } from "@/components/home/PricingPlans";
import { CallToAction } from "@/components/home/CallToAction";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />
        <PricingPlans />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
