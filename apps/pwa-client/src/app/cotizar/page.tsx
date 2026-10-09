'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookingWizard3Steps, type MainCategory } from '@/components/BookingWizard3Steps';

function CotizarContent() {
  const searchParams = useSearchParams();
  const rawCat = searchParams.get('category')?.toLowerCase();

  let initialCat: MainCategory = 'colchones';
  if (rawCat === 'muebles' || rawCat === 'muebles de sala') initialCat = 'muebles';
  else if (rawCat === 'alfombras') initialCat = 'alfombras';
  else if (rawCat === 'sillas' || rawCat === 'sillas de comedor') initialCat = 'sillas';

  return (
    <div className="min-h-screen py-6 sm:py-10 px-3 sm:px-4 flex flex-col items-center justify-start">
      <BookingWizard3Steps initialCategory={initialCat} />
    </div>
  );
}

export default function CotizarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
          Cargando asistente de cotización...
        </div>
      }
    >
      <CotizarContent />
    </Suspense>
  );
}
