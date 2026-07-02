"use client";

// Site header: glassy sticky bar with primary nav, explore dropdown, theme toggle, and mobile menu.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { primaryNav, exploreNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileMenu } from "@/components/layout/mobile-menu";

export function Header() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Scroll-aware chrome: solid/glass after the hero, hide-on-down / reveal-on-up.
  // Hide/reveal motion is disabled under reduced motion (header stays pinned).
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(!reducedMotion && y > lastY && y > 240);
        lastY = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  // Contact has a dedicated filled CTA button, so keep it out of the inline rail.
  const mainNav = primaryNav.filter((item) => item.href !== ROUTES.contact);
  const exploreActive = exploreNav.some((item) => isActive(item.href));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-[transform,background-color,border-color] duration-300 will-change-transform",
        scrolled ? "glass border-border" : "border-transparent bg-transparent",
        hidden ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <Container size="wide" className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-lg font-display text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "font-semibold text-foreground"
                    : "font-medium text-foreground-muted hover:text-foreground",
                )}
              >
                {item.label}
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-px h-px bg-signal"
                  />
                ) : null}
              </Link>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "relative gap-1",
                  exploreActive
                    ? "font-semibold text-foreground"
                    : "text-foreground-muted hover:text-foreground",
                )}
              >
                Explore
                <ChevronDown className="size-4" aria-hidden="true" />
                {exploreActive ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-px h-px bg-signal"
                  />
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={10} className="w-72 p-2">
              {exploreNav.map((item) => {
                const Icon = getIcon(item.icon);
                const active = isActive(item.href);
                return (
                  <DropdownMenuItem key={item.href} asChild className="cursor-pointer p-0">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="flex items-start gap-3 rounded-lg px-2 py-2"
                    >
                      {Icon ? (
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                      ) : null}
                      <span className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                        {item.description ? (
                          <span className="text-xs text-foreground-muted">{item.description}</span>
                        ) : null}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link href={ROUTES.contact}>Contact</Link>
          </Button>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
