"use client";

// Mobile menu: Sheet-based navigation for small screens with explore detail and social row.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { m } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { primaryNav, exploreNav } from "@/config/navigation";
import type { NavItem } from "@/types/navigation";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { useUIStore } from "@/stores/ui-store";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/animations/variants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SocialLinks } from "@/components/common/social-links";

export function MobileMenu() {
  const pathname = usePathname();
  const { isMobileMenuOpen, setMobileMenu } = useUIStore();
  const reducedMotion = useReducedMotion();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const close = () => setMobileMenu(false);

  const renderPrimary = (item: NavItem) => {
    const active = isActive(item.href);
    const Icon = getIcon(item.icon);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        onClick={close}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base transition-colors",
          active
            ? "bg-surface-2 font-semibold text-foreground"
            : "font-medium text-foreground-muted hover:bg-surface-1 hover:text-foreground",
        )}
      >
        {Icon ? <Icon className="size-5 shrink-0" aria-hidden="true" /> : null}
        <span>{item.label}</span>
        {active ? <span aria-hidden="true" className="ml-auto size-1.5 bg-signal" /> : null}
      </Link>
    );
  };

  const renderExplore = (item: NavItem) => {
    const active = isActive(item.href);
    const Icon = getIcon(item.icon);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        onClick={close}
        className={cn(
          "flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors",
          active ? "bg-surface-2" : "hover:bg-surface-1",
        )}
      >
        {Icon ? (
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-foreground-muted">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{item.label}</span>
          {item.description ? (
            <span className="text-xs text-foreground-muted">{item.description}</span>
          ) : null}
        </span>
        {active ? <span aria-hidden="true" className="mt-2 ml-auto size-1.5 bg-signal" /> : null}
      </Link>
    );
  };

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenu}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full max-w-sm flex-col gap-0 p-0">
        <SheetHeader className="border-b border-border px-4">
          <SheetTitle className="font-display text-lg">{siteConfig.name}</SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation, sections, and links
          </SheetDescription>
        </SheetHeader>

        <m.nav
          aria-label="Mobile"
          className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4"
          variants={reducedMotion ? undefined : staggerContainer()}
          initial={reducedMotion ? false : "hidden"}
          animate={reducedMotion ? false : "visible"}
        >
          {primaryNav.map((item) => (
            <m.div key={item.href} variants={reducedMotion ? undefined : fadeInUp}>
              {renderPrimary(item)}
            </m.div>
          ))}

          <m.div
            variants={reducedMotion ? undefined : fadeInUp}
            className="my-3 h-px bg-border"
            role="presentation"
          />

          <m.p
            variants={reducedMotion ? undefined : fadeInUp}
            className="px-3 pb-1 font-mono text-xs tracking-widest text-foreground-subtle uppercase"
          >
            Explore
          </m.p>
          {exploreNav.map((item) => (
            <m.div key={item.href} variants={reducedMotion ? undefined : fadeInUp}>
              {renderExplore(item)}
            </m.div>
          ))}
        </m.nav>

        <div className="mt-auto flex flex-col gap-4 border-t border-border px-4 py-5">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild className="flex-1">
              <Link href={ROUTES.contact} onClick={close}>
                Contact
              </Link>
            </Button>
          </div>
          <SocialLinks size="sm" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
