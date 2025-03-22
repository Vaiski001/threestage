
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, Users, BarChart } from "lucide-react";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <Container>
        <div className={`max-w-4xl mx-auto text-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/10 bg-primary/5 text-sm font-medium mb-6 animate-fade-down">
            <span className="text-primary">Simplify Customer Enquiries</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-medium leading-tight md:leading-tight mb-6 text-balance animate-fade-down" style={{ animationDelay: "150ms" }}>
            Manage all your customer enquiries in one place
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance animate-fade-down" style={{ animationDelay: "300ms" }}>
            Streamline communication, track progress, and never miss a customer enquiry again with our powerful management system.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-down" style={{ animationDelay: "450ms" }}>
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link to="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link to="/demo">See Demo</Link>
            </Button>
          </div>
        </div>

        <div className="mt-20 md:mt-24 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 h-24 bottom-0 top-auto"></div>
          
          <div className={`glass-card rounded-xl overflow-hidden shadow-xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "500ms" }}>
            <div className="relative aspect-video md:aspect-[16/9] w-full bg-zinc-950 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-8 sm:p-12 md:p-16 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 w-full max-w-5xl mx-auto shadow-2xl">
                  <div className="flex flex-col md:flex-row md:h-[400px] gap-6">
                    <div className="w-full md:w-64 flex-shrink-0 glass-card rounded-lg p-4">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-sm font-medium">Channels</span>
                        <span className="text-xs text-muted-foreground">12</span>
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((item) => (
                          <div key={item} className="p-3 rounded-md bg-white/10 animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-1 glass-card rounded-lg p-4 overflow-hidden">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="glass-icon">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Enquiries</h3>
                          <p className="text-sm text-muted-foreground">Manage all customer communications</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                        {["New", "Pending", "Completed"].map((status, index) => (
                          <div key={status} className="glass-card rounded-lg p-3 h-full" style={{ animationDelay: `${600 + index * 100}ms` }}>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm font-medium">{status}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                                {index === 0 ? "8" : index === 1 ? "5" : "12"}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {[1, 2, 3].map((item) => (
                                <div key={item} className="p-2 rounded-md bg-white/10 animate-pulse"></div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {[
            {
              icon: <MessageSquare className="h-6 w-6" />,
              title: "Unified Inbox",
              description: "Collect enquiries from all channels in one central dashboard."
            },
            {
              icon: <Users className="h-6 w-6" />,
              title: "Team Collaboration",
              description: "Work together efficiently to handle customer requests."
            },
            {
              icon: <BarChart className="h-6 w-6" />,
              title: "Insightful Analytics",
              description: "Track performance and identify opportunities for improvement."
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className={`glass-card p-6 rounded-xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${800 + index * 100}ms` }}
            >
              <div className="glass-icon inline-flex mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
