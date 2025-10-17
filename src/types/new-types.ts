import type { LatLng } from "leaflet";
export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface Pin {
  id: number;
  lat: number;
  lng: number;
  tag: string;
  location: string;
  text: string;
}

export interface Tag {
  name: string;
  pins: number[];
}

export interface TagWithPinDetails extends Tag {
  pinDetails: Pin[];
}

export interface MapEventsProps {
  onMapClick: (latlng: LatLng) => void;
  newPinMode: boolean;
}
export interface PinUpdates {
  tag?: string;
  location?: string;
  text?: string;
}