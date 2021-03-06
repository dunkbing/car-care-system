// Places
export type Place = {
  description: string;
  matched_substrings: any[];
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  terms: any[];
  has_children: boolean;
  display_type: string;
  score: number;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
};

export type PlacesRequestParams = {
  api_key: string;
  input: string;
  location?: string;
  limit?: number;
  radius?: number;
  sessiontoken?: string;
  more_compound?: boolean;
};

export type PlacesResponse = {
  predictions: Array<Place>;
  executed_time: number;
  executed_time_all: number;
  status: string;
};

export type DetailPlace = {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
};

export type DetailPlaceRequestParams = {
  api_key: string;
  place_id: string;
  sessiontoken?: string;
};

export type DetailPlaceResponse = {
  result: DetailPlace;
  status: string;
};

// Directions
type Leg = {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  steps: any[];
};

export type Route = {
  bounds: any;
  legs: Leg[];
  overview_polyline: {
    points: string;
  };
  warnings: any[];
  waypoint_order: any[];
};

export type DirectionsRequestParams = {
  api_key: string;
  origin: string;
  destination: string;
  alternatives?: boolean;
  vehicle?: string;
};

export type DirectionsResponse = {
  geocoded_waypoints: any[];
  routes: Route[];
};

export type GeocodeRequestParams = {
  api_key: string;
  latlng: string;
};

export type GeocodingResponse = {
  plus_code: any;
  results: Array<{
    address_components: { long_name: string; short_name: string }[];
    formatted_address: string;
    geometry: { location: { lat: number; lng: number } };
    place_id: string;
    reference: string;
    plus_code: {
      compound_code: string;
      global_code: string;
    };
    type: any[];
  }>;
  status: string;
};

export type DistanceMatrixResponse = {
  rows: {
    elements: {
      status: string;
      duration: {
        text: string;
        value: number;
      };
      distance: {
        text: string;
        value: number;
      };
    }[];
  }[];
};

export type DistanceMatrixRequestParams = {
  api_key: string;
  origins: string;
  destinations: string;
  vehicle: string;
};
