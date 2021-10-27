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
