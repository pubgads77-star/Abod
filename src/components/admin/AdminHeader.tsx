import React, { useState, useEffect } from 'react';
import { 
  Menu as MenuIcon, 
  ExternalLink, 
  Check, 
  ChevronDown
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.tsx';
import { StaffRole } from '../../types/index.ts';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenCommandPalette?: () => void;
  onPreviewSite: () => void;
  pageTitle: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileMenu,
  onPreviewSite,
  pageTitle,
}) => {
  const { 
    currentStaffUser,
    switchStaffRole
  } = useRestaurant();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowRoleMenu(false);
      }
    };
    if (showRoleMenu) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showRoleMenu]);

  const availableRoles: { role: StaffRole; label: string; desc: string }[] = [
    { role: 'manager', label: 'المدير العام', desc: 'صلاحيات كاملة على كل شيء' },
    { role: 'cashier', label: 'الكاشير', desc: 'الطلبات، الفواتير، الطاولات' },
    { role: 'kitchen', label: 'شيف المطبخ والتنور', desc: 'طلبات المطبخ وتجهيز الوجبات' },
    { role: 'waiter', label: 'كابتن الصالة', desc: 'خدمة الطاولات والـ QR' },
    { role: 'delivery', label: 'مندوب التوصيل', desc: 'طلبات التوصيل ومناطق عفيف' },
  ];

  return (
    <header className="h-16 bg-white border-b border-[#E2D7C7] px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-xs">
      
      {/* Right / Start (Mobile Hamburger + Page Title) */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition active:scale-95 shrink-0"
          aria-label="فتح القائمة الجانبية"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="text-[11px] font-bold text-amber-800 hidden sm:block">
            إدارة فوال وشعبيات شعاع الدره
          </div>
          <h1 className="text-base sm:text-lg font-black text-[#1A120D] truncate">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Left / End Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        
        {/* 1. Staff Role Switcher Popover */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-800 transition active:scale-95 cursor-pointer text-xs font-bold"
            title="تبديل الصلاحية لتجربة الواجهة بأدوار مختلفة"
          >
            <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">
              {currentStaffUser.name.charAt(0)}
            </div>
            <span className="hidden sm:inline font-bold">
              {currentStaffUser.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 mb-1.5 border-b border-stone-100">
                <span className="text-[10px] font-black uppercase text-stone-400 block">
                  تبديل الصلاحية النشطة
                </span>
                <span className="text-xs font-bold text-stone-700">
                  اختبر النظام كمدير أو كاشير أو شيف
                </span>
              </div>

              <div className="space-y-1">
                {availableRoles.map((r) => {
                  const isSelected = currentStaffUser.role === r.role;
                  return (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchStaffRole(r.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-right p-2 rounded-xl text-xs transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                          : 'hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{r.label}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-slate-900' : 'text-stone-400'}`}>
                          {r.desc}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. Customer Site Preview */}
        <button
          onClick={onPreviewSite}
          className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#140E0B] hover:bg-stone-800 text-amber-400 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 shrink-0"
          title="معاينة الموقع للعميل"
        >
          <ExternalLink className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">عرض الموقع</span>
        </button>

      </div>

      {/* Backdrop overlay for dismissing dropdown menus */}
      {showRoleMenu && (
        <div 
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-2xs"
          onClick={() => {
            setShowRoleMenu(false);
          }}
        />
      )}
    </header>
  );
};
