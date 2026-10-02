import { cva } from "class-variance-authority"

const textVariants = cva("", {
  variants: {
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      destructive: "text-destructive",
      ink: "text-ink",
      violet: "text-violet",
      rose: "text-rose",
      teal: "text-teal",
      white: "text-white",
    },
    size: {
      xs: "text-12",
      sm: "text-14",
      base: "text-16",
      xl: "text-30",
      display: "text-44",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    color: "default",
    size: "base",
    weight: "regular",
  },
})

export { textVariants }
