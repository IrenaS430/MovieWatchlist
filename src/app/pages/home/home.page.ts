import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon, 
  AlertController,
   IonItem,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  filmOutline,
  listOutline,
  addCircleOutline,
  logOutOutline,
  heartOutline,
  chevronForwardOutline,
  trashOutline,
  swapVerticalOutline
} from 'ionicons/icons';

import { AuthService } from '../../services/auth';
import { MovieListService } from '../../services/movie-list';
import { MovieList } from '../../models/movie-list.model';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonItem,
    IonSelect,
    IonSelectOption,
    FormsModule,
  ]
})
export class HomePage implements OnInit {

  email = '';
  ime = '';
  sortOption = 'newest';

  lists: MovieList[] = [];

  constructor(
    private authService: AuthService,
    private movieListService: MovieListService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({
      filmOutline,
      listOutline,
      addCircleOutline,
      logOutOutline,
      heartOutline,
      chevronForwardOutline,
      trashOutline,
      swapVerticalOutline
    });
  }

  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
    this.ime = localStorage.getItem('ime') || '';
    this.sortOption = 'newest';
    this.ucitajListu();
  }

  ucitajListu() {
    const userId = this.authService.getUserId();
    const token = this.authService.getToken();

    if (!userId || !token) {
      return;
    }

    this.movieListService.getLists(userId, token).subscribe({
      next: (lists) => {
        this.lists = lists;
       this.sortirajListu();
      },
      error: (err) => {
        console.log('Greška pri učitavanju lista:', err);
      }
    });
  }

  async dodajListu() {
  const alert = await this.alertController.create({
    cssClass: 'custom-alert',
    header: 'Nova lista',
    message: 'Unesite naziv nove liste filmova.',
    inputs: [
      {
        name: 'name',
        type: 'text',
        placeholder: 'Naziv liste'
      },
      {
        name: 'description',
        type: 'textarea',
        placeholder: 'Opis liste'
      }
    ],
    buttons: [
      {
        text: 'Otkaži',
        role: 'cancel',
        cssClass: 'alert-cancel-btn'
      },
      {
        text: 'Sačuvaj',
        cssClass: 'alert-save-btn',
        handler: (data) => {
          const name = data.name?.trim();
          const description = data.description?.trim() || '';

          if (!name) {
            return false;
          }

          this.sacuvajListu(name, description);
          return true;
        }
      }
    ]
  });

  await alert.present();
}

async izmeniListu(list: MovieList) {
  const alert = await this.alertController.create({
    header: 'Izmena liste',
    inputs: [
      {
        name: 'name',
        type: 'text',
        value: list.name,
        placeholder: 'Naziv liste'
      },
      {
        name: 'description',
        type: 'textarea',
        value: list.description,
        placeholder: 'Opis liste'
      }
    ],
    buttons: [
      {
        text: 'Otkaži',
        role: 'cancel'
      },
      {
        text: 'Sačuvaj',
        handler: (data) => {
          const name = data.name?.trim();
          const description = data.description?.trim() || '';

          if (!name || !list.id) {
            return false;
          }

          this.sacuvajIzmene(list, name, description);
          return true;
        }
      }
    ]
  });

  await alert.present();
}

sacuvajIzmene(list: MovieList, name: string, description: string) {
  const userId = this.authService.getUserId();
  const token = this.authService.getToken();

  if (!userId || !token || !list.id) {
    return;
  }

  this.movieListService
    .izmeniListu(userId, token, list.id, name, description)
    .subscribe({
      next: () => {
        list.name = name;
        list.description = description;
      },
      error: (err) => {
        console.log('Greška pri izmeni liste:', err);
      }
    });
}

sacuvajListu(name: string, description: string) {
  const userId = this.authService.getUserId();
  const token = this.authService.getToken();

  if (!userId || !token) {
    return;
  }

  this.movieListService.dodajListu(userId, token, name, description).subscribe({
    next: (response: any) => {
      this.lists.push({
        id: response.name,
        name,
        description,
        createdAt: new Date().toISOString()
      });
      this.sortirajListu();
    },
    error: (err) => {
      console.log('Greška pri dodavanju liste:', err);
    }
  });
}

async obrisiListu(list: MovieList) {
  const alert = await this.alertController.create({
    header: 'Brisanje liste',
    message: `Da li ste sigurni da želite da obrišete listu "${list.name}"?`,
    buttons: [
      {
        text: 'Otkaži',
        role: 'cancel'
      },
      {
        text: 'Obriši',
        role: 'destructive',
        handler: () => {
          this.obrisi(list);
        }
      }
    ]
  });

  await alert.present();
}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  
  obrisi(list: MovieList) {
  const userId = this.authService.getUserId();
  const token = this.authService.getToken();

  if (!userId || !token || !list.id) {
    return;
  }

  this.movieListService.obrisiListu(userId, token, list.id).subscribe({
    next: () => {
      this.lists = this.lists.filter(item => item.id !== list.id);
    },
    error: (err) => {
      console.log('Greška pri brisanju liste:', err);
    }
  });
}


sortirajListu() {

  switch (this.sortOption) {

    case 'newest':
      this.lists.sort((a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
      break;

    case 'oldest':
      this.lists.sort((a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
      );
      break;

    case 'az':
      this.lists.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      break;

    case 'za':
      this.lists.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
      break;
  }

}




  ispisiDatum(date: string): string {

  const d = new Date(date);

  return d.toLocaleDateString('sr-RS', {
     day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

}
}