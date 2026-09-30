export interface Dish {
  id: string;
  name: string;
  indigenousName?: string;
  category: 'nepali' | 'indochinese' | 'botanical';
  elevation: string;
  description: string;
  provenance: string;
  notes: string[];
  spiceLevel: number; // 1 to 5
  pairing: string;
  image: string;
}

export interface MaterialTexture {
  id: string;
  name: string;
  origin: string;
  description: string;
  tactileTrait: string;
  image?: string;
}

export interface DiningSpace {
  id: string;
  title: string;
  subtitle: string;
  capacity: string;
  atmosphere: string;
  description: string;
}

export interface ReservationData {
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  diningExperience: string;
  dietaryNotes: string;
}
