import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonItem, IonInput, IonButton,
  IonCard, IonCardContent, IonIcon, IonToast
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { filmOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonItem, IonInput, IonButton,
    IonCard, IonCardContent, IonIcon, IonToast
  ]
})
export class LoginPage implements OnInit {

  email = '';
  password = '';

  toastMessage = '';
  isToastOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ filmOutline });
  }

  ngOnInit() {}

  login() {
    if (!this.email || !this.password) {
      this.prikaziPoruku('Unesite email i lozinku.');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.prikaziPoruku('Uspešna prijava.');
        this.router.navigate(['/home']);
      },
      error: () => {
        this.prikaziPoruku('Pogrešan email ili lozinka.');
      }
    });
  }

  prikaziPoruku(message: string) {
    this.toastMessage = message;
    this.isToastOpen = true;
  }
}