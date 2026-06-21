import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { MovieList } from '../models/movie-list.model';

@Injectable({
  providedIn: 'root',
})
export class MovieListService {

  private databaseUrl = 'https://moviewatchlist-2a6f8-default-rtdb.europe-west1.firebasedatabase.app';

  constructor(private http: HttpClient) {}

  dodajListu(userId: string, token: string, name: string, description: string) {
   const movieList: MovieList = {
    name: name,
    description: description,
    createdAt: new Date().toISOString()
  };

  return this.http.post(`${this.databaseUrl}/users/${userId}/lists.json?auth=${token}`,
    movieList
  );
  }

  getLists(userId: string, token: string) {
    return this.http
      .get<{ [key: string]: MovieList }>(
        `${this.databaseUrl}/users/${userId}/lists.json?auth=${token}`
      )
      .pipe(
        map(response => {
          const lists: MovieList[] = [];

          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              lists.push({
                id: key,
                ...response[key]
              });
            }
          }

          return lists;
        })
      );
  }

  obrisiListu(userId: string, token: string, listId: string) {
    return this.http.delete(
      `${this.databaseUrl}/users/${userId}/lists/${listId}.json?auth=${token}`
    );
  }

  izmeniListu(userId: string, token: string, listId: string, name: string, description: string) {
    return this.http.patch(
      `${this.databaseUrl}/users/${userId}/lists/${listId}.json?auth=${token}`,
      {
        name,
        description
      }
  );
}
}