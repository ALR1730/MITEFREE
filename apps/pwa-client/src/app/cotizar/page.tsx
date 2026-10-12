'use client';

import { Suspense } from 'react';
import type { CatalogItem } from '@mitefree/shared-types';
import {
  type SelectedQuoteItem,
  useCotizadorState,
  CotizadorHeader,
  OrderSummaryTray,
  CategorySelectorGrid,
  ModelCustomizerCard,
  FabricAndStainsStep,
  QuoteSummaryStep,
  StickyBottomCartBar,
} from '@/components/cotizador';

export type { CatalogItem, SelectedQuoteItem };

function CotizadorContent() {
  const state = useCotizadorState();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 pb-32">
      {/* Header & Stepper Wizard Bar */}
      <CotizadorHeader
        currentStep={state.currentStep}
        isMinimumOrderMet={state.isMinimumOrderMet}
        goToStep={state.goToStep}
      />

      {/* ================= PASO 1: SELECCIÓN DE PIEZAS & PERSONALIZADOR ================= */}
      {state.currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Bandeja de Piezas Seleccionadas y Mínimo a Domicilio */}
          <OrderSummaryTray
            selectedItems={state.selectedItems}
            totalItemsCount={state.totalItemsCount}
            activeSubtotal={state.activeSubtotal}
            isMinimumOrderMet={state.isMinimumOrderMet}
            amountMissingForMinimum={state.amountMissingForMinimum}
            minProgressPercentage={state.minProgressPercentage}
            onUpdateQuantity={state.handleUpdateItemQuantity}
            onRemoveItem={state.handleRemoveItem}
            onProceed={() => state.goToStep(2)}
          />

          {/* Cuadrícula 2x2 de Categorías Principales */}
          <CategorySelectorGrid
            selectedMainCategory={state.selectedMainCategory}
            hasItemsInOrder={state.selectedItems.length > 0}
            getCategoryStartingPrice={state.getCategoryStartingPrice}
            getCategoryCount={state.getCategoryCount}
            onSelectCategory={state.handleSelectCategory}
            onScrollToCustomizer={() => state.scrollToSection('customizer-section', 70)}
          />

          {/* Personalizador en Vivo del Modelo Seleccionado */}
          <ModelCustomizerCard
            selectedMainCategory={state.selectedMainCategory}
            filteredCatalog={state.filteredCatalog}
            selectedItemId={state.selectedItemId}
            currentCatalogItem={state.currentCatalogItem}
            currentBothSides={state.currentBothSides}
            currentExtraSeats={state.currentExtraSeats}
            currentQty={state.currentQty}
            customLength={state.customLength}
            customWidth={state.customWidth}
            currentUnitPrice={state.currentUnitPrice}
            currentItemTotal={state.currentItemTotal}
            selectedItems={state.selectedItems}
            itemsSubtotal={state.itemsSubtotal}
            totalItemsCount={state.totalItemsCount}
            addedFeedback={state.addedFeedback}
            onSelectModel={state.handleSelectModel}
            onSelectBothSides={state.handleSelectBothSides}
            onSelectChairPreset={state.handleSelectChairPreset}
            onUpdateTempQuantity={(delta) =>
              state.setTempQuantity((prev) => ({
                ...prev,
                [state.currentCatalogItem.id]: Math.max(1, state.currentQty + delta),
              }))
            }
            onUpdateExtraSeats={(delta) =>
              state.setTempExtraSeats((prev) => ({
                ...prev,
                [state.currentCatalogItem.id]: Math.max(0, state.currentExtraSeats + delta),
              }))
            }
            onUpdateCustomLength={(delta) =>
              state.setCustomLength(
                Math.max(1.0, Math.min(10.0, Math.round((state.customLength + delta) * 10) / 10)),
              )
            }
            onUpdateCustomWidth={(delta) =>
              state.setCustomWidth(
                Math.max(0.5, Math.min(6.0, Math.round((state.customWidth + delta) * 10) / 10)),
              )
            }
            onScrollToQuantity={() => state.scrollToSection('active-quantity-section', 80)}
            onProceedFromCustomizer={state.handleProceedFromCustomizer}
            onAddAndSelectAnother={state.handleAddAndSelectAnother}
            onProceedAndAddCurrent={state.handleProceedAndAddCurrent}
            onProceedWithExistingItems={state.handleProceedWithExistingItems}
          />
        </div>
      )}

      {/* ================= PASO 2: TIPO DE TELA, MANCHAS & FOTO EVIDENCIA ================= */}
      {state.currentStep === 2 && (
        <FabricAndStainsStep
          selectedFabric={state.selectedFabric}
          selectedStain={state.selectedStain}
          uploadedPhotos={state.uploadedPhotos}
          totalItemsCount={state.totalItemsCount}
          activeSubtotal={state.activeSubtotal}
          fabricMultiplier={state.fabricMultiplier}
          stainSurcharge={state.stainSurcharge}
          subtotalWithFabric={state.subtotalWithFabric}
          onSelectFabric={state.handleSelectFabric}
          onSelectStain={state.handleSelectStain}
          onFileUpload={state.handleFileUpload}
          onRemovePhoto={state.handleRemovePhoto}
          onGoToStep={state.goToStep}
        />
      )}

      {/* ================= PASO 3: RESUMEN, CUPÓN & CONFIRMACIÓN ================= */}
      {state.currentStep === 3 && (
        <QuoteSummaryStep
          selectedItems={state.selectedItems}
          totalItemsCount={state.totalItemsCount}
          selectedFabric={state.selectedFabric}
          selectedStain={state.selectedStain}
          promoCode={state.promoCode}
          couponApplied={state.couponApplied}
          couponDiscount={state.couponDiscount}
          total={state.total}
          isSubmittingQuotation={state.isSubmittingQuotation}
          onPromoCodeChange={state.setPromoCode}
          onApplyCoupon={state.handleApplyCoupon}
          onGoToStep={state.goToStep}
          onProceedToSchedule={state.handleProceedToSchedule}
          whatsappMessage={state.generateWhatsAppMessage()}
          persistedQuotationId={state.persistedQuotationId}
          pdfDownloadUrl={state.pdfDownloadUrl}
        />
      )}

      {/* Barra Flotante Inferior en Móvil */}
      <StickyBottomCartBar
        selectedItems={state.selectedItems}
        currentStep={state.currentStep}
        totalItemsCount={state.totalItemsCount}
        itemsSubtotal={state.itemsSubtotal}
        isMinimumOrderMet={state.isMinimumOrderMet}
        amountMissingForMinimum={state.amountMissingForMinimum}
        onProceed={() => state.goToStep(2)}
      />
    </div>
  );
}

export default function CotizadorPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400">
          Cargando catálogo de servicios Mite Free Clean...
        </div>
      }
    >
      <CotizadorContent />
    </Suspense>
  );
}
