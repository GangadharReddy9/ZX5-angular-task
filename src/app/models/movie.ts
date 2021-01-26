export interface Movie {
  Title: string;
  US_Gross?: number;
  Worldwide_Gross?: number;
  US_DVD_Sales?: number;
  Production_Budget?: number;
  Release_Date?: string;
  MPAA_Rating?: string;
  Running_Time_min?: number;
  Distributor?: string;
  Source?: string;
  Major_Genre?: string;
  Creative_Type?: string;
  Director?: string;
  Rotten_Tomatoes_Rating?: string;
  IMDB_Rating?: number;
  IMDB_Votes?: number;
}

export enum MovieFilter {
  SEARCH,
  MAJOR_GENRE,
  YEAR,
  NONE
}

export interface MovieFilterItem {
  value: MovieFilter;
  viewValue: string;
}
