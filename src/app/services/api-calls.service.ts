import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Movie, MovieFilter} from '../models/movie';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  private readonly baseUrl = 'assets/movies.json';

  constructor(private http: HttpClient) {
  }

  getMovies(value?: string, filterType?: MovieFilter): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.baseUrl).pipe(map(result => {
      if (!value?.length) {
        return result;
      }

      return result.filter(movie => {
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
            return false;
        }
      });
    }));
  }

  updateMovie(movie: Movie): Observable<boolean> {
    return this.getMovies().pipe(map(movies => {
      const filterList = movies.filter(result => result.Title === movie.Title);
      if (filterList?.length > 1) {
        throw new Error('Title is not unique');
      }

      if (filterList?.[0]) {
        const itemIndex = movies.indexOf(filterList[0]);
        movies[itemIndex] = filterList[0];
        return true;
      }

      return false;
    }));
  }

  deleteMovie(title: string): Observable<boolean> {
    return this.getMovies().pipe(map(movies => {
      const itemIndex = movies.findIndex(result => result.Title === title);
      if (itemIndex === -1) {
        throw new Error('Movie not found');
      }

      return movies.splice(itemIndex, 1).length > 0;
    }));
  }

  addMovie(movie: Movie): Observable<Movie[]> {
    return this.getMovies().pipe(map(movies => {
      movies = movies ?? [];
      movies.push(movie);
      return movies;
    }));
  }
}
