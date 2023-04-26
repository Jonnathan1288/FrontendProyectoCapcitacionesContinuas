import { Component } from '@angular/core';
import { Inscrito} from 'src/app/models/inscrito';
import { MatriculaService } from 'src/app/service/matricula.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matricul',
  templateUrl: './matricul.component.html',
  styleUrls: ['./matricul.component.css']
})
export class MatriculComponent {
  
  estadoMatriculaActivo: boolean=true;
  estadoAporbacion: boolean=true;
  fechaMatricula:Date=new Date();
  constructor(private matriculaService: MatriculaService) {}

  async guardarMatricula() {
    const matricula: Inscrito = {
      fechaMatricula: this.fechaMatricula,
      estadoAporbacion: this.estadoAporbacion,
      estadoMatriculaActivo: this.estadoMatriculaActivo
    };
    const matriculaGuardada = await this.matriculaService.savematricula(matricula);
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!'
      
    });
  }
}
