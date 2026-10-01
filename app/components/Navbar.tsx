import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="glass rounded-b-2xl h-16 px-6 flex items-center justify-between">
          <a href="/" className="heading text-xl">
            Jian{" "}
            <span className="text-gold-accent font-light italic">Enoch</span>
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-soft">
            <a href="#details" className="hover:text-deep-blue">
              Event details
            </a>
            <a href="#needs" className="hover:text-deep-blue">
              Baby&apos;s needs
            </a>
            <a href="#messages" className="hover:text-deep-blue">
              Blessings
            </a>
            <a
              href="#rsvp"
              className="px-5 py-2 rounded-full bg-deep-blue text-white hover:bg-slate-soft"
            >
              RSVP
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
