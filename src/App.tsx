import { useState } from 'react';
import { Map as MapIcon, List, Utensils } from 'lucide-react';
import { restaurants } from './data/restaurants';
import { MapView } from './components/MapView';
import { ListView } from './components/ListView';

function App() {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [filter, setFilter] = useState<'all' | 'full' | 'partial'>('all');

  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (filter === 'full') return restaurant.isFullGlutenFree;
    if (filter === 'partial') return !restaurant.isFullGlutenFree;
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-brand p-2 rounded-lg">
              <Utensils className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
                GlutenFree Santiago
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Encuentra tu próximo lugar seguro para comer
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Filter */}
            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-white dark:bg-zinc-800 text-brand shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('full')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === 'full'
                    ? 'bg-white dark:bg-zinc-800 text-green-600 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                100% GF
              </button>
              <button
                onClick={() => setFilter('partial')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === 'partial'
                    ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Opciones GF
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
              <button
                onClick={() => setView('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'map'
                    ? 'bg-white dark:bg-zinc-800 text-brand shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                <MapIcon size={18} />
                Mapa
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'list'
                    ? 'bg-white dark:bg-zinc-800 text-brand shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                <List size={18} />
                Lista
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full">
        {view === 'map' ? (
          <MapView restaurants={filteredRestaurants} />
        ) : (
          <ListView restaurants={filteredRestaurants} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          &copy; 2026 GlutenFree Santiago. Hecho con ❤️ para la comunidad celíaca.
        </p>
      </footer>
    </div>
  );
}

export default App;
