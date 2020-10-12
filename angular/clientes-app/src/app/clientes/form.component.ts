import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  public titulo: string = 'Crear cliente';

  public errores: string[];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private actitivateRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.actitivateRoute.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.clienteService
          .getCliente(id)
          .subscribe((cliente) => (this.cliente = cliente));
      }
    });
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe((cliente) => {
      this.router.navigate(['/clientes']);
      let {nombre, apellido} = this.cliente;
      console.log(`${nombre}`);
      swal.fire(
        'Nuevo cliente',
        `Cliente ${nombre} ${apellido} creado con éxito!`,
        'success'
      );
    },
      err => {
        this.errores = err.error.errors as string[];
        /*Opcional*/
        console.error("Código de error desde el backend: " + err.status);
        console.error(err.error.errors);
      }
    );
  }

  update():void{
    this.clienteService.update(this.cliente)
    .subscribe(cliente =>{
      this.router.navigate(['/clientes']);
      let {nombre, apellido} = this.cliente;
      console.log(`${nombre}`);
      swal.fire(
        'Cliente Actualizado',
        `Cliente ${nombre} ${apellido} actualizado con éxito!`,
        'success'
      );
    },
    err => {
      this.errores = err.error.errors as string[];
      /*Opcional*/
      console.error("Código de error desde el backend: " + err.status);
      console.error(err.error.errors);
    })
  }
}
