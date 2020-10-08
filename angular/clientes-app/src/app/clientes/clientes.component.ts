import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe(
      /*
     * funtion (clientes){
       this.clientes = clientes
     }
     */
      /*Función anonima*/
      (clientes) => (this.clientes = clientes)
    );
  }

  delete(cliente: Cliente): void {
    swal.fire({
        title: 'Está seguro?',
        text: `¿Seguro que desea eliminar al cliente  ${cliente.nombre} ${cliente.apellido}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'No, cancelar!',
        confirmButtonClass: 'btn btn-success ml-2',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
        reverseButtons: true,
      } as any) .then((result) => {
        if (result.isConfirmed) {
          this.clienteService.delete(cliente.id).subscribe(
            response => {
              this.clientes = this.clientes.filter(cli => cli !== cliente)
              swal.fire('Cliente eliminado!', 
                        `Cliente ${cliente.nombre} eliminado con éxito`,
                          'success');
            }
          )
          
        }
      });
  }
}
