import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  // Get theme from document or default to 'light'
  const getTheme = () => {
    // Check if we're in a browser environment
    if (typeof document !== 'undefined') {
      // Get theme from data-theme attribute or from localStorage if set
      const dataTheme = document.documentElement.getAttribute('data-theme');
      const storedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
      return dataTheme || storedTheme || 'light';
    }
    return 'light'; // Default theme for SSR
  };
  
  const theme = getTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
