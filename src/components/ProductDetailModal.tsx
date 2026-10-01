import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, ShoppingBag, Sparkles, Utensils, MessageSquare, Info } from 'lucide-react';
import { MenuItem, ProductOption, ProductAddon } from '../types/index.ts';
import { useRestaurant } from '../context/RestaurantContext.tsx';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose }) => {
  const { addToCart } = useRestaurant();

  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<ProductOption | undefined>(undefined);
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  // Initialize defaults on item open
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSelectedOption(item.options && item.options.length > 0 ? item.options[0] : undefined);
      setSelectedAddons([]);
      setExcludedIngredients([]);
      setNotes('');
      setAddedToast(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [item]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && item) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  // Toggle Addon
  const toggleAddon = (addon: ProductAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Toggle Excluded ingredient
  const toggleExcluded = (ing: string) => {
    if (excludedIngredients.includes(ing)) {
      setExcludedIngredients(excludedIngredients.filter((i) => i !== ing));
    } else {
      setExcludedIngredients([...excludedIngredients, ing]);
    }
  };

  // Calculate live total
  const optionCost = selectedOption ? selectedOption.priceModifier : 0;
  const addonsCost = selectedAddons.reduce((acc, a) => acc + a.price, 0);
  const unitPrice = item.basePrice + optionCost + addonsCost;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    addToCart(item, quantity, selectedOption, selectedAddons, excludedIngredients, notes);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Container: Floating Card with margins on mobile */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl sm:rounded-[32px] overflow-hidden shadow-2xl border border-stone-200 max-h-[88vh] sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Glassmorphic Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 left-3.5 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md backdrop-blur-md flex items-center justify-center transition active:scale-90 cursor-pointer border border-stone-200/80"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image Header */}
        <div className="relative h-48 sm:h-60 w-full bg-stone-100 shrink-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-center"
          />
          {/* Gentle bottom edge gradient only for badge contrast, keeping food 100% bright and clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

          {/* Badges on Image */}
          <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-xs text-white z-10">
            <span className="font-black px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 shadow-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{item.tag || 'أصيل وطازج'}</span>
            </span>
            <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl font-bold text-amber-300 border border-white/10">
              يبدأ من {item.basePrice} ر.س
            </span>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 overscroll-contain">
          
          {/* Header Title & Pricing Card */}
          <div className="space-y-2 pb-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl sm:text-2xl font-black text-[#1A120D] tracking-tight leading-snug">
                {item.name}
              </h3>
              <div className="text-left shrink-0">
                <div className="text-xl sm:text-2xl font-black text-amber-900">
                  {unitPrice} <span className="text-xs font-bold text-stone-600">ريال</span>
                </div>
                {item.compareAtPrice && item.compareAtPrice > item.basePrice && (
                  <div className="text-xs text-stone-400 line-through font-bold">
                    {item.compareAtPrice} ريال
                  </div>
                )}
              </div>
            </div>

            {/* Description Box with High Contrast */}
            {item.description && (
              <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed bg-stone-50/90 p-3 rounded-2xl border border-stone-200/70">
                {item.description}
              </p>
            )}
          </div>

          {/* 1. Options (Sizes or Variations) */}
          {item.options && item.options.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-600" />
                  <span>اختر الحجم أو طريقة التقديم:</span>
                </label>
                <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">مطلوب</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.options.map((opt) => {
                  const isSelected = selectedOption?.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOption(opt)}
                      className={`p-3 rounded-2xl border text-right transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-stone-950 font-black shadow-xs ring-1 ring-amber-500'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-amber-600 bg-amber-600' : 'border-stone-300'
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs">{opt.name}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-800">
                        {opt.priceModifier > 0 ? `+${opt.priceModifier} ريال` : 'السعر الأساسي'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Add-ons */}
          {item.addons && item.addons.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-stone-100">
              <label className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>إضافات مميزة حسب ذوقك:</span>
              </label>

              <div className="space-y-1.5">
                {item.addons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs ring-1 ring-emerald-400'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                          isChecked ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' : 'border-stone-300 bg-stone-50'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-bold">{addon.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-lg">
                        +{addon.price} ريال
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Removable ingredients */}
          {item.removableIngredients && item.removableIngredients.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-stone-100">
              <label className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>تفضيلات المكونات (انقر للاستبعاد):</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {item.removableIngredients.map((ing) => {
                  const isExcluded = excludedIngredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      type="button"
                      onClick={() => toggleExcluded(ing)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                        isExcluded
                          ? 'bg-red-50 border-red-300 text-red-700 line-through'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {isExcluded && <X className="w-3 h-3 text-red-500" />}
                      <span>{ing}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Special notes */}
          <div className="space-y-1.5 pt-3 border-t border-stone-100">
            <label className="text-xs font-black text-stone-900 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              <span>ملاحظات خاصة للشيف (اختياري):</span>
            </label>
            <input
              type="text"
              maxLength={120}
              placeholder="مثال: تحمير خفيف، شطة زيادة، ليمون على جنب..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-2xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition bg-white"
            />
          </div>

        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="p-3.5 sm:p-4 bg-stone-50/95 backdrop-blur-md border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          
          {/* Quantity Counter */}
          <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-2xl border border-stone-300 shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center transition active:scale-90 cursor-pointer"
              aria-label="إنقاص الكمية"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-7 text-center font-black text-sm text-stone-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center transition active:scale-90 cursor-pointer"
              aria-label="زيادة الكمية"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Primary Button */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-xs sm:text-sm shadow-md transition active:scale-98 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>{addedToast ? '✓ تمت الإضافة بنجاح!' : 'إضافة إلى السلة'}</span>
            </div>
            <span className="font-extrabold text-sm sm:text-base">
              {totalPrice} ريال
            </span>
          </button>

        </div>

      </div>
    </div>
  );
};
