import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
})
export class DetalleComponent implements OnInit {
  
  /*
   *@Input() Decorador que marca un campo de clase como una propiedad de entrada y proporciona metadatos de configuración. 
   *La propiedad de entrada está vinculada a una propiedad DOM en la plantilla.
   *Durante la detección de cambios, Angular actualiza automáticamente la propiedad de datos con el valor de la propiedad DOM.
   */ 
  @Input() cliente: Cliente;

  titulo: string = 'Detalle del cliente';
  public fotoSeleccionada: File;
  progreso: number = 0;

  constructor(
    private clienteService: ClienteService,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    /**Se reinicia el progreso cuando se reenvia una nueva foto */
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal.fire(
        'Error seleccionar imagen: ',
        '¡El archivo debe de ser de tipo imagen..!',
        'error'
      );
      this.fotoSeleccionada = null;
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      swal.fire('Error Upload: ', '¡Debe de seleccionar una foto!', 'error');
    } else {
      this.clienteService
        .subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe(event => {
          if(event.type === HttpEventType.UploadProgress){
            this.progreso = Math.round((event.loaded/ event.total) *100);
            console.log(this.progreso + '% uploaded');
          }else if (event.type === HttpEventType.Response) {
            let response:any = event.body;
            this.cliente = response.cliente as Cliente;
            swal.fire(
              'La foto se ha subido correctamente!',
              response.mensaje ,
              'success'
            );
          }
         // this.cliente = cliente;
         
        });
    }
  }
}
