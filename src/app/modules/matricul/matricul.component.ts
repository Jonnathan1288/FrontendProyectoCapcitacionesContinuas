import { Component } from '@angular/core';
import { Inscrito} from 'src/app/models/inscrito';
import { inscritosService } from 'src/app/service/inscritos.service';

@Component({
  selector: 'app-matricul',
  templateUrl: './matricul.component.html',
  styleUrls: ['./matricul.component.css']
})
export class MatriculComponent {
  
  estadoMatriculaActivo: boolean=true;
  estadoAporbacion: boolean=true;
  fechaMatricula:Date=new Date();
  constructor(private inscritosService: inscritosService) {}


}
