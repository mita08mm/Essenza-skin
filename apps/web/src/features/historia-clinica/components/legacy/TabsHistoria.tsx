import { TabType } from '@/features/historia-clinica/types';

interface TabsHistoriaProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  consultasCount: number;
  recetasCount: number;
  documentosCount: number;
}

export function TabsHistoria({
  activeTab,
  onTabChange,
  consultasCount,
  recetasCount,
  documentosCount,
}: TabsHistoriaProps) {
  const tabs = [
    { key: 'consultas' as TabType, label: 'Consultas', count: consultasCount },
    { key: 'recetas' as TabType, label: 'Recetas', count: recetasCount },
    { key: 'documentos' as TabType, label: 'Documentos', count: documentosCount },
    { key: 'resumen' as TabType, label: 'Resumen', count: null },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex gap-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-morena text-morena'
                : 'text-marengo hover:text-concreto border-transparent'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className="bg-piel/30 ml-2 rounded-lg px-2 py-0.5 text-xs">{tab.count}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
