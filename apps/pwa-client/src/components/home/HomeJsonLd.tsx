export function HomeJsonLd() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Mite Free Clean',
    alternateName: 'MITEFREE',
    description:
      'Servicio profesional de limpieza profunda, desinfección UV-C y lavado a domicilio de colchones, muebles, alfombras y sillas en República Dominicana.',
    url: 'https://mitefree.com',
    telephone: '+1-809-513-4773',
    priceRange: 'RD$ 300 - RD$ 4,000',
    areaServed: [
      {
        '@type': 'City',
        name: 'San Pedro de Macorís',
      },
      {
        '@type': 'City',
        name: 'La Romana',
      },
      {
        '@type': 'City',
        name: 'Santo Domingo Este',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de Limpieza y Desinfección',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Limpieza y Desinfección de Colchones',
            description: 'Eliminación profunda de ácaros, bacterias y manchas con extracción térmica.',
          },
          price: '2500',
          priceCurrency: 'DOP',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Lavado de Muebles y Sofás',
            description: 'Extracción hidrocinética y tratamiento anti-olores para tapicería.',
          },
          price: '1500',
          priceCurrency: 'DOP',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Lavado de Alfombras',
            description: 'Limpieza profunda de fibras con secado acelerado.',
          },
          price: '600',
          priceCurrency: 'DOP',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Limpieza de Sillas de Comedor',
            description: 'Desmanchado cuidadoso y protección de tejidos.',
          },
          price: '300',
          priceCurrency: 'DOP',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
