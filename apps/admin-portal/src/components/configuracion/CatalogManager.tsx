'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  RotateCcw,
  Search,
  X,
  Edit3,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  Check,
} from 'lucide-react';
import type { CatalogItem, MainCategory } from '@mitefree/shared-types';
import { adminApiClient } from '@/lib/api-client';

interface CatalogManagerProps {
  catalogItems: CatalogItem[];
  setCatalogItems: React.Dispatch<React.SetStateAction<CatalogItem[]>>;
}

export function CatalogManager({ catalogItems, setCatalogItems }: CatalogManagerProps) {
  const [catalogFilter, setCatalogFilter] = useState<string>('ALL');
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [catalogFeedback, setCatalogFeedback] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const initialFormState: {
    id?: string;
    name: string;
    category: MainCategory;
    basePrice: number;
    bothSidesPrice: number | undefined;
    subtitle: string;
    dimensions: string;
    iconText: string;
    image: string;
    isMattress: boolean;
    isSofaModular: boolean;
    isChair: boolean;
    isRug: boolean;
    isCustomRug: boolean;
  } = {
    name: '',
    category: 'Colchones',
    basePrice: 2500,
    bothSidesPrice: 3000,
    subtitle: '',
    dimensions: '',
    iconText: '🛏️',
    image: '/cat-mattress.jpg',
    isMattress: true,
    isSofaModular: false,
    isChair: false,
    isRug: false,
    isCustomRug: false,
  };

  const [formItem, setFormItem] = useState(initialFormState);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormItem(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CatalogItem) => {
    setIsEditing(true);
    setFormItem({
      id: item.id,
      name: item.name,
      category: item.category,
      basePrice: item.basePrice,
      bothSidesPrice: item.bothSidesPrice,
      subtitle: item.subtitle || '',
      dimensions: item.dimensions || '',
      iconText: item.iconText || '🪑',
      image: item.image || '/cat-chair.jpg',
      isMattress: Boolean(item.isMattress),
      isSofaModular: Boolean(item.isSofaModular),
      isChair: Boolean(item.isChair),
      isRug: Boolean(item.isRug),
      isCustomRug: Boolean(item.isCustomRug),
    });
    setIsModalOpen(true);
  };

  const handleFormCategoryChange = (newCat: MainCategory) => {
    let icon = '🪑';
    let img = '/cat-chair.jpg';
    let isMat = false;
    let isMod = false;
    let isCh = false;
    let isR = false;
    let isCustR = false;
    let bothSides = formItem.bothSidesPrice;

    if (newCat === 'Colchones') {
      icon = '🛏️';
      img = '/cat-mattress.jpg';
      isMat = true;
      bothSides = bothSides || formItem.basePrice + 500;
    } else if (newCat === 'Muebles de Sala') {
      icon = '🛋️';
      img = '/cat-sofa.jpg';
      bothSides = undefined;
    } else if (newCat === 'Sillas de Comedor') {
      icon = '🪑';
      img = '/cat-chair.jpg';
      isCh = true;
      bothSides = undefined;
    } else if (newCat === 'Alfombras') {
      icon = '🧶';
      img = '/cat-rug.jpg';
      isR = true;
      bothSides = undefined;
    }

    setFormItem((prev) => ({
      ...prev,
      category: newCat,
      iconText: icon,
      image: img,
      isMattress: isMat,
      isSofaModular: isMod,
      isChair: isCh,
      isRug: isR,
      isCustomRug: isCustR,
      bothSidesPrice: bothSides,
    }));
  };

  const handleSaveItem = async () => {
    if (!formItem.name.trim()) {
      alert('Por favor indica el nombre del artículo.');
      return;
    }
    if (formItem.basePrice <= 0 || isNaN(formItem.basePrice)) {
      alert('Por favor indica un precio base válido mayor a 0.');
      return;
    }

    const payload: CatalogItem = {
      id: formItem.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: formItem.name.trim(),
      category: formItem.category,
      basePrice: Number(formItem.basePrice),
      bothSidesPrice:
        formItem.category === 'Colchones' && formItem.bothSidesPrice
          ? Number(formItem.bothSidesPrice)
          : undefined,
      subtitle: formItem.subtitle.trim() || undefined,
      dimensions: formItem.dimensions.trim() || undefined,
      iconText: formItem.iconText || '🪑',
      image: formItem.image || '/cat-chair.jpg',
      isMattress: formItem.isMattress,
      isSofaModular: formItem.isSofaModular,
      isChair: formItem.isChair,
      isRug: formItem.isRug,
      isCustomRug: formItem.isCustomRug,
    };

    try {
      if (isEditing && formItem.id) {
        await adminApiClient.catalog.update(formItem.id, payload);
        const updated = catalogItems.map((it) => (it.id === formItem.id ? payload : it));
        setCatalogItems(updated);
        if (typeof window !== 'undefined') {
          localStorage.setItem('mitefree_catalog_items', JSON.stringify(updated));
        }
        setCatalogFeedback({
          message: `Artículo "${payload.name}" actualizado correctamente (precio y valores sincronizados).`,
          type: 'success',
        });
      } else {
        await adminApiClient.catalog.create(payload);
        const updated = [...catalogItems, payload];
        setCatalogItems(updated);
        if (typeof window !== 'undefined') {
          localStorage.setItem('mitefree_catalog_items', JSON.stringify(updated));
        }
        setCatalogFeedback({
          message: `Nuevo artículo "${payload.name}" creado con éxito en el catálogo.`,
          type: 'success',
        });
      }
    } catch {
      const updated = isEditing
        ? catalogItems.map((it) => (it.id === formItem.id ? payload : it))
        : [...catalogItems, payload];
      setCatalogItems(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mitefree_catalog_items', JSON.stringify(updated));
      }
      setCatalogFeedback({
        message: `Guardado en almacenamiento local: "${payload.name}".`,
        type: 'success',
      });
    }

    setIsModalOpen(false);
    setTimeout(() => setCatalogFeedback(null), 4000);
  };

  const handleDeleteItem = async (id: string, name: string) => {
    try {
      await adminApiClient.catalog.delete(id);
    } catch {
      // Ignorar error si API offline
    }

    const updated = catalogItems.filter((it) => it.id !== id);
    setCatalogItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mitefree_catalog_items', JSON.stringify(updated));
    }
    setDeleteConfirmId(null);
    setCatalogFeedback({
      message: `El artículo "${name}" ha sido ELIMINADO TOTALMENTE del catálogo.`,
      type: 'success',
    });
    setTimeout(() => setCatalogFeedback(null), 4000);
  };

  const handleResetCatalog = async () => {
    if (
      !confirm(
        '¿Deseas restaurar el catálogo completo a los 13 artículos canónicos oficiales del Flyer? Todos los precios personalizados se restablecerán a fábrica.',
      )
    ) {
      return;
    }

    try {
      const res = await adminApiClient.catalog.reset();
      if (res.success && res.data) {
        setCatalogItems(res.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('mitefree_catalog_items', JSON.stringify(res.data));
        }
        setCatalogFeedback({
          message: 'Catálogo restaurado a sus 13 artículos canónicos oficiales de fábrica.',
          type: 'success',
        });
        setTimeout(() => setCatalogFeedback(null), 4000);
        return;
      }
    } catch {
      // Ignorar si API offline
    }
  };

  const filteredItems = catalogItems.filter((it) => {
    const matchesCat = catalogFilter === 'ALL' || it.category === catalogFilter;
    const matchesSearch =
      catalogSearch.trim() === '' ||
      it.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (it.subtitle && it.subtitle.toLowerCase().includes(catalogSearch.toLowerCase())) ||
      (it.dimensions && it.dimensions.toLowerCase().includes(catalogSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="admin-card rounded-2xl p-6 border border-cyan-500/30 admin-glow-cyan space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-admin-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Package className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                <span>Catálogo Dinámico de Artículos & Tarifas</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 normal-case">
                  CRUD Completo
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Edita cualquier valor (nombre, precio base, ambos lados, descripción, dimensiones) o
                elimina artículos por completo del cotizador.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md admin-glow-cyan active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nuevo Artículo</span>
          </button>
          <button
            type="button"
            onClick={handleResetCatalog}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-admin-sidebar hover:bg-admin-hover text-gray-300 hover:text-white border border-admin-border text-xs font-semibold active:scale-95 transition-all"
            title="Restaurar a los 13 artículos canónicos del flyer oficial"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Restaurar Flyer</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert Banner */}
      {catalogFeedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between animate-fadeIn ${
            catalogFeedback.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {catalogFeedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{catalogFeedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setCatalogFeedback(null)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: 'Todos', count: catalogItems.length },
            {
              id: 'Colchones',
              label: 'Colchones',
              count: catalogItems.filter((i) => i.category === 'Colchones').length,
            },
            {
              id: 'Muebles de Sala',
              label: 'Muebles',
              count: catalogItems.filter((i) => i.category === 'Muebles de Sala').length,
            },
            {
              id: 'Sillas de Comedor',
              label: 'Sillas',
              count: catalogItems.filter((i) => i.category === 'Sillas de Comedor').length,
            },
            {
              id: 'Alfombras',
              label: 'Alfombras',
              count: catalogItems.filter((i) => i.category === 'Alfombras').length,
            },
          ].map((cat) => {
            const isActive = catalogFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCatalogFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-500 text-dark-bg font-extrabold shadow-sm'
                    : 'bg-admin-sidebar text-gray-400 hover:text-white border border-admin-border'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-black/20 text-black' : 'bg-admin-card text-gray-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre o medida..."
            value={catalogSearch}
            onChange={(e) => setCatalogSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-admin-sidebar border border-admin-border text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-cyan-500"
          />
          {catalogSearch && (
            <button
              type="button"
              onClick={() => setCatalogSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {filteredItems.map((item) => {
          const isDeleting = deleteConfirmId === item.id;

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-admin-sidebar border border-admin-border hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3 relative group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-admin-border/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xl p-1.5 rounded-lg bg-admin-card border border-admin-border">
                      {item.iconText || '🪑'}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-admin-hover text-cyan-300 border border-admin-border uppercase font-semibold">
                        {item.category}
                      </span>
                      <span className="block text-[10px] text-gray-500 font-mono mt-0.5">
                        ID: {item.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg bg-admin-hover hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 border border-admin-border transition-all"
                      title="Editar valores de este artículo"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1.5 rounded-lg bg-admin-hover hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 border border-admin-border transition-all"
                      title="Eliminar del catálogo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{item.name}</h4>
                  {item.subtitle && (
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{item.subtitle}</p>
                  )}
                  {item.dimensions && (
                    <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-admin-card text-gray-300 border border-admin-border">
                      {item.dimensions}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-admin-border/50 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-sans">
                      {item.isMattress ? '1 Solo Lado:' : 'Precio Base:'}
                    </span>
                    <span className="font-bold text-cyan-300">
                      RD$ {item.basePrice.toLocaleString('es-DO')}
                    </span>
                  </div>
                  {item.bothSidesPrice && (
                    <div className="flex justify-between items-center text-emerald-400">
                      <span className="font-sans text-gray-400">Ambos Lados:</span>
                      <span className="font-bold">
                        RD$ {item.bothSidesPrice.toLocaleString('es-DO')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* In-Card Delete Confirmation Overlay */}
              {isDeleting && (
                <div className="absolute inset-0 bg-dark-bg/95 backdrop-blur-sm rounded-xl p-4 flex flex-col justify-center items-center text-center space-y-3 z-10 border border-rose-500/50 animate-fadeIn">
                  <AlertCircle className="w-8 h-8 text-rose-400" />
                  <div>
                    <span className="font-bold text-white text-xs block">
                      ¿Eliminar permanentemente?
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      "{item.name}" dejará de aparecer en el cotizador cliente.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1.5 rounded-lg bg-admin-hover text-gray-300 text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id, item.name)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
                    >
                      Confirmar Eliminación
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-admin-card border border-admin-border rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-admin-border">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <Package className="w-5 h-5" />
                </span>
                <h3 className="text-base font-bold text-white">
                  {isEditing ? 'Editar Artículo del Catálogo' : 'Crear Nuevo Artículo'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-admin-hover"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Categoría</label>
                  <select
                    value={formItem.category}
                    onChange={(e) => handleFormCategoryChange(e.target.value as MainCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-admin-sidebar border border-admin-border text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Colchones">Colchones</option>
                    <option value="Muebles de Sala">Muebles de Sala</option>
                    <option value="Sillas de Comedor">Sillas de Comedor</option>
                    <option value="Alfombras">Alfombras</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Ícono Emoji</label>
                  <input
                    type="text"
                    value={formItem.iconText}
                    onChange={(e) => setFormItem((prev) => ({ ...prev, iconText: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-admin-sidebar border border-admin-border text-white text-xs text-center font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  Nombre Oficial del Artículo *
                </label>
                <input
                  type="text"
                  value={formItem.name}
                  onChange={(e) => setFormItem((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Colchón Queen Size, Sofá en L (3 Plazas)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-admin-sidebar border border-admin-border text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">
                    {formItem.category === 'Colchones' ? 'Precio 1 Solo Lado (RD$) *' : 'Precio Base (RD$) *'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formItem.basePrice}
                    onChange={(e) =>
                      setFormItem((prev) => ({ ...prev, basePrice: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-admin-sidebar border border-admin-border text-white text-xs font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {formItem.category === 'Colchones' && (
                  <div>
                    <label className="block text-emerald-400 font-bold mb-1">
                      Precio Ambos Lados (RD$)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formItem.bothSidesPrice || ''}
                      onChange={(e) =>
                        setFormItem((prev) => ({
                          ...prev,
                          bothSidesPrice: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      placeholder="Ej: 3000"
                      className="w-full px-3 py-2 rounded-xl bg-admin-sidebar border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  Subtítulo / Descripción Corta
                </label>
                <input
                  type="text"
                  value={formItem.subtitle}
                  onChange={(e) => setFormItem((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Ej: Desinfección profunda por vaporización y extracción"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-admin-sidebar border border-admin-border text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  Dimensiones / Medidas (Opcional)
                </label>
                <input
                  type="text"
                  value={formItem.dimensions}
                  onChange={(e) =>
                    setFormItem((prev) => ({ ...prev, dimensions: e.target.value }))
                  }
                  placeholder="Ej: 2.00m × 1.50m (~3.0 m²)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-admin-sidebar border border-admin-border text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 border-t border-admin-border/60 space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Comportamiento Especial en el Cotizador
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formItem.isSofaModular}
                      onChange={(e) =>
                        setFormItem((prev) => ({ ...prev, isSofaModular: e.target.checked }))
                      }
                      className="w-4 h-4 rounded accent-cyan-400"
                    />
                    <span>Modular en L (+RD$ 500/plaza extra)</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formItem.isCustomRug}
                      onChange={(e) =>
                        setFormItem((prev) => ({ ...prev, isCustomRug: e.target.checked }))
                      }
                      className="w-4 h-4 rounded accent-cyan-400"
                    />
                    <span>Alfombra por m² personalizado</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-admin-border">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-admin-sidebar hover:bg-admin-hover text-gray-300 font-semibold text-xs border border-admin-border transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md admin-glow-cyan active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Guardar Cambios' : 'Crear Artículo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
