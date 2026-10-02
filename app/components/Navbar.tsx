"use client";
import { useEffect, useState } from "react";
import { type Settings, assetUrl } from "@/lib/supabase";

const BASE_LINKS = [
  { href: "#details", label: "Event details" },
  { href: "#gifts", label: "Gift Registry" },
  { href: "#messages", label: "Message Board" },
];

export default function Navbar({
  s,
  hasGallery = false,
}: {
  s: Settings;
  hasGallery?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const LINKS = hasGallery
    ? [
        BASE_LINKS[0],
        { href: "#gallery", label: "Gallery" },
        ...BASE_LINKS.slice(1),
      ]
    : BASE_LINKS;

  // Close the menu with the Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="glass rounded-b-2xl h-16 px-6 flex items-center justify-between">
          <a href="/" className="heading text-xl">
            {s.favicon && (
              <img
                src={assetUrl(s.favicon)}
                alt={`Photo of ${s.babyName}`}
                className="h-8 w-auto inline-block mr-2"
              />
            )}
            Jian{" "}
            <span className="text-gold-accent font-light italic">Enoch</span>
          </a>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-soft">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-deep-blue">
                {l.label}
              </a>
            ))}
            <a
              href="#rsvp"
              className="px-5 py-2 rounded-full bg-deep-blue text-white hover:bg-slate-soft"
            >
              RSVP
            </a>
          </div>

          {/* Hamburger button (mobile only) */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="md:hidden p-2 -mr-2 rounded-lg text-deep-blue hover:bg-powder-light focus:outline-none focus:ring-2 focus:ring-deep-blue"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown: slides down on open, slides up on close */}
        <div
          id="mobile-menu"
          aria-hidden={!open}
          className={`md:hidden grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-in-out motion-reduce:transition-none ${
            open
              ? "grid-rows-[1fr] opacity-100 visible"
              : "grid-rows-[0fr] opacity-0 invisible"
          }`}
        >
          <div className="overflow-hidden min-h-0">
            <div className="glass rounded-2xl mt-2 p-4 flex flex-col text-center font-medium text-slate-soft shadow-xl">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-3 border-b border-powder-light hover:text-deep-blue"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#rsvp"
                onClick={() => setOpen(false)}
                className="mt-4 px-5 py-3 rounded-full bg-deep-blue text-white font-semibold hover:bg-slate-soft"
              >
                RSVP now
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
