import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonButton,
  IonCard, IonCardContent, IonIcon, IonToast
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { filmOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonItem, IonInput, IonButton, RouterLink, IonCard, IonCardContent,
    IonIcon, IonToast
  ]
})
export class RegisterPage implements OnInit {

  name = '';
  prezime = '';
  email = '';
  password = '';
  confirmPassword = '';

  toastMessage = '';
  isToastOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ filmOutline });
  }

  ngOnInit() {}

  register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.prikaziPoruku('Popunite sva polja.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.prikaziPoruku('Lozinke se ne poklapaju.');
      return;
    }

    if (this.password.length < 6) {
      this.prikaziPoruku('Lozinka mora imati najmanje 6 karaktera.');
      return;
    }

    this.authService.register(this.email, this.password, this.name, this.prezime).subscribe({
      next: () => {
        this.prikaziPoruku('Uspešna registracija.');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.prikaziPoruku('Greška pri registraciji. Proverite email ili lozinku.');
      }
    });
  }

  prikaziPoruku(message: string) {
    this.toastMessage = message;
    this.isToastOpen = true;
  }
}