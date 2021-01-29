import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Movie, MovieFilter} from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  movies: Movie[] = [];
  moviesLoaded$ = new EventEmitter<boolean>();

  private readonly baseUrl = 'assets/movies.json';

  constructor(private http: HttpClient) {
    this.getMoviesFromJsonFile();
  }

  private getMoviesFromJsonFile(): void {
    this.http.get<Movie[]>(this.baseUrl).subscribe(result => {
      this.movies = result;
      this.moviesLoaded$.emit(true);
    });
  }

  getMovies(value?: string, filterType?: MovieFilter): Movie[] {
    if (!this.movies?.length) {
      return [];
    }

    return this.movies.filter(movie => {
      switch (filterType) {
        case MovieFilter.SEARCH:
          if (movie?.Title) {
            return (movie.Title).toString().toLowerCase().includes(value.toLowerCase());
          }
          break;

        case MovieFilter.MAJOR_GENRE: {
          if (movie?.Major_Genre) {
            return (movie.Major_Genre).toString().toLowerCase() === value.toLowerCase();
          }
          break;

        }

        case MovieFilter.YEAR: {
          if (movie?.Release_Date) {
            const date = new Date(movie.Release_Date);
            return date.getFullYear().toString() === value;
          }
          break;
        }

        default:
          return true;
      }
    });
  }

  updateMovie(movie: Movie): boolean {
    const filterList = this.movies.filter(result => result.Title === movie.Title);
    if (filterList?.length > 1) {
      throw new Error('Title is not unique');
    }

    if (filterList?.length === 0) {
      return this.addMovie(movie);
    }


    if (filterList?.[0]) {
      const itemIndex = this.movies.findIndex(item => item.Title === movie.Title);
      this.movies[itemIndex] = movie;
      return true;
    }

    return false;
  }

  deleteMovie(title: string): boolean {
    const itemIndex = this.movies.findIndex(result => result.Title === title);
    if (itemIndex === -1) {
      throw new Error('Movie not found');
    }

    return this.movies.splice(itemIndex, 1).length > 0;
  }

  addMovie(movie: Movie): boolean {
    this.movies = this.movies ?? [];

    const filterList = this.movies.filter(result => result.Title === movie.Title);
    if (filterList?.length > 1) {
      throw new Error(`Movie already exists with title ${filterList[0].Title}`);
    }

    this.movies.push(movie);
    return true;
  }
}
