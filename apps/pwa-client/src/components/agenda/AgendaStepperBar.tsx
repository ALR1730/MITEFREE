'use client';

import React from 'react';
import { AGENDA_STEPS } from './types';

interface AgendaStepperBarProps {
  activeStep: number;
  onScrollToSection: (sectionId: string, offset?: number) => void;
}

export function AgendaStepperBar({ activeStep, onScrollToSection }: AgendaStepperBarProps) {
  return (
    <div className="flex items-center justify-between mb-8 max-w-lg mx-auto px-2">
      {AGENDA_STEPS.map((s, idx) => {
        const IconComp = s.icon;
        return (
          <div key={s.num} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onScrollToSection(s.id, 80)}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 cursor-pointer ${
                  activeStep >= s.num
                    ? 'bg-gradient-to-tr from-brand-600 to-cyan-400 text-dark-bg tech-glow shadow-md scale-105'
                    : 'bg-dark-surface border border-dark-border text-gray-500 hover:text-gray-300'
                }`}
                title={`Ir a ${s.label}`}
              >
                <IconComp className="w-4 h-4" />
              </button>
              <span
                className={`text-[10px] sm:text-[11px] font-medium mt-1 text-center whitespace-nowrap ${
                  activeStep >= s.num ? 'text-brand-300 font-bold' : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < AGENDA_STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1.5 -mt-3.5 transition-colors ${
                  activeStep > s.num
                    ? 'bg-gradient-to-r from-brand-500 to-cyan-400'
                    : 'bg-dark-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
