import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon, AlertController, IonSegment,
IonSegmentButton,
IonLabel, 
IonSearchbar
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, addCircleOutline } from 'ionicons/icons';

import { AuthService } from '../../services/auth';
import { MovieService } from '../../services/movie';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonSegment,
IonSegmentButton,
IonLabel,
IonSearchbar
  ]
})
export class MoviesPage implements OnInit {

  listId = '';
  listName = '';

  movies: Movie[] = [];

  filterStatus = 'all';

  searchText = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private movieService: MovieService,
    private alertController: AlertController
  ) {
    addIcons({
      arrowBackOutline,
      addCircleOutline
    });
  }

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('listId') || '';
    this.listName = this.route.snapshot.queryParamMap.get('name') || 'Filmovi';
  }

  ionViewWillEnter() {
  this.loadMovies();
}

  loadMovies() {
    const userId = this.authService.getUserId();
    const token = this.authService.getToken();

    if (!userId || !token || !this.listId) {
      return;
    }

    this.movieService.getMovies(userId, token, this.listId).subscribe({
      next: (movies) => {
        this.movies = movies;
      },
      error: (err) => {
        console.log('Greška pri učitavanju filmova:', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  goToAddMovie() {
    this.router.navigate(['/add-movie', this.listId], {
      queryParams: {
        name: this.listName
      }
    });
  }

editMovie(movie: Movie) {
  if (!movie.id) return;

  this.router.navigate(['/edit-movie', this.listId, movie.id], {
    queryParams: {
      name: this.listName
    }
  });
}

updateMovie(oldMovie: Movie, updatedMovie: Movie) {
  const userId = this.authService.getUserId();
  const token = this.authService.getToken();

  if (!userId || !token || !this.listId || !oldMovie.id) {
    return;
  }

  this.movieService.updateFilm(userId, token, this.listId, oldMovie.id, updatedMovie).subscribe({
    next: () => {
      Object.assign(oldMovie, updatedMovie);
    },
    error: (err) => {
      console.log('Greška pri izmeni filma:', err);
    }
  });
}

async deleteMovie(movie: Movie) {
  const alert = await this.alertController.create({
    header: 'Brisanje filma',
    message: `Da li ste sigurni da želite da obrišete film "${movie.title}"?`,
    buttons: [
      { text: 'Otkaži', role: 'cancel' },
      {
        text: 'Obriši',
        role: 'destructive',
        handler: () => {
          this.confirmDeleteMovie(movie);
        }
      }
    ]
  });

  await alert.present();
}

confirmDeleteMovie(movie: Movie) {
  const userId = this.authService.getUserId();
  const token = this.authService.getToken();

  if (!userId || !token || !this.listId || !movie.id) {
    return;
  }

  this.movieService.obrisiFilm(userId, token, this.listId, movie.id).subscribe({
    next: () => {
      this.movies = this.movies.filter(m => m.id !== movie.id);
    },
    error: (err) => {
      console.log('Greška pri brisanju filma:', err);
    }
  });
}

get filteredMovies() {

  let filtered = this.movies;

  // Filtriranje po statusu
  if (this.filterStatus === 'watched') {
    filtered = filtered.filter(movie => movie.watched);
  }

  if (this.filterStatus === 'planned') {
    filtered = filtered.filter(movie => !movie.watched);
  }

  // Pretraga po nazivu
  if (this.searchText.trim() !== '') {
    filtered = filtered.filter(movie =>
      movie.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  return filtered;

}

}