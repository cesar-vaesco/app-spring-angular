import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [
    {
      id: 1,
      nombre: 'César',
      apellido: 'Vargas',
      email: 'ces@var.com',
      createAt: '2017-12-11',
    },
    {
      id: 2,
      nombre: 'Omar',
      apellido: 'Lop',
      email: 'om@vlop.com',
      createAt: '2017-12-11',
    },
    {
      id: 3,
      nombre: 'Iván',
      apellido: 'San',
      email: 'ivn@lop.com',
      createAt: '2017-12-11',
    },
    {
      id: 4,
      nombre: 'Rodrí',
      apellido: 'Per',
      email: 'rod@per.com',
      createAt: '2017-12-11',
    },
    {
      id: 5,
      nombre: 'Leo',
      apellido: 'Mar',
      email: 'leo@mar.com',
      createAt: '2017-12-11',
    },
    {
      id: 6,
      nombre: 'Arthur',
      apellido: 'Varela',
      email: 'art@var.com',
      createAt: '2017-12-11',
    },
    {
      id: 7,
      nombre: 'Raúl',
      apellido: 'Sol',
      email: 'rul@sol.com',
      createAt: '2017-12-11',
    },
    {
      id: 8,
      nombre: 'Omar',
      apellido: 'Lop',
      email: 'om@vlop.com',
      createAt: '2017-12-11',
    },
    {
      id: 9,
      nombre: 'Iván',
      apellido: 'San',
      email: 'ivn@lop.com',
      createAt: '2017-12-11',
    },
    {
      id: 10,
      nombre: 'Rodrí',
      apellido: 'Per',
      email: 'rod@per.com',
      createAt: '2017-12-11',
    },
    {
      id: 11,
      nombre: 'Leo',
      apellido: 'Mar',
      email: 'leo@mar.com',
      createAt: '2017-12-11',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
