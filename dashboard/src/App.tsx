// global styles are imported in main.tsx
import '@fontsource-variable/inter/index.css'
import { useMemo, useState } from 'react'
import { Bars3Icon, BellIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)

type ActionItem = { id: string; title: string; done: boolean }

const kpis = [
  { label: 'Sales', value: '$128,430', change: '+12.4%' },
  { label: 'Orders', value: '1,248', change: '+4.8%' },
  { label: 'Customers', value: '892', change: '+2.1%' },
  { label: 'Revenue', value: '$243,980', change: '+9.3%' },
]

const initialActions: ActionItem[] = [
  { id: 'a1', title: 'Follow up with top 10 abandoned carts', done: false },
  { id: 'a2', title: 'Review discount performance for Q3', done: false },
  { id: 'a3', title: 'Email campaign: returning customers', done: true },
]

function Card(props: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${props.className ?? ''}`}>
      <div className="mb-3 text-sm font-medium text-slate-500">{props.title}</div>
      {props.children}
    </div>
  )
}

export default function App() {
  const [actions, setActions] = useState<ActionItem[]>(initialActions)

  const salesLine = useMemo(() => {
    const labels = Array.from({ length: 12 }, (_, i) => `M${i + 1}`)
    return {
      labels,
      datasets: [
        {
          label: 'Sales',
          data: labels.map((_, i) => Math.round(8000 + Math.sin(i) * 2000 + i * 700)),
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.15)',
          tension: 0.35,
          fill: true,
        },
      ],
    }
  }, [])

  const ordersBar = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return {
      labels,
      datasets: [
        {
          label: 'Orders',
          data: labels.map((_, i) => 60 + (i * 15) % 40),
          backgroundColor: '#10b981',
          borderRadius: 6,
        },
      ],
    }
  }, [])

  const customersDonut = useMemo(() => {
    return {
      labels: ['New', 'Returning', 'Churn Risk'],
      datasets: [
        {
          data: [45, 38, 17],
          backgroundColor: ['#6366f1', '#f59e0b', '#ef4444'],
        },
      ],
    }
  }, [])

  const toggleAction = (id: string) => {
    setActions(prev => prev.map(a => (a.id === id ? { ...a, done: !a.done } : a)))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Bars3Icon className="h-6 w-6 text-slate-500" />
            <span className="text-lg font-semibold text-slate-800">Business Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <BellIcon className="h-6 w-6 text-slate-500" />
            <img className="h-8 w-8 rounded-full" src="https://i.pravatar.cc/64?img=13" alt="avatar" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map(k => (
            <div key={k.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-sm text-slate-500">{k.label}</div>
              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-2xl font-semibold text-slate-900">{k.value}</div>
                <div className="text-xs font-medium text-emerald-600">{k.change}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card title="Sales (Last 12 months)" className="lg:col-span-2">
            <div className="h-64">
              <Line
                data={salesLine}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { x: { display: true, grid: { display: false } }, y: { display: true, grid: { color: '#eef2ff' } } },
                }}
              />
            </div>
          </Card>
          <Card title="Orders (This week)">
            <div className="h-64">
              <Bar
                data={ordersBar}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { x: { grid: { display: false } }, y: { grid: { color: '#ecfeff' } } },
                }}
              />
            </div>
          </Card>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card title="Customers Mix">
            <div className="mx-auto h-64 max-w-xs">
              <Doughnut data={customersDonut} options={{ plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </Card>

          <Card title="Recent Orders" className="lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-500">
                    <th className="py-2">Order</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <tr key={i} className="text-slate-700">
                      <td className="py-3">#INV-{1023 + i}</td>
                      <td className="py-3">Customer {String.fromCharCode(65 + i)}</td>
                      <td className="py-3">${(120 + i * 17).toFixed(2)}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Paid</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card title="Action Items" className="lg:col-span-3">
            <ul className="divide-y divide-slate-100">
              {actions.map(action => (
                <li key={action.id} className="flex items-center justify-between py-3">
                  <span className={`text-sm ${action.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{action.title}</span>
                  <button
                    onClick={() => toggleAction(action.id)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      action.done
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    {action.done ? 'Completed' : 'Mark done'}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </main>
    </div>
  )
}
