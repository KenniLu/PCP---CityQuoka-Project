export interface Location {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  pos: {lat: number, lng: number},
  type: string;
  description: string;
  rating: number;
  image: string;
}

export interface MapContainerStyle {
  width: string;
  height: string;
}

export interface Center {
  lat: number;
  lng: number;
}