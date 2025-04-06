import { useState, useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CallToAction() {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section className="py-20 md:py-32" ref={sectionRef}>
      <Container>
        <div className={`max-w-5xl mx-auto bg-primary rounded-2xl overflow-hidden shadow-xl transition-all duration-700 ${isIntersecting ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="px-6 py-16 md:p-16 text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="mb-8 md:mb-0 md:max-w-xl">
              <h2 className="text-3xl md:text-4xl font-medium mb-4 text-primary-foreground">
                Ready to transform your customer communications?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-0 md:pr-6">
                Get started today and experience the difference our enquiry management platform can make for your business.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/demo">Try Demo</Link>
              </Button>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 delay-300 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">30k+</div>
            <p className="text-muted-foreground">Businesses using our platform</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">2M+</div>
            <p className="text-muted-foreground">Enquiries processed monthly</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">35%</div>
            <p className="text-muted-foreground">Average conversion increase</p>
          </div>
        </div>
      </Container>
    </section>
  );
} 