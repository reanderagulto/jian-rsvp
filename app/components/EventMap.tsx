export default function EventMap({
  query,
  title,
}: {
  query: string;
  title: string;
}) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return (
    <div className="glass rounded-3xl overflow-hidden border-t-4 border-t-deep-blue min-h-[320px] h-full">
      <iframe
        title={title}
        src={src}
        className="w-full h-full min-h-[320px] border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
