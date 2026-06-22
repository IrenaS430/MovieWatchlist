import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap,  switchMap, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiKey = environment.firebaseApiKey;
  private databaseUrl = environment.firebaseDatabaseUrl;

  private signUpUrl =
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;

  private signInUrl =
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;

  constructor(private http: HttpClient) {}

register(email: string, password: string, ime: string, prezime: string) {
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
      localStorage.setItem('prezime', prezime);

      this.http.put(
        `${this.databaseUrl}/users/${response.localId}/profile.json?auth=${response.idToken}`,
        {
          ime,
          prezime,
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