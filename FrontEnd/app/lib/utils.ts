import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function getAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function getCountryFlag(nationality: string): string {
  const countryMap: Record<string, string> = {
    'British': 'gb',
    'German': 'de',
    'Spanish': 'es',
    'Finnish': 'fi',
    'Australian': 'au',
    'Brazilian': 'br',
    'Italian': 'it',
    'French': 'fr',
    'Canadian': 'ca',
    'Dutch': 'nl',
    'Belgian': 'be',
    'Austrian': 'at',
    'Japanese': 'jp',
    'Polish': 'pl',
    'Danish': 'dk',
    'Swedish': 'se',
    'Portuguese': 'pt',
    'Mexican': 'mx',
    'Russian': 'ru',
    'American': 'us',
    'Swiss': 'ch',
    'Chinese': 'cn',
    'Indian': 'in',
    'Malaysian': 'my',
    'Monaco': 'mc',
    'New Zealander': 'nz',
    'Thai': 'th',
    'Venezuelan': 've',
    'Hungarian': 'hu',
    'Colombian': 'co',
    'Indonesian': 'id',
    'Argentine': 'ar',
    'South African': 'za',
  };
  
  const code = countryMap[nationality] || 'unknown';
  return `https://flagcdn.com/w20/${code.toLowerCase()}.png`;
}

export function getConstructorColor(constructorName: string): string {
  const constructorColors: Record<string, string> = {
    'Mercedes': '#00D2BE',
    'Red Bull': '#0600EF',
    'Ferrari': '#DC0000',
    'McLaren': '#FF8700',
    'Alpine': '#0090FF',
    'AlphaTauri': '#2B4562',
    'Aston Martin': '#006F62',
    'Williams': '#005AFF',
    'Alfa Romeo': '#900000',
    'Haas F1 Team': '#FFFFFF',
    'Renault': '#FFF500',
    'Racing Point': '#F596C8',
    'Toro Rosso': '#469BFF',
    'Force India': '#F596C8',
    'Sauber': '#9B0000',
    'Lotus F1': '#000000',
    'Marussia': '#6E0000',
    'Caterham': '#00594F',
    'HRT': '#F0D787',
    'Virgin': '#FFFFFF',
    'Brawn': '#F0D787',
    'Toyota': '#FF1E00',
    'Super Aguri': '#DF0100',
    'Honda': '#DF0100',
    'Spyker': '#F0D787',
    'Midland': '#F0D787',
    'BAR': '#DF0100',
    'Jordan': '#F0D787',
    'Minardi': '#000000',
    'Jaguar': '#00594F',
    'Arrows': '#000000',
    'Prost': '#0000FF',
    'Benetton': '#00594F',
    'Stewart': '#FFFFFF',
    'Tyrrell': '#0000FF',
    'Forti': '#FF1E00',
    'Footwork': '#000000',
    'Pacific': '#0000FF',
    'Simtek': '#000000',
    'Team Lotus': '#000000',
    'Larrousse': '#0000FF',
    'Brabham': '#FFFFFF',
    'Dallara': '#0000FF',
    'Fondmetal': '#000000',
    'March': '#0000FF',
    'Leyton House': '#00594F',
    'Coloni': '#0000FF',
    'Ligier': '#0000FF',
    'Osella': '#000000',
    'Onyx': '#000000',
    'Rial': '#0000FF',
    'AGS': '#0000FF',
    'Zakspeed': '#000000',
    'Eurobrun': '#000000',
    'Lola': '#0000FF',
    'Lamborghini': '#000000',
  };

  return constructorColors[constructorName] || '#666666';
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getYearRange(startYear: number, endYear: number): number[] {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
}

export function getSeasonYears(): number[] {
  return getYearRange(2005, getCurrentYear());
}