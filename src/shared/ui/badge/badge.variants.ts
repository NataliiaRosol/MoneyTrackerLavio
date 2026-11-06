import { cva } from "class-variance-authority"

// прозора рамка в базі, щоб обидва варіанти мали однакову висоту
const badgeVariants = cva(
  "inline-flex shrink-0 items-center rounded-md border border-transparent px-1.5 py-px text-12 leading-none font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-surface text-muted",
        accent: "bg-lilac text-primary",
        success: "bg-teal/12 text-teal",
        danger: "bg-rose-pale text-rose",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export { badgeVariants }
