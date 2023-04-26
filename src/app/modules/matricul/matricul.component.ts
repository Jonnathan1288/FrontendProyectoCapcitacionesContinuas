import { Component } from '@angular/core';
import { Inscrito} from 'src/app/models/inscrito';
import { MatriculaService } from 'src/app/service/matricula.service';

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


}
