import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bienvenidos a Angular';

  // tslint:disable-next-line: whitespace
  curso:string = 'Curso Spring 5 con Angular 10';

  alumno: string = 'César Vargas Escorcia';
}
