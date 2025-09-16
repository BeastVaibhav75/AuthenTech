import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--border))]/40 bg-background shadow-inner">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="font-bold text-primary mr-2 hidden md:inline">AuthenTech</Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} AuthenTech. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6">
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/contact"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}