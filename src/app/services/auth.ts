import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap,  switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiKey = 'AIzaSyB_hBiovUfyx5IC5ptGx7-jPlSG9r4wBNQ';
  private databaseUrl = 'https://moviewatchlist-2a6f8-default-rtdb.europe-west1.firebasedatabase.app';

  private signUpUrl =
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;

  private signInUrl =
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;

  constructor(private http: HttpClient) {}

register(email: string, password: string, ime: string) {
  return this.http.post<any>(this.signUpUrl, {
    email,
    password,
    returnSecureToken: true
  }).pipe(
    tap(response => {
      localStorage.setItem('token', response.idToken);
      localStorage.setItem('userId', response.localId);
      localStorage.setItem('email', response.email);
      localStorage.setItem('ime', ime);

      this.http.put(
        `${this.databaseUrl}/users/${response.localId}/profile.json?auth=${response.idToken}`,
        {
          ime,
          email: response.email
        }
      ).subscribe();
    })
  );
}

 login(email: string, password: string) {
  return this.http.post<any>(this.signInUrl, {
    email,
    password,
    returnSecureToken: true
  }).pipe(
    switchMap(response => {
      localStorage.setItem('token', response.idToken);
      localStorage.setItem('userId', response.localId);
      localStorage.setItem('email', response.email);
      localStorage.removeItem('ime');

      return this.http.get<any>(
        `${this.databaseUrl}/users/${response.localId}/profile.json?auth=${response.idToken}`
      ).pipe(
        map(profile => {
          if (profile?.ime) {
            localStorage.setItem('ime', profile.ime);
          }

          return response;
        })
      );
    })
  );
}

  logout() {
    localStorage.clear();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}