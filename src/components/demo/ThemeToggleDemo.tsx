import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function ThemeToggleDemo() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
        <CardDescription>Toggle between light and dark mode</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-6">
        <ThemeToggle />
      </CardContent>
    </Card>
  )
} 