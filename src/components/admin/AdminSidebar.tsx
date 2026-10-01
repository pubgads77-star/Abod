import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Layers,
  Sliders,
  Tag,
  QrCode,
  Truck,
  Users,
  ShieldCheck,
  BarChart3,
  Settings,
  History,
  LogOut,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  Store,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.tsx';
import { RESTAURANT_INFO } from '../../data/restaurantData.ts';

export type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'modifiers'
  | 'offers'
  | 'tables'
  | 'delivery'
  | 'customers'
  | 'staff'
  | 'reports'
  | 'settings'
  | 'audit';

export interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  onPreviewSite: () => void;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onLogout,
  onPreviewSite,
}) => {
  const { orders, currentStaffUser, settings } = useRestaurant();

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const navGroups: NavGroup[] = [
    {
      groupTitle: 'الرئيسية والعمليات',
      items: [
        { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
        {
          id: 'orders',
          label: 'إدارة الطلبات',
          icon: ShoppingBag,
          badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
          badgeColor: 'bg-red-500 text-white',
        },
      ],
    },
    {
      groupTitle: 'قائمة الطعام والوجبات',
      items: [
        { id: 'products', label: 'الأصناف والوجبات', icon: UtensilsCrossed },
        { id: 'categories', label: 'أقسام المنيو', icon: Layers },
        { id: 'modifiers', label: 'الخيارات والإضافات', icon: Sliders },
        { id: 'offers', label: 'العروض والكوبونات', icon: Tag },
      ],
    },
    {
      groupTitle: 'الخدمات والصالة',
      items: [
        { id: 'tables', label: 'الطاولات ورموز QR', icon: QrCode },
        { id: 'delivery', label: 'مناطق ورسوم التوصيل', icon: Truck },
        { id: 'customers', label: 'سجل العملاء', icon: Users },
      ],
    },
    {
      groupTitle: 'النظام والإدارة',
      items: [
        { id: 'staff', label: 'طاقم العمل والصلاحيات', icon: ShieldCheck },
        { id: 'reports', label: 'التقارير والمبيعات', icon: BarChart3 },
        { id: 'settings', label: 'إعدادات المطعم', icon: Settings },
        { id: 'audit', label: 'سجل العمليات', icon: History },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#18110D] text-stone-200 select-none border-l border-amber-950/40">
      {/* Top Header Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/40 bg-black shrink-0 flex items-center justify-center">
            <img
              src={settings.restaurantPhoto || settings.restaurantLogo || RESTAURANT_INFO.restaurantLogo}
              alt="شعار"
              className="w-full h-full object-cover"
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-black text-sm text-white truncate">شعاع الدره</span>
              <span className="text-[10px] text-amber-400 font-bold truncate">لوحة إدارة الفرع</span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white items-center justify-center transition cursor-pointer"
          title={isCollapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
        >
          {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-black uppercase text-stone-500 tracking-wider mb-1">
                {group.groupTitle}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                      : 'text-stone-300 hover:bg-white/5 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-500/80'}`} />
                  {!isCollapsed && (
                    <span className="flex-1 text-right truncate">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                        item.badgeColor || 'bg-amber-400 text-stone-950'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / User Profile & Logout */}
      <div className="p-3 border-t border-white/10 shrink-0 space-y-2">
        <button
          onClick={onPreviewSite}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold transition cursor-pointer"
        >
          <ExternalLink className="w-4 h-4 text-amber-400 shrink-0" />
          {!isCollapsed && <span>معاينة الموقع للزبائن</span>}
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 text-xs font-bold transition cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 right-0 h-full z-40 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-right duration-200 z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
