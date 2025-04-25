"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      offset="20px"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:pr-10 group-[.toaster]:py-4 group-[.toaster]:pl-4 group-[.toaster]:relative flex items-center gap-6",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton: "!absolute !right-3 !left-auto !top-1/2 !-translate-y-1/2 !opacity-70 hover:!opacity-100 !transition-opacity",
          icon: "p-2 mr-3 -ml-3",
          success: "[&>div>svg]:bg-green-100 [&>div>svg]:dark:bg-green-900/20 [&>div>svg]:rounded-md [&>div>svg]:p-2.5 [&>div>svg]:box-content [&>div>svg]:w-10 [&>div>svg]:h-10 [&>div>svg]:flex [&>div>svg]:items-center [&>div>svg]:justify-center [&>div>svg]:text-green-600 [&>div>svg]:dark:text-green-400 [&>div>svg]:w-5 [&>div>svg]:h-5",
          error: "[&>div>svg]:bg-red-100 [&>div>svg]:dark:bg-red-900/20 [&>div>svg]:rounded-md [&>div>svg]:p-2.5 [&>div>svg]:box-content [&>div>svg]:w-10 [&>div>svg]:h-10 [&>div>svg]:flex [&>div>svg]:items-center [&>div>svg]:justify-center [&>div>svg]:text-red-600 [&>div>svg]:dark:text-red-400 [&>div>svg]:w-5 [&>div>svg]:h-5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
