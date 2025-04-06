import { Button } from "@/components/ui/button";

export default function TestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Test Page</h1>
      <p className="mb-4">If you can see this page, routing is working correctly.</p>
      <div className="p-6 border rounded-lg bg-card shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Route Debugging Information</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Current URL: <code className="bg-secondary p-1 rounded">{window.location.href}</code>
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Pathname: <code className="bg-secondary p-1 rounded">{window.location.pathname}</code>
        </p>
        <Button onClick={() => alert("Button clicked - JavaScript is working")}>
          Test JavaScript
        </Button>
      </div>
    </div>
  );
} 