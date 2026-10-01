export default function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="text-center mb-10"><span className="eyebrow block mb-2">{eyebrow}</span><h2 className="heading text-3xl sm:text-5xl">{title}</h2></div>
}
