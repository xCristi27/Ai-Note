import { Component } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { RouterModule } from '@angular/router';

import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private activatedRoute: ActivatedRoute) { }

  isLoggedIn = false;
  
  login() {
    this.isLoggedIn = true;
  }
  
}