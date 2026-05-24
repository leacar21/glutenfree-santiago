import { useState } from 'react';
import { Map as MapIcon, List, Utensils } from 'lucide-react';
import { restaurants } from './data/restaurants';
import { MapView } from './components/MapView';
import { ListView } from './components/ListView';

function App() {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [filter, setFilter] = useState<'all' | 'full' | 'partial' | 'shop'>('all');

  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (filter === 'full') return restaurant.category === 'full';
    if (filter === 'partial') return restaurant.category === 'partial';
    if (filter === 'shop') return restaurant.category === 'shop';
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-brand p-2 rounded-lg">
              <Utensils className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
                GlutenFree Santiago
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Guía completa de la Región Metropolitana
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Filter */}
            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl shadow-inner">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all ${
                  filter === 'all'
                    ? 'bg-white dark:bg-zinc-800 text-brand shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('full')}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all ${
                  filter === 'full'
                    ? 'bg-white dark:bg-zinc-800 text-green-600 shadow-sm'
                    : 'text-zinc-400 hover:text-green-500'
                }`}
              >
                100% GF
              </button>
              <button
                onClick={() => setFilter('partial')}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all ${
                  filter === 'partial'
                    ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm'
                    : 'text-zinc-400 hover:text-blue-500'
                }`}
              >
                Opciones GF
              </button>
              <button
                onClick={() => setFilter('shop')}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all ${
                  filter === 'shop'
                    ? 'bg-white dark:bg-zinc-800 text-amber-600 shadow-sm'
                    : 'text-zinc-400 hover:text-amber-500'
                }`}
              >
                Tiendas
              </button>
            </div>

            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>

            {/* View Toggle */}
            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl shadow-inner">
              <button
                onClick={() => setView('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  view === 'map'
                    ? 'bg-white dark:bg-zinc-800 text-brand shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                <MapIcon size={16} />
                Mapa
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  view === 'list'
                    ? 'bg-white dark:bg-zinc-800 text-brand shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                <List size={16} />
                Lista
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full overflow-hidden">
        {view === 'map' ? (
          <MapView restaurants={filteredRestaurants} />
        ) : (
          <ListView restaurants={filteredRestaurants} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 text-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-500 font-medium">
          &copy; 2026 GlutenFree Santiago. Fuente: Catastro del Mercado Gastronómico RM.
        </p>
      </footer>
    </div>
  );
}

export default App;
