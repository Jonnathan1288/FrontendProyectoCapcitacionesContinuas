import { Component } from '@angular/core';
import { Matricula } from 'src/app/models/matricula';
import { MatriculaService } from 'src/app/service/matricula.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrls: ['./matricula.component.css']
})
export class MatriculaComponent {
  
  estadoMatriculaActivo: boolean=true;
  estadoAporbacion: boolean=true;
  fechaMatricula:Date=new Date();
  constructor(private matriculaService: MatriculaService) {}

  async guardarMatricula() {
    const matricula: Matricula = {
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
