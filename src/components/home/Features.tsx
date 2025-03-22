
import { useState, useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { MessageSquare, Users, LineChart, Calendar, Link as LinkIcon, CreditCard } from "lucide-react";

export function Features() {
  const [activeTab, setActiveTab] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const features = [
    {
      title: "Multi-Channel Integration",
      description: "Connect and manage enquiries from all communication channels including Facebook, Instagram, WhatsApp, and your website forms.",
      icon: <MessageSquare className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2674&q=80"
    },
    {
      title: "Team Collaboration",
      description: "Assign enquiries to team members, add internal notes, and track progress collectively for better teamwork.",
      icon: <Users className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
    },
    {
      title: "Analytics Dashboard",
      description: "Gain insights into enquiry trends, response times, and conversion rates to optimize your customer service.",
      icon: <LineChart className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
    },
    {
      title: "Scheduling & Reminders",
      description: "Set follow-up reminders and never miss an important deadline or customer interaction.",
      icon: <Calendar className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2668&q=80"
    },
    {
      title: "Custom Form Builder",
      description: "Create and customize enquiry forms for your website that integrate directly with your dashboard.",
      icon: <LinkIcon className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
    },
    {
      title: "Payment Processing",
      description: "Generate invoices and accept payments directly through integrated payment gateways.",
      icon: <CreditCard className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
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
    <section id="features" className="py-20 md:py-32 bg-secondary/50" ref={sectionRef}>
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-medium mb-6 transition-all duration-700 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Everything you need to manage customer enquiries
          </h2>
          <p className={`text-muted-foreground text-lg transition-all duration-700 delay-150 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Our powerful features help you streamline communications, boost efficiency, and provide excellent customer service.
          </p>
        </div>

        <div className={`transition-all duration-700 delay-300 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 rounded-full text-sm transition-all-300 ${
                  activeTab === index
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  {feature.icon}
                  <span className="hidden md:inline">{feature.title}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className={`transition-all duration-500 ${activeTab === 0 ? 'order-last md:order-first' : ''}`}>
              <div className="glass-card rounded-xl overflow-hidden transition-all-300">
                <div className="relative aspect-video">
                  <img
                    src={features[activeTab].image}
                    alt={features[activeTab].title}
                    className="object-cover w-full h-full object-center transition-all-300"
                  />
                  <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm"></div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-icon inline-flex">
                {features[activeTab].icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-medium">{features[activeTab].title}</h3>
              <p className="text-muted-foreground text-lg">{features[activeTab].description}</p>
              
              <ul className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <li key={item} className="flex items-start">
                    <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 8.5L7 10L10.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-muted-foreground">
                      {activeTab === 0 && item === 1 && "Connect with social media platforms and messaging apps"}
                      {activeTab === 0 && item === 2 && "Manage website enquiry forms in one place"}
                      {activeTab === 0 && item === 3 && "Automatic channel detection and routing"}
                      
                      {activeTab === 1 && item === 1 && "Assign enquiries to specific team members"}
                      {activeTab === 1 && item === 2 && "Add internal notes visible only to your team"}
                      {activeTab === 1 && item === 3 && "Track activity and changes with detailed history"}
                      
                      {activeTab === 2 && item === 1 && "View response time and resolution metrics"}
                      {activeTab === 2 && item === 2 && "Track conversion rates from enquiry to customer"}
                      {activeTab === 2 && item === 3 && "Generate customizable reports for insights"}
                      
                      {activeTab === 3 && item === 1 && "Set follow-up reminders and deadlines"}
                      {activeTab === 3 && item === 2 && "Receive notifications for upcoming actions"}
                      {activeTab === 3 && item === 3 && "Sync with your calendar applications"}
                      
                      {activeTab === 4 && item === 1 && "Build custom forms with drag-and-drop ease"}
                      {activeTab === 4 && item === 2 && "Generate shareable links for your forms"}
                      {activeTab === 4 && item === 3 && "Embed forms directly on your website"}
                      
                      {activeTab === 5 && item === 1 && "Generate professional invoices from enquiries"}
                      {activeTab === 5 && item === 2 && "Accept payments through multiple gateways"}
                      {activeTab === 5 && item === 3 && "Track payment status and history"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
