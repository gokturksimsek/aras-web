// Yapısal veri (schema.org) etiketi. "<" kaçırılır: metin içinde </script> kapanışı oluşamaz.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
