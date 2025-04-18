import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/ThemeContext"

export function ModeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative h-[1.2rem] w-[1.2rem]">
        <Sun className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`} />
        <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDarkMode ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`} />
      </div>
      <span className="sr-only">{isDarkMode ? "Switch to light mode" : "Switch to dark mode"}</span>
    </Button>
  )
} 