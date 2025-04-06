import { useState, useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

export function PricingPlans() {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const plans = [
    {
      name: "Basic",
      description: "Perfect for small businesses just getting started",
      price: 29,
      period: "/month",
      features: [
        "Up to 100 enquiries per month",
        "Email integration",
        "Basic analytics",
        "2 team members",
        "30-day message history"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const
    },
    {
      name: "Professional",
      description: "For growing businesses with active customer enquiries",
      price: 79,
      period: "/month",
      features: [
        "Up to 1,000 enquiries per month",
        "All channel integrations",
        "Advanced analytics & reporting",
        "10 team members",
        "90-day message history",
        "Custom form builder",
        "Priority support"
      ],
      popular: true,
      buttonText: "Get Started",
      buttonVariant: "default" as const
    },
    {
      name: "Enterprise",
      description: "Customized solutions for larger organizations",
      price: 199,
      period: "/month",
      features: [
        "Unlimited enquiries",
        "All channels plus API access",
        "Custom analytics & dashboards",
        "Unlimited team members",
        "Unlimited message history",
        "White-labeling options",
        "Dedicated account manager",
        "24/7 phone support"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const
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
    <section className="py-20 md:py-32 bg-secondary/50" ref={sectionRef}>
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-medium mb-6 transition-all duration-700 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Simple, transparent pricing
          </h2>
          <p className={`text-muted-foreground text-lg transition-all duration-700 delay-150 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Choose the plan that works best for your business needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card p-8 rounded-xl border ${plan.popular ? 'border-primary shadow-lg' : 'shadow-sm'} transition-all duration-700 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${150 * (index + 1)}ms` }}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 right-8 bg-primary">
                  Most Popular
                </Badge>
              )}
              <h3 className="text-xl font-medium mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.buttonVariant} 
                className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                asChild
              >
                <Link to={plan.buttonText === "Contact Sales" ? "/contact" : "/signup"}>
                  {plan.buttonText}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <div className={`mt-12 text-center transition-all duration-700 delay-700 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-muted-foreground">
            Have questions about our pricing or need a custom solution?{" "}
            <Link to="/contact" className="text-primary font-medium hover:underline">
              Contact our sales team
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
} 