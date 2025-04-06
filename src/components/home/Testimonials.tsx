import { useState, useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QuoteIcon } from "lucide-react";

export function Testimonials() {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const testimonials = [
    {
      quote: "This platform has transformed how we handle customer enquiries. Our response time has decreased by 45% and conversion rates are up by 30%.",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "BuildRight Construction",
      avatar: "SJ"
    },
    {
      quote: "As a customer, I love how easy it is to track my enquiries with different companies. The messaging system is intuitive and I always know where things stand.",
      author: "Michael Chen",
      role: "Home Renovator",
      company: "Customer",
      avatar: "MC"
    },
    {
      quote: "The analytics dashboard gives us incredible insights into our customer service performance. We've been able to identify bottlenecks and improve our team's efficiency.",
      author: "Jessica Williams",
      role: "Operations Manager",
      company: "Horizon Landscaping",
      avatar: "JW"
    }
  ];

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
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-medium mb-6 transition-all duration-700 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Trusted by companies and customers
          </h2>
          <p className={`text-muted-foreground text-lg transition-all duration-700 delay-150 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            See what our users say about how our platform has improved their communication and business outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`bg-card p-8 rounded-xl border shadow-sm transition-all duration-700 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${150 * (index + 1)}ms` }}
            >
              <QuoteIcon className="text-primary h-10 w-10 mb-6 opacity-80" />
              <blockquote className="mb-6 text-lg">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={`/avatars/avatar-${index + 1}.png`} alt={testimonial.author} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
} 