
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";

interface CustomerStatProps {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

interface CustomerDemoViewProps {
  stats: CustomerStatProps[];
}

export const CustomerDemoView = ({ stats }: CustomerDemoViewProps) => {
  return (
    <>
      <div className="pt-8 pb-4 px-4 sm:px-6">
        <Container size="full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-semibold mb-1">
                Demo Customer Dashboard
              </h1>
              <p className="text-muted-foreground">
                View your enquiries, payments, and account information.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">View History</Button>
              <Button>New Enquiry</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((card, i) => (
              <div key={i} className="glass-card rounded-lg p-6">
                <div className="text-muted-foreground mb-2">{card.label}</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-semibold">{card.value}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    card.changeType === "positive" 
                      ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950/30" 
                      : card.changeType === "negative"
                        ? "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/30"
                        : "text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-950/30"
                  }`}>
                    {card.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <div className="px-4 sm:px-6 pb-8">
        <Container size="full">
          <div className="glass-card rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Recent Enquiries</h2>
            <div className="space-y-4">
              {[
                { id: "ENQ-001", title: "Website Redesign", status: "In Progress", date: "Jun 12, 2023", tags: ["Design", "Web"] },
                { id: "ENQ-002", title: "SEO Consultation", status: "Completed", date: "May 28, 2023", tags: ["Marketing"] },
                { id: "ENQ-003", title: "Mobile App Development", status: "Pending Payment", date: "Jun 5, 2023", tags: ["Development", "Mobile"] }
              ].map((enquiry) => (
                <div key={enquiry.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-md border bg-card">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{enquiry.title}</span>
                      <span className="text-xs text-muted-foreground">{enquiry.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{enquiry.date}</span>
                      <div className="flex gap-1">
                        {enquiry.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 self-start">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      enquiry.status === "Completed" 
                        ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" 
                        : enquiry.status === "In Progress"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                          : "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                    }`}>
                      {enquiry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">View All Enquiries</Button>
            </div>
          </div>
          
          <div className="glass-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
            <div className="space-y-4">
              {[
                { id: 1, title: "Invoice #INV-002 Due", description: "Your invoice for SEO Consultation is due in 3 days", time: "2 hours ago", read: false },
                { id: 2, title: "Enquiry Status Updated", description: "Your Website Redesign enquiry has been moved to In Progress", time: "yesterday", read: true },
                { id: 3, title: "New Message", description: "You have a new message from the support team regarding your Mobile App Development enquiry", time: "2 days ago", read: true }
              ].map((notification) => (
                <div key={notification.id} className={`p-4 rounded-md border ${notification.read ? 'bg-card' : 'bg-primary/5 border-primary/20'}`}>
                  <div className="flex justify-between">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">View All Notifications</Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
