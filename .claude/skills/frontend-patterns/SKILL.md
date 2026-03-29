---
name: frontend-patterns
description: Frontend development patterns for React, Next.js, state management, performance optimization, and UI best practices.
origin: ECC (everything-claude-code)
---

# Frontend Development Patterns

Modern frontend patterns for React, Next.js, and performant user interfaces.

## When to Activate

- Building React components (composition, props, rendering)
- Managing state (useState, useReducer, Context)
- Implementing data fetching
- Optimizing performance (memoization, virtualization, code splitting)
- Working with forms (validation, controlled inputs)
- Handling client-side routing and navigation
- Building accessible, responsive UI patterns

## Component Patterns

### Composition Over Inheritance

```typescript
interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'outlined'
}

export function Card({ children, variant = 'default' }: CardProps) {
  return <div className={`card card-${variant}`}>{children}</div>
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>
}
```

### Compound Components

```typescript
const TabsContext = createContext(undefined)

export function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  )
}

export function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  return (
    <button
      className={activeTab === id ? 'active' : ''}
      onClick={() => setActiveTab(id)}
    >{children}</button>
  )
}
```

## Custom Hooks Patterns

### Debounce Hook

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}
```

### Async Data Fetching Hook

```typescript
export function useQuery(key, fetcher, options) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      setData(result)
      options?.onSuccess?.(result)
    } catch (err) {
      setError(err)
      options?.onError?.(err)
    } finally {
      setLoading(false)
    }
  }, [fetcher])

  useEffect(() => {
    if (options?.enabled !== false) refetch()
  }, [key])

  return { data, error, loading, refetch }
}
```

## Performance Optimization

### Memoization

```typescript
const sorted = useMemo(() => items.sort((a, b) => b.value - a.value), [items])
const handleSearch = useCallback((query) => setSearchQuery(query), [])
export const ItemCard = React.memo(({ item }) => (
  <div className="item-card"><h3>{item.name}</h3></div>
))
```

### Code Splitting & Lazy Loading

```typescript
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart data={data} />
    </Suspense>
  )
}
```

### Virtualization for Long Lists

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualList({ items }) {
  const parentRef = useRef(null)
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5
  })

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div key={virtualRow.index}
            style={{
              position: 'absolute', top: 0, width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }}>
            <ItemCard item={items[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Form Handling

```typescript
export function CreateForm() {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    await submitData(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={formData.name}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} />
      {errors.name && <span className="error">{errors.name}</span>}
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Accessibility Patterns

### Keyboard Navigation

```typescript
export function Dropdown({ options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setActiveIndex(i => Math.min(i + 1, options.length - 1)); break
      case 'ArrowUp': e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); break
      case 'Enter': e.preventDefault(); onSelect(options[activeIndex]); setIsOpen(false); break
      case 'Escape': setIsOpen(false); break
    }
  }

  return <div role="combobox" aria-expanded={isOpen} onKeyDown={handleKeyDown} />
}
```

### Focus Management

```typescript
export function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      modalRef.current?.focus()
    } else {
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  return isOpen ? (
    <div ref={modalRef} role="dialog" aria-modal="true" tabIndex={-1}
         onKeyDown={e => e.key === 'Escape' && onClose()}>
      {children}
    </div>
  ) : null
}
```
