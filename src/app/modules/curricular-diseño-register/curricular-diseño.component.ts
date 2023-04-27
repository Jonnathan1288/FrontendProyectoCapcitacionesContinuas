import { Component, OnInit } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { LoadScript } from 'src/app/scripts/load-script';
import { Silabo } from 'src/app/models/silabo';
import { EvaluacionDiagnosticaCurriculares } from 'src/app/models/evaluacion-diagnostica-curriculares';
import { EvaluacionFinalCurriculares } from 'src/app/models/evaluacion-final-curriculares';
import { EntornoAprendizajeCurricular} from 'src/app/models/entorno-aprendizaje-curricular';
import { SilaboService } from 'src/app/service/silabo.service';
import { DisenioCurricularService } from 'src/app/service/disenio-curricular.service';
import { EvaluacionDiagnosticoCurricularService } from 'src/app/service/evaluacion-diagnostico-curricular.service';
import { EvaluacionFinalCurricularService } from 'src/app/service/evaluacion-final-curricular.service';
import { EntornoAprendizajeService } from 'src/app/service/entorno-aprendizaje.service';
import { Router } from '@angular/router';
import { DisenioCurriculares } from 'src/app/models/disenio-curriculares';

@Component({
  selector: 'app-curricular',
  templateUrl: './curricular-diseño.component.html',
  styleUrls: ['./curricular-diseño.component.css']
})
export class CurricularDiseñoComponent implements OnInit {
  constructor(
    private router: Router,
    private silaboService: SilaboService,
    private disenioCurricularService: DisenioCurricularService,
    private evaluacionDiagnosticoCurricularService:EvaluacionDiagnosticoCurricularService,
    private evaluacionFinalCurricularService: EvaluacionFinalCurricularService,
    private entornoAprendizajeService: EntornoAprendizajeService
    
  ) {
  }

  /* ENTIDADES UTILIZAR*/
  silabo: Silabo = new Silabo();
  disenioCurricular: DisenioCurriculares = new DisenioCurriculares();
  evaluacionDiagnosticoCurricular:EvaluacionDiagnosticaCurriculares= new EvaluacionDiagnosticaCurriculares();
  evaluacionFinalCurricular:EvaluacionFinalCurriculares= new EvaluacionFinalCurriculares();
  entornoAprendizajeCurricular:EntornoAprendizajeCurricular= new EntornoAprendizajeCurricular();



  ngOnInit() {

  }

  /* TRAER DATOS DEL CURSO*/

  idSilaboCap?: number;
  CapIdSilaboSend?: number;

  public obtenerDatosCurso(): void {
    if (this.idSilaboCap != null && this.idSilaboCap != undefined) {
      this.silaboService.getCursoById(this.idSilaboCap).subscribe((data) => {
        this.silabo = data;
        this.CapIdSilaboSend = this.silabo.idSilabo;
      })
    } else {
      console.log("Silabo not found =(")
    }
  }
  /* FIN TRAER DATOS*/

  /* CREACION RESULTADOS APRENDIZAJE - ARRAY TEMPORAL*/
  listEvaluacionDiagnosticaCurricular:EvaluacionDiagnosticaCurriculares[] = [];


  public almacenarLista(): void {
    if (!this.evaluacionDiagnosticoCurricular.instrumnetoFormativa || !this.evaluacionDiagnosticoCurricular.tecnicaFormativa) {
      alert("Campos Vacios")
    } else {
      this.listEvaluacionDiagnosticaCurricular.push(this.evaluacionDiagnosticoCurricular);
      this.evaluacionDiagnosticoCurricular = new EvaluacionDiagnosticaCurriculares();
      this.evaluacionDiagnosticoCurricular.instrumnetoFormativa = '';
      this.evaluacionDiagnosticoCurricular.tecnicaFormativa = '';
    }
  }

  public quitarElemento(index: number): void {
    this.listEvaluacionDiagnosticaCurricular.splice(index, 1);
  }

  /* FIN RESULTADOS APRENDIZAJE */
}
