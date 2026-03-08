import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      landing: "scroll-m-20 text-5xl font-extrabold tracking-tight text-balance",
      p: "leading-7",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm leading-none font-medium",
      muted: "text-sm text-muted-foreground",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      inlineCode:
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
    },
    size: {
      default: "",
      sm: "text-sm",
      lg: "text-lg",
    },
    font: {
      default: "",
      montserrat: "font-montserrat",
    },
  },
  defaultVariants: {
    variant: "p",
    size: "default",
    font: "default",
  },
})

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "landing"
  | "p"
  | "lead"
  | "large"
  | "small"
  | "muted"
  | "blockquote"
  | "inlineCode"

type TypographyElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "span"
  | "small"
  | "blockquote"
  | "code"
  | "div"

const variantElementMap: Record<TypographyVariant, TypographyElement> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  landing: "h1",
  p: "p",
  lead: "p",
  large: "p",
  small: "small",
  muted: "p",
  blockquote: "blockquote",
  inlineCode: "code",
}

type TypographyProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> &
  VariantProps<typeof typographyVariants> & {
    as?: TypographyElement
    children: React.ReactNode
  }

export function Typography({
  as,
  variant = "p",
  size,
  font,
  className,
  children,
  ...props
}: TypographyProps) {
  const resolvedVariant = variant as TypographyVariant
  const Component: TypographyElement = as ?? variantElementMap[resolvedVariant]

  return React.createElement(
    Component,
    {
      className: cn(
        typographyVariants({
          variant: resolvedVariant,
          size,
          font,
        }),
        className
      ),
      ...props,
    },
    children
  )
}