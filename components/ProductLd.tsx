import { absolute } from '@/lib/site';
import type { Model } from '@/content/products';

/* Product structured data for one catalogue model. No offers: the catalogue
   carries no prices, and the site is a quote-based business. */
export function ProductLd({ model }: { model: Model }) {
  const url = absolute(`/products/${model.slug}/`);

  const properties = [
    ...(model.dims.length ? [{ name: 'ابعاد', value: model.dims.join(' | ') }] : []),
    ...(model.weight ? [{ name: 'وزن', value: model.weight }] : []),
    { name: 'کاربرد', value: model.use.join('، ') },
    ...(model.install ? [{ name: 'روش نصب', value: model.install }] : []),
  ];

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: `${model.code} — ${model.title}`,
    sku: model.code,
    description: model.line,
    image: absolute(model.photo),
    url,
    category: 'آکوستیک معماری',
    brand: { '@type': 'Brand', name: 'گروه مهندسی مدیس' },
    manufacturer: { '@id': `${absolute('/')}#organization` },
    additionalProperty: properties.map((p) => ({
      '@type': 'PropertyValue',
      name: p.name,
      value: p.value,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // the object above is ours; no user input reaches it
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}