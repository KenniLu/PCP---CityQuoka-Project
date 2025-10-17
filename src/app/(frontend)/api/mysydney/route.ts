import { NextResponse } from 'next/server';

type Place = {
  id: string;
  name: string;
  address: string;
  rating?: number;
  location: { lat: number; lng: number };
};

type Folder = {
  id: string;
  name: string;
  placeIds: string[];
};

type DataStore = {
  folders: Folder[];
  places: Place[];
};

let data: DataStore = {
  folders: [
    { id: 'folder_1', name: 'Favorites', placeIds: [] },
  ],
  places: [],
};

// GET – fetch all folders and places
export async function GET() {
  return NextResponse.json(data);
}

// POST – save/update folder or place
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === 'addFolder') {
      const folder: Folder = { id: 'folder_' + Date.now(), name: body.name, placeIds: [] };
      data.folders.push(folder);
      return NextResponse.json(folder);
    }

    if (body.action === 'addPlace') {
      const place: Place = {
        id: 'place_' + Date.now(),
        name: body.name,
        address: body.address || '',
        rating: body.rating || 0,
        location: body.location,
      };
      data.places.push(place);

      // add to folder if provided
      if (body.folderId) {
        const folder = data.folders.find(f => f.id === body.folderId);
        if (folder) folder.placeIds.push(place.id);
      }

      return NextResponse.json(place);
    }

    if (body.action === 'deleteFolder') {
      data.folders = data.folders.filter(f => f.id !== body.folderId);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'deletePlace') {
      data.places = data.places.filter(p => p.id !== body.placeId);
      data.folders = data.folders.map(f => ({
        ...f,
        placeIds: f.placeIds.filter(pid => pid !== body.placeId),
      }));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
