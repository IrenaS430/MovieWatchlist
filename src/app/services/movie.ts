import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  private databaseUrl = 'https://moviewatchlist-2a6f8-default-rtdb.europe-west1.firebasedatabase.app';

  constructor(private http: HttpClient) {}

  dodajFilm(userId: string, token: string, listId: string, movie: Movie) {
    return this.http.post(
      `${this.databaseUrl}/users/${userId}/lists/${listId}/movies.json?auth=${token}`,
      movie
    );
  }

  getMovies(userId: string, token: string, listId: string) {
    return this.http
      .get<{ [key: string]: Movie } | null>(
        `${this.databaseUrl}/users/${userId}/lists/${listId}/movies.json?auth=${token}`
      )
      .pipe(
        map(response => {
          const movies: Movie[] = [];

          if (!response) {
            return movies;
          }

          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              movies.push({
                id: key,
                ...response[key]
              });
            }
          }

          return movies;
        })
      );
  }

  obrisiFilm(userId: string, token: string, listId: string, movieId: string) {
    return this.http.delete(
      `${this.databaseUrl}/users/${userId}/lists/${listId}/movies/${movieId}.json?auth=${token}`
    );
  }


  updateFilm(userId: string, token: string, listId: string, movieId: string, movie: Movie) {
  return this.http.put(
    `${this.databaseUrl}/users/${userId}/lists/${listId}/movies/${movieId}.json?auth=${token}`,
    movie
  );
}

getMovie(userId: string, token: string, listId: string, movieId: string) {
  return this.http.get<Movie>(
    `${this.databaseUrl}/users/${userId}/lists/${listId}/movies/${movieId}.json?auth=${token}`
  );
}
}