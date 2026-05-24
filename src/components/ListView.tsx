import React from 'react';
import { Phone, CheckCircle, Info, ShoppingBag } from 'lucide-react';
import type { Restaurant } from '../data/restaurants';

interface Props {
  restaurants: Restaurant[];
}

export const ListView: React.FC<Props> = ({ restaurants }) => {
  const sortedRestaurants = [...restaurants].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {sortedRestaurants.map((restaurant) => (
        <div 
          key={restaurant.id} 
          className="bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
        >
          <div className="p-5 flex-1">
            <div className="flex justify-between items-start mb-4 gap-2">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">
                {restaurant.name}
              </h3>
              {restaurant.category === 'full' && (
                <span className="shrink-0 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                  <CheckCircle size={10} />
                  100% GF
                </span>
              )}
              {restaurant.category === 'partial' && (
                <span className="shrink-0 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                  <Info size={10} />
                  Parcial
                </span>
              )}
              {restaurant.category === 'shop' && (
                <span className="shrink-0 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                  <ShoppingBag size={10} />
                  Tienda
                </span>
              )}
            </div>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3 italic">
              "{restaurant.description}"
            </p>

            {restaurant.phone !== 'No disponible' && (
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 mb-2 text-sm">
                <Phone size={16} />
                <a href={`tel:${restaurant.phone}`} className="hover:underline font-medium">
                  {restaurant.phone}
                </a>
              </div>
            )}
          </div>
          
          <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold">
              Región Metropolitana, Chile
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
