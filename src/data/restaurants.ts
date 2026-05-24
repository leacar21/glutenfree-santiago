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
    name: 'Senza Gluten',
    phone: '(212) 475-7775',
    lat: 40.7294,
    lng: -73.9991,
    isFullGlutenFree: true,
  },
  {
    id: '2',
    name: 'Wild',
    phone: '(212) 924-2226',
    lat: 40.7368,
    lng: -74.0018,
    isFullGlutenFree: false,
  },
  {
    id: '3',
    name: 'Friedmans',
    phone: '(212) 925-1900',
    lat: 40.7416,
    lng: -73.9903,
    isFullGlutenFree: false,
  },
  {
    id: '4',
    name: 'Bistango',
    phone: '(212) 725-8484',
    lat: 40.7433,
    lng: -73.9811,
    isFullGlutenFree: false,
  },
  {
    id: '5',
    name: 'The Little Beet Table',
    phone: '(212) 466-3340',
    lat: 40.7413,
    lng: -73.9856,
    isFullGlutenFree: true,
  }
];
