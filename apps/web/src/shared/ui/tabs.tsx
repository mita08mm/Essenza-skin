interface TabItem<T extends string> {
  value: T;
  label: string;
}

interface TabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  items: ReadonlyArray<TabItem<T>>;
  className?: string;
}

export function Tabs<T extends string>({ value, onChange, items, className }: TabsProps<T>) {
  return (
    <div className={`border-b border-neutral-200 ${className ?? ''}`}>
      <div className="flex gap-2">
        {items.map((it) => {
          const active = it.value === value;
          return (
            <button
              key={it.value}
              type="button"
              onClick={() => onChange(it.value)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'text-brand-morena-dark border-brand-morena'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
