import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg text-14 font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-surface bg-white text-primary hover:bg-surface/40",
        active: "bg-violet text-white hover:bg-violet/90",
        cancel: "bg-rose-pale text-rose hover:bg-rose-pale/70",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "w-full px-2.5 py-2",
        icon: "size-9 shrink-0",
      },
    },
    compoundVariants: [
      {
        variant: "link",
        class: "h-auto w-auto rounded-none p-0",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export { buttonVariants }
