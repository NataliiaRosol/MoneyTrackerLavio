import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { textVariants } from "./text.variants";

type TextTagName =
  "p" | "span" | "div" | "label" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type TextProps = useRender.ComponentProps<"p"> &
  VariantProps<typeof textVariants> & {
    as?: TextTagName;
  };

function Text({
  className,
  color,
  size,
  weight,
  as,
  render,
  ...props
}: TextProps) {
  return useRender({
    defaultTagName: as ?? "p",
    render,
    props: mergeProps<"p">(
      {
        className: cn(textVariants({ color, size, weight, className })),
      },
      props,
    ),
    state: {
      slot: "text",
    },
  });
}

export { Text };
export type { TextProps };
