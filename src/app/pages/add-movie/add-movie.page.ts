import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonToggle,
  IonIcon,
  IonToast
} from '@ionic/angular/standalone';

import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

import { AuthService } from '../../services/auth';
import { MovieService } from '../../services/movie';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.page.html',
  styleUrls: ['./add-movie.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonToggle,
    IonIcon,
    IonToast
  ]
})
export class AddMoviePage implements OnInit {

  listId = '';

  title = '';
  genre? = '';
  year?: number;
  rating: number | undefined = undefined;
  watched = false;
  movieId = '';
  isEditMode = false;

  toastMessage = '';
  isToastOpen = false;

  genres = [
    'Komedija',
    'Romantika',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private movieService: MovieService
  ) {
    addIcons({
      arrowBackOutline
    });
  }

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('listId') || '';
    
    this.movieId = this.route.snapshot.paramMap.get('movieId') || '';
    this.isEditMode = !!this.movieId;

    if (this.isEditMode) {
      this.ucitajFilm();
    }
  }

  goBack() {
    this.router.navigate(['/movies', this.listId]);
  }

  sacuvajFilm() {
  if (!this.title.trim()) {
    this.prikaziPoruku('Naziv filma je obavezan.');
  return;
}

if (this.rating && (this.rating < 1 || this.rating > 10)) {
  this.prikaziPoruku('Ocena mora biti između 1 i 10.');
  return;
}
  const userId = this.authService.getUserId();
  const token = this.authService.getToken();

  if (!userId || !token || !this.listId) {
    return;
  }


  const movie: Movie = {
  title: this.title.trim(),
  genre: this.genre || '',
  year: this.year ? Number(this.year) : undefined,
  rating: this.rating ? Number(this.rating) : undefined,
  watched: this.watched,
  createdAt: new Date().toISOString()
};

  if (this.isEditMode) {
  this.movieService.updateFilm(userId, token, this.listId, this.movieId, movie).subscribe({
    next: () => {
      this.router.navigate(['/movies', this.listId]);
    }
  });
  return;
}

  this.movieService.dodajFilm(userId, token, this.listId, movie).subscribe({
    next: () => {
      this.router.navigate(['/movies', this.listId]);
    },
    error: (err) => {
      console.log('Greška pri dodavanju filma:', err);
    }
  });
}

ucitajFilm() {
  const userId = this.authService.getUserId();
  const token = this.authService.getToken();

  if (!userId || !token || !this.listId || !this.movieId) return;

  this.movieService.getMovie(userId, token, this.listId, this.movieId).subscribe({
    next: (movie) => {
      this.title = movie.title;
      this.genre = movie.genre;
      this.year = movie.year;
      this.rating = movie.rating;
      this.watched = movie.watched;
    }
  });
}

prikaziPoruku(message: string) {
    this.toastMessage = message;
    this.isToastOpen = true;
  }

}