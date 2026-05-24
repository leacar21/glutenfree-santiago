export interface Restaurant {
  id: string;
  name: string;
  phone: string;
  lat: number;
  lng: number;
  isFullGlutenFree: boolean;
}

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Quinoa Restaurante',
    phone: '+56 2 2954 0283',
    lat: -33.3995,
    lng: -70.5891,
    isFullGlutenFree: false,
  },
  {
    id: '2',
    name: 'Sana Tentación',
    phone: '+56 9 1234 5678',
    lat: -33.4372,
    lng: -70.6506,
    isFullGlutenFree: true,
  },
  {
    id: '3',
    name: 'Gluten Free Chile Shop',
    phone: '+56 2 2233 4455',
    lat: -33.4251,
    lng: -70.6151,
    isFullGlutenFree: true,
  },
  {
    id: '4',
    name: 'Pizzería Zero Gluten',
    phone: '+56 9 8765 4321',
    lat: -33.4569,
    lng: -70.6483,
    isFullGlutenFree: true,
  },
  {
    id: '5',
    name: 'Mesa Sana',
    phone: '+56 2 3344 5566',
    lat: -33.4125,
    lng: -70.6012,
    isFullGlutenFree: false,
  },
  {
    id: '6',
    name: 'EcoFeria La Reina',
    phone: '+56 2 4455 6677',
    lat: -33.4428,
    lng: -70.5512,
    isFullGlutenFree: false,
  }
];
