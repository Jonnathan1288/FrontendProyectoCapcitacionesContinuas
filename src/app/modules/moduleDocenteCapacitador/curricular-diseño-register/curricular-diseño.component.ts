import { Component, OnInit } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { LoadScript } from 'src/app/scripts/load-script';
import { Silabo } from 'src/app/models/silabo';
import { EvaluacionDiagnosticaCurriculares } from 'src/app/models/evaluacion-diagnostica-curriculares';
import { EvalucionFormativaCurriculares } from 'src/app/models/evalucion-formativa-curriculares';
import { EvaluacionFinalCurriculares } from 'src/app/models/evaluacion-final-curriculares';
import { EntornoAprendizajeCurricular } from 'src/app/models/entorno-aprendizaje-curricular';
import { PrerequisitoCurso } from 'src/app/models/prerequisito-curso';
import { SilaboService } from 'src/app/service/silabo.service';
import { DisenioCurricularService } from 'src/app/service/disenio-curricular.service';
import { EvaluacionDiagnosticoCurricularService } from 'src/app/service/evaluacion-diagnostico-curricular.service';
import { EvaluacionFormativaCurricularService } from 'src/app/service/evaluacion-formativa-curricular.service';
import { EvaluacionFinalCurricularService } from 'src/app/service/evaluacion-final-curricular.service';
import { EntornoAprendizajeService } from 'src/app/service/entorno-aprendizaje.service';
import { PrerrequisitosCursoService } from 'src/app/service/prerrequisitosCurso.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DisenioCurriculares } from 'src/app/models/disenio-curriculares';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import { ToastrService } from 'ngx-toastr';
import { FaseTeorica } from 'src/app/models/fase-teorica';
import { Instalacion } from 'src/app/models/instalacion';
import { FasePractica } from 'src/app/models/fase-practica';
import { Recurso } from 'src/app/models/recurso';
import { FaseTeoricaService } from 'src/app/service/fase-teorica.service';
import { FasePracticaService } from 'src/app/service/fase-practica.service';

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
    private evaluacionDiagnosticoCurricularService: EvaluacionDiagnosticoCurricularService,
    private evaluacionFormativaCurricularService: EvaluacionFormativaCurricularService,
    private evaluacionFinalCurricularService: EvaluacionFinalCurricularService,
    private prerrequitsitoCursoService: PrerrequisitosCursoService,
    private entornoAprendizajeService: EntornoAprendizajeService,
    private reportService: ReportsCapacitacionesService,
    private toastr: ToastrService,
    private actiRouter: ActivatedRoute,
    private faseTeoricaService: FaseTeoricaService,
    private fasePracticaService: FasePracticaService
  ) {
  }

  /* ENTIDADES UTILIZAR*/
  silabo: Silabo = new Silabo();
  disenioCurricular: DisenioCurriculares = new DisenioCurriculares();
  evaluacionDiagnosticoCurricular: EvaluacionDiagnosticaCurriculares = new EvaluacionDiagnosticaCurriculares();
  evaluacionFormativaCurricular: EvalucionFormativaCurriculares = new EvalucionFormativaCurriculares();
  evaluacionFinalCurricular: EvaluacionFinalCurriculares = new EvaluacionFinalCurriculares();
  entornoAprendizajeCurricular: EntornoAprendizajeCurricular = new EntornoAprendizajeCurricular();
  prerrequisitosCurso: PrerequisitoCurso = new PrerequisitoCurso();
  fasesTeoricas: FaseTeorica[] = [];
  fasesPracticas: FasePractica[] = [];


  instalacion: Instalacion = new Instalacion();


  ngOnInit() {
    this.actiRouter.params.subscribe((params) => {
      const id_silabo = params['id'];
      this.idSilaboCap = id_silabo;
      // this.obtenerDatosCurso();
      this.validacionDeDisenioExistente();


    });


  }

  validacionDeDisenioExistente(): void {
    this.disenioCurricularService.getDisenioCurricularValidacion(this.idSilaboCap).subscribe(
      data => {
        if (data === true) {
          this.toastr.success('Editar diseño curricular.');
          // alert('Ya tiene disenio Curricular' + data)
          this.traerDatos(this.idSilaboCap);
        } else {
          this.toastr.info('Listo para crear diseño curricular.');
          // alert(" no tien Disenio Curricular")
          this.obtenerDatosSilabo();
        }
      }
    )
  }
  /* TRAER DATOS DEL SILABO*/

  public getSilabo() {

  }


  idSilaboCap?: any;
  public obtenerDatosSilabo(): void {
    if (this.idSilaboCap != null && this.idSilaboCap != undefined) {
      this.silaboService.getSilaboById(this.idSilaboCap).subscribe((data) => {
        this.silabo = data;
        //this.CapIdSilaboSend = this.silabo.idSilabo;
        this.obtenerPrerrequisistos(this.silabo.curso?.idCurso!);
      })
    } else {
      console.log("Silabo not found =(")
    }
  }

  // TRAER PRE REUISITOS DEL CURSO
  listprerrequisitosCurso: PrerequisitoCurso[] = [];

  obtenerPrerrequisistos(idCurso: number) {
    this.prerrequitsitoCursoService.getPrerequisitoPropiosCurso(idCurso).subscribe(
      data => {
        this.listprerrequisitosCurso = data.map(
          dataTwo => {
            let requisitos = new PrerequisitoCurso;
            requisitos.idPrerequisitoCurso = dataTwo.idPrerequisitoCurso;
            requisitos.nombrePrerequisitoCurso = dataTwo.nombrePrerequisitoCurso;
            requisitos.estadoPrerequisitoCurso = dataTwo.estadoPrerequisitoCurso;
            return requisitos;
          }
        );
      }
    )
  }
  /* FIN TRAER DATOS*/

  /* CREACION RESULTADOS EVALUACION DIAGNOSTICA- ARRAY TEMPORAL*/
  listEvaluacionDiagnosticaCurricular: EvaluacionDiagnosticaCurriculares[] = [];


  public almacenarListaEvaluacionD(): void {
    if (!this.evaluacionDiagnosticoCurricular.instrumnetoEvaluar || !this.evaluacionDiagnosticoCurricular.tecnicaEvaluar) {
      // alert("Campos Vacios")
      this.toastr.error('Campos vacios');

    } else {
      this.listEvaluacionDiagnosticaCurricular.push(this.evaluacionDiagnosticoCurricular);
      this.evaluacionDiagnosticoCurricular = new EvaluacionDiagnosticaCurriculares();
      this.evaluacionDiagnosticoCurricular.instrumnetoEvaluar = '';
      this.evaluacionDiagnosticoCurricular.tecnicaEvaluar = '';
    }
  }

  public quitarElementoEvaluacionD(index: number): void {
    this.listEvaluacionDiagnosticaCurricular.splice(index, 1);
  }

  /* FIN RESULTADOS Evaluacion Diagnostica */


  /* CREACION RESULTADOS EVALUACION FORMATIVA- ARRAY TEMPORAL*/
  listEvaluacionFormativaCurricular: EvalucionFormativaCurriculares[] = [];


  public almacenarListaEvaluacionFormativa(): void {
    // if (!this.evaluacionFormativaCurricular.instrumnetoFormativa || !this.evaluacionFormativaCurricular.tecnicaFormativa) {
    //   // alert("Campos Vacios")
    //   this.toastr.error('Campos vacios');

    // } else {
    this.listEvaluacionFormativaCurricular.push(this.evaluacionFormativaCurricular);
    this.evaluacionFormativaCurricular = new EvalucionFormativaCurriculares();
    this.evaluacionFormativaCurricular.instrumnetoFormativa = '';
    this.evaluacionFormativaCurricular.tecnicaFormativa = '';
    // }
  }

  public quitarElementoEvaluacionFormativa(index: number): void {
    this.listEvaluacionFormativaCurricular.splice(index, 1);
  }

  /* FIN RESULTADOS Evaluacion FORMATIVA */


  /* CREACION RESULTADOS EVALUACION FINAL- ARRAY TEMPORAL*/
  listEvaluacionFinalCurricular: EvaluacionFinalCurriculares[] = [];


  public almacenarListaEvaluacionF(): void {
    // if (!this.evaluacionFinalCurricular.instrumnetoFormativaFinal || !this.evaluacionFinalCurricular.tecnicaFormativaFinal) {
    //   // alert("Campos Vacios")
    //   this.toastr.error('Campos vacios');

    // } else {
    this.listEvaluacionFinalCurricular.push(this.evaluacionFinalCurricular);
    this.evaluacionFinalCurricular = new EvaluacionFinalCurriculares();
    this.evaluacionFinalCurricular.instrumnetoFormativaFinal = '';
    this.evaluacionFinalCurricular.tecnicaFormativaFinal = '';
    //}
  }

  public quitarElementoEvaluacionF(index: number): void {
    this.listEvaluacionFinalCurricular.splice(index, 1);
  }

  /* FIN RESULTADOS Evaluacion FINAL */


  /* CREACION RESULTADOS ENTORNO APRENDIZAJE- ARRAY TEMPORAL*/
  listEntornoAprendizaje: EntornoAprendizajeCurricular[] = [];


  public almacenarEntornoAprendizaje(): void {
    // if (!this.entornoAprendizajeCurricular.instalaciones || !this.entornoAprendizajeCurricular.faseTeorica
    //   || !this.entornoAprendizajeCurricular.fasePractica) {
    //   // alert("Campos Vacios")
    //   this.toastr.error('Campos vacios');
    // } else {
    this.listEntornoAprendizaje.push(this.entornoAprendizajeCurricular);
    this.entornoAprendizajeCurricular = new EntornoAprendizajeCurricular();
    this.entornoAprendizajeCurricular.instalaciones = '';
    this.entornoAprendizajeCurricular.faseTeorica = '';
    this.entornoAprendizajeCurricular.fasePractica = '';
    //}
  }

  public quitarEntornoAprendizaje(index: number): void {
    this.listEntornoAprendizaje.splice(index, 1);
  }

  /* FIN RESULTADOS ENTORNO APRENDIZAJE */

  /* METODO POST */
  idDisenioCurricularCap?: number;

  public generarDisenioCurricular(): void {
    this.disenioCurricular.silabo = this.silabo;


    this.disenioCurricular.estadoDisenioCurricular = true;

    this.disenioCurricularService.saveDisenioCurricular(this.disenioCurricular).subscribe(disenioData => {
      this.disenioCurricular = disenioData;
      this.idDisenioCurricularCap = this.disenioCurricular.idDisenioCurricular;
      console.log("Data + " + disenioData)
      /* TABLAS */
      this.generarEvaliacionDiagnostica();
      this.generarEvaluacionFormativa();
      this.generarEvaluacionFinal();
      this.generarEntornoAprendizaje();
      // alert('Guardado exitoso');
      this.toastr.success('Registro Exitoso');
      setTimeout(() => {
        location.reload();
      }, 1200);
      /* */
    })
    //}
  }
  /* */

  /* ENTIDADES SEGUIDAS DEL DISEÑO CURRICULAR */
  public generarEvaliacionDiagnostica(): void {

    for (let evaluacionDiagnostica of this.listEvaluacionDiagnosticaCurricular) {
      evaluacionDiagnostica.disenioCurricular = this.disenioCurricular;
      evaluacionDiagnostica.estadoEvaluacionDiagnostica = true;
      this.evaluacionDiagnosticoCurricularService.saveEvaluacionDiagnosticoCurricular(evaluacionDiagnostica).subscribe(data => {
        console.log("Se creo Evaluacion Diagnostica =)");
      });
    }

  }

  public generarEvaluacionFormativa(): void {

    for (let evaluacionFormativa of this.listEvaluacionFormativaCurricular) {
      evaluacionFormativa.disenioCurricular = this.disenioCurricular;
      evaluacionFormativa.estadoEvaluacionFormativa = true;
      this.evaluacionFormativaCurricularService.saveEvaluacionFormativaCurricular(evaluacionFormativa).subscribe(data => {
        console.log("Se creo Evaluacion Formativa =)");
      });
    }

  }

  public generarEvaluacionFinal(): void {

    for (let evaluacionFinal of this.listEvaluacionFinalCurricular) {
      evaluacionFinal.disenioCurricular = this.disenioCurricular;
      evaluacionFinal.estadoEvaluacionFinal = true;
      this.evaluacionFinalCurricularService.saveEvaluacionFinalCurricular(evaluacionFinal).subscribe(data => {
        console.log("Se creo Evaluacion Final=)");
      });
    }

  }

  public generarEntornoAprendizaje(): void {

    for (let entornoAprendizaje of this.listEntornoAprendizaje) {
      entornoAprendizaje.disenioCurricular = this.disenioCurricular;
      entornoAprendizaje.estadoEntornoAprendizaje = true;
      this.entornoAprendizajeService.saveEntornoAprendizajeCurricular(entornoAprendizaje).subscribe(data => {
        console.log("Se creo Entorno Aprendizaje =)");
      });
    }

  }

  /* */
  // ACTUALIZAR DISEÑO CURRICULAR //

  validarIdDisenioCurricular: Boolean = false;
  idDelDisenio: any;
  public traerDatos(idSilabo: number): void {
    this.disenioCurricularService.getDisenioCurricularByIdPorSilabo(idSilabo).subscribe(
      data => {
        this.disenioCurricular = data;
        this.idDelDisenio = this.disenioCurricular.idDisenioCurricular;
        console.log("id del disenio curricular nuevo -> " + this.idDelDisenio)
        this.traerDatosEvaluacionDiagnosticaFull(this.idDelDisenio!);
        this.traerDatosEvaluacionFormativaFull(this.idDelDisenio!);
        this.traerDatosEvaluacionFinalFull(this.idDelDisenio!);
        this.traerDatosEntornoAprendizajeFull(this.idDelDisenio!);
        this.validarIdDisenioCurricular = true;
        this.cargarFasesPorIdDisenoCurricular(this.idDelDisenio);



      }
    )


  }

  // TRAER TODOS LOS DATOS DEL SILABO
  public traerDatosEvaluacionDiagnosticaFull(idDisenioCurricular: number): void {
    this.evaluacionDiagnosticoCurricularService.getEvaluacionDiagnosticaCurricularPorDisenioById(idDisenioCurricular).subscribe(
      data => {
        this.listEvaluacionDiagnosticaCurricular = data.map(
          dataTwo => {
            let evaluacionDiagnosticoCurricular = new EvaluacionDiagnosticaCurriculares();
            evaluacionDiagnosticoCurricular.idEvaluacionDiagnosticaCurricular = dataTwo.idEvaluacionDiagnosticaCurricular;
            evaluacionDiagnosticoCurricular.instrumnetoEvaluar = dataTwo.instrumnetoEvaluar;
            evaluacionDiagnosticoCurricular.tecnicaEvaluar = dataTwo.tecnicaEvaluar;
            evaluacionDiagnosticoCurricular.estadoEvaluacionDiagnostica = dataTwo.estadoEvaluacionDiagnostica;
            return evaluacionDiagnosticoCurricular;
          }
        )
      }
    )
  }

  public traerDatosEvaluacionFormativaFull(idDisenioCurricular: number): void {
    this.evaluacionFormativaCurricularService.getEvaluacionFormativaCurricularPorDisenioById(idDisenioCurricular).subscribe(
      data => {
        this.listEvaluacionFormativaCurricular = data.map(
          dataTwo => {
            let evaluacionFormativaCurricular = new EvalucionFormativaCurriculares();
            evaluacionFormativaCurricular.idEvalucionFormativaCurricular = dataTwo.idEvalucionFormativaCurricular;
            evaluacionFormativaCurricular.instrumnetoFormativa = dataTwo.instrumnetoFormativa;
            evaluacionFormativaCurricular.tecnicaFormativa = dataTwo.tecnicaFormativa;
            evaluacionFormativaCurricular.estadoEvaluacionFormativa = dataTwo.estadoEvaluacionFormativa;
            return evaluacionFormativaCurricular;
          }
        )
      }
    )
  }
  public traerDatosEvaluacionFinalFull(idDisenioCurricular: number): void {
    this.evaluacionFinalCurricularService.getEvaluacionFinalCurricularPorDisenioById(idDisenioCurricular).subscribe(
      data => {
        this.listEvaluacionFinalCurricular = data.map(
          dataTwo => {
            let evaluacionFinalCurricular = new EvaluacionFinalCurriculares();
            evaluacionFinalCurricular.idEvaluacionFinal = dataTwo.idEvaluacionFinal;
            evaluacionFinalCurricular.instrumnetoFormativaFinal = dataTwo.instrumnetoFormativaFinal;
            evaluacionFinalCurricular.tecnicaFormativaFinal = dataTwo.tecnicaFormativaFinal;
            evaluacionFinalCurricular.estadoEvaluacionFinal = dataTwo.estadoEvaluacionFinal;
            return evaluacionFinalCurricular;
          }
        )
      }
    )
  }
  public traerDatosEntornoAprendizajeFull(idDisenioCurricular: number): void {
    this.entornoAprendizajeService.getEntornoAprendizajePorDisenioById(idDisenioCurricular).subscribe(
      data => {
        this.listEntornoAprendizaje = data.map(
          dataTwo => {
            let entornoAprendizajeCurricular = new EntornoAprendizajeCurricular();
            entornoAprendizajeCurricular.idEntornoCurricular = dataTwo.idEntornoCurricular;
            entornoAprendizajeCurricular.instalaciones = dataTwo.instalaciones;
            entornoAprendizajeCurricular.faseTeorica = dataTwo.faseTeorica;
            entornoAprendizajeCurricular.fasePractica = dataTwo.fasePractica;
            entornoAprendizajeCurricular.estadoEntornoAprendizaje = dataTwo.estadoEntornoAprendizaje;
            return entornoAprendizajeCurricular;
          }
        )
      }
    )
  }

  // FIN

  // METODO ESTADOS TABLES//
  public cambiarEstadoEntornoAprendizajeCurricularFalse(idEntornoCurricular: number): void {
    this.entornoAprendizajeService.getEntornoAprendizajeCurricularById(idEntornoCurricular).subscribe(
      data => {
        this.entornoAprendizajeCurricular = data;
        this.entornoAprendizajeCurricular.estadoEntornoAprendizaje = false;
        this.entornoAprendizajeService.cambiarEstadosEntornoAprendizajeSilaboId(idEntornoCurricular, this.entornoAprendizajeCurricular).subscribe(
          dataTwo => {
            this.traerDatosEntornoAprendizajeFull(this.idDelDisenio!);
            console.log("Se actualizo")
          }
        )
      }
    )

  }

  public cambiarEstadoEntornoAprendizajeCurricularTrue(idEntornoCurricular: number): void {
    this.entornoAprendizajeService.getEntornoAprendizajeCurricularById(idEntornoCurricular).subscribe(
      data => {
        this.entornoAprendizajeCurricular = data;
        this.entornoAprendizajeCurricular.estadoEntornoAprendizaje = true;
        this.entornoAprendizajeService.cambiarEstadosEntornoAprendizajeSilaboId(idEntornoCurricular, this.entornoAprendizajeCurricular).subscribe(
          dataTwo => {
            this.traerDatosEntornoAprendizajeFull(this.idDelDisenio!);
            console.log("Se actualizo")
          }
        )
      }
    )

  }

  public cambiarEvaluacionDiagnosticaCurricularFalse(idEvalucionDiagnosticaCurricular: number): void {
    this.evaluacionDiagnosticoCurricularService.getEvaluacionDiagnosticoCurricularById(idEvalucionDiagnosticaCurricular).subscribe(
      data => {
        this.evaluacionDiagnosticoCurricular = data;
        this.evaluacionDiagnosticoCurricular.estadoEvaluacionDiagnostica = false;
        this.evaluacionDiagnosticoCurricularService.cambiarEstadosEvaluacioDiagnosticaDisenioCurricularId(idEvalucionDiagnosticaCurricular, this.evaluacionDiagnosticoCurricular).subscribe(
          dataTwo => {
            this.traerDatosEvaluacionDiagnosticaFull(this.idDelDisenio!);
            console.log("Se actualizo")
          }
        )
      }
    )

  }

  public cambiarEvaluacionDiagnosticaCurriculartrue(idEvalucionDiagnosticaCurricular: number): void {
    this.evaluacionDiagnosticoCurricularService.getEvaluacionDiagnosticoCurricularById(idEvalucionDiagnosticaCurricular).subscribe(
      data => {
        this.evaluacionDiagnosticoCurricular = data;
        this.evaluacionDiagnosticoCurricular.estadoEvaluacionDiagnostica = true;
        this.evaluacionDiagnosticoCurricularService.cambiarEstadosEvaluacioDiagnosticaDisenioCurricularId(idEvalucionDiagnosticaCurricular, this.evaluacionDiagnosticoCurricular).subscribe(
          dataTwo => {
            this.traerDatosEvaluacionDiagnosticaFull(this.idDelDisenio!);
            console.log("Se actualizo")
          }
        )
      }
    )

  }

  public cambiarEstadosEvaluacionFormativaFalse(idEvaluacionFormativa: number): void {
    this.evaluacionFormativaCurricularService.getEvaluacionFormativaCurricularById(idEvaluacionFormativa).subscribe(
      data => {
        this.evaluacionFormativaCurricular = data;
        this.evaluacionFormativaCurricular.estadoEvaluacionFormativa = false;
        this.evaluacionFormativaCurricularService.updateEvaluacionFormativaCurricularEstadoId(idEvaluacionFormativa, this.evaluacionFormativaCurricular).subscribe(
          dataTwo => {
            this.traerDatosEvaluacionFormativaFull(this.idDelDisenio!);
            console.log("Se actualizo")
          }
        )
      }
    )

  }

  public cambiarEstadosEvaluacionFormativaTrue(idEvaluacionFormativa: number): void {
    this.evaluacionFormativaCurricularService.getEvaluacionFormativaCurricularById(idEvaluacionFormativa).subscribe(
      data => {
        this.evaluacionFormativaCurricular = data;
        this.evaluacionFormativaCurricular.estadoEvaluacionFormativa = true;
        this.evaluacionFormativaCurricularService.updateEvaluacionFormativaCurricularEstadoId(idEvaluacionFormativa, this.evaluacionFormativaCurricular).subscribe(
          dataTwo => {
            this.traerDatosEvaluacionFormativaFull(this.idDelDisenio!);
            console.log("Se actualizo")
          }
        )
      }
    )

  }

  public cambiarEstadosEvaluacionFinalFalse(idEvaluacionFinal: number): void {
    this.evaluacionFinalCurricularService.getEvaluacionFinalCurricularById(idEvaluacionFinal).subscribe(
      data => {
        this.evaluacionFinalCurricular = data;
        this.evaluacionFinalCurricular.estadoEvaluacionFinal = false;
        this.evaluacionFinalCurricularService.updateEvaluacionFinalCurricularEstadoId(idEvaluacionFinal, this.evaluacionFinalCurricular).subscribe(
          dataTwo => {
            this.traerDatosEvaluacionFinalFull(this.idDelDisenio!);
            console.log("Se actualizo")
          }
        )
      }
    )

  }
  public cambiarEstadosEvaluacionFinalTrue(idEvaluacionFinal: number): void {
    this.evaluacionFinalCurricularService.getEvaluacionFinalCurricularById(idEvaluacionFinal).subscribe(
      data => {
        this.evaluacionFinalCurricular = data;
        this.evaluacionFinalCurricular.estadoEvaluacionFinal = true;
        this.evaluacionFinalCurricularService.updateEvaluacionFinalCurricularEstadoId(idEvaluacionFinal, this.evaluacionFinalCurricular).subscribe(
          dataTwo => {
            this.traerDatosEvaluacionFinalFull(this.idDelDisenio!);
            console.log("Se actualizo")
          }
        )
      }
    )

  }
  /* MODAL */
  visible?: boolean;
  visibleTree?: boolean;
  idCapModelEdit?: number;
  opcionCapEntornoAprendizaje?: string;

  // EDIT AND CREATE ENTORNO APRENDIZAJE //
  public showModalEdit(idEntornoCurricular: number) {
    this.opcionCapEntornoAprendizaje = "U"
    this.visible = true;
    this.entornoAprendizajeService.getEntornoAprendizajeCurricularById(idEntornoCurricular).subscribe(
      data => {
        this.entornoAprendizajeCurricular = data;
        this.idCapModelEdit = this.entornoAprendizajeCurricular.idEntornoCurricular;
      }
    )
  }

  public showModalCreateEntornoAprendizaje() {
    this.opcionCapEntornoAprendizaje = "C"
    this.entornoAprendizajeCurricular = new EntornoAprendizajeCurricular;
    this.visible = true;
  }

  public actualizarDisenioCurricular(): void {
    const nuevoDisenioCurricular: DisenioCurriculares = {
      ...this.disenioCurricular, // copiar todos los valores existentes de this.disenioCurricular
      estadoDisenioCurricular: true // sobrescribir el valor de estadoDisenioCurricular con true
    };
    // if (!this.disenioCurricular?.temasTransversales || !this.disenioCurricular?.estrategiasAprendizaje) {

    //   this.toastr.warning(
    //     'Se encontraron campos vacios, por favor complete el formulario', 'CAMPOS VACIOS'

    //   );
    // } else {
    this.disenioCurricularService.updateDisenioCurricular(this.idDelDisenio!, nuevoDisenioCurricular).subscribe(
      data => {
        this.traerDatos(this.idDelDisenio!);
        this.toastr.success('Actualización exitosa ', '¡Bien hecho!');

        setTimeout(() => {
          location.reload();
        }, 1200);
        // console.log("Se actualizó el Diseño Curricular");
      }
    );
    //}
  }



  public actualizarEntornoAprendizaje(): void {
    // if (!this.entornoAprendizajeCurricular?.fasePractica || !this.entornoAprendizajeCurricular?.faseTeorica
    //   || !this.entornoAprendizajeCurricular?.instalaciones) {

    //   this.toastr.warning(
    //     'Se encontraron campos vacios, por favor complete el formulario', 'CAMPOS VACIOS'

    //   );
    // } else {
    if (this.opcionCapEntornoAprendizaje == "C") {
      this.entornoAprendizajeCurricular.disenioCurricular = this.disenioCurricular;
      this.entornoAprendizajeCurricular.estadoEntornoAprendizaje = true;
      this.entornoAprendizajeService.saveEntornoAprendizajeCurricular(this.entornoAprendizajeCurricular).subscribe(
        dataTwo => {
          this.traerDatosEntornoAprendizajeFull(this.idDelDisenio!);
          this.toastr.success('Registro Exitoso');
          console.log("Se creo uno nuevo EA")
        }
      )
    } else {
      this.entornoAprendizajeService.updateEntornoAprendizajeCurricular(this.idCapModelEdit!, this.entornoAprendizajeCurricular).subscribe(
        dataTwo => {
          this.traerDatosEntornoAprendizajeFull(this.idDelDisenio!);
          this.toastr.success('Actualización exitosa ', '¡Bien hecho!');
          console.log("Se actualizo EA")
        }
      )
    }
    //}
  }
  // FIN 


  // CREATE AND UPDATE EVALUACION DIAGNOSTICA
  visibleFive?: boolean;
  visibleFiveCreate?: boolean;
  idCapModelEditEvaluacionDiagnostica?: number;
  opcionElegida?: string;

  public showModalCreateEvaluacionDiagnostica() {
    this.evaluacionDiagnosticoCurricular = new EvaluacionDiagnosticaCurriculares;
    this.opcionElegida = "C"
    this.visibleFive = true;
  }

  public showModalEditEvaluacionDiagnostica(idEvaluacionDiagnosticaCurricular: number) {
    this.visibleFive = true;
    this.opcionElegida = "U"
    this.evaluacionDiagnosticoCurricularService.getEvaluacionDiagnosticoCurricularById(idEvaluacionDiagnosticaCurricular).subscribe(
      data => {
        this.evaluacionDiagnosticoCurricular = data;
        this.idCapModelEditEvaluacionDiagnostica = this.evaluacionDiagnosticoCurricular.idEvaluacionDiagnosticaCurricular;
      }
    )
  }

  public actualizarEvaluacionDiagnostica(): void {
    // if (!this.evaluacionDiagnosticoCurricular?.instrumnetoEvaluar || !this.evaluacionDiagnosticoCurricular?.tecnicaEvaluar) {

    //   this.toastr.warning(
    //     'Se encontraron campos vacios, por favor complete el formulario', 'CAMPOS VACIOS'

    //   );
    // } else {

    if (this.opcionElegida == "C") {
      this.evaluacionDiagnosticoCurricular.disenioCurricular = this.disenioCurricular;
      this.evaluacionDiagnosticoCurricular.estadoEvaluacionDiagnostica = true;
      this.evaluacionDiagnosticoCurricularService.saveEvaluacionDiagnosticoCurricular(this.evaluacionDiagnosticoCurricular).subscribe(
        dataTwo => {
          this.traerDatosEvaluacionDiagnosticaFull(this.idDelDisenio!);
          this.toastr.success('Registro Exitoso');
          console.log("Se creo uno nuevo ED")
        }
      )
    } else {
      this.evaluacionDiagnosticoCurricularService.updateEvaluacionDiagnosticaCurricular(this.idCapModelEditEvaluacionDiagnostica!, this.evaluacionDiagnosticoCurricular).subscribe(
        dataTwo => {
          this.traerDatosEvaluacionDiagnosticaFull(this.idDelDisenio!);
          this.toastr.success('Actualización exitosa ', '¡Bien hecho!');
          console.log("Se actualizo ED")
        }
      )
    }
    //}
  }
  // CREATE AND UPDATE EVALUACION FORMATIVA
  visibleFive1?: boolean;
  visibleFiveCreate1?: boolean;
  idCapModelEditEvaluacionFormativa?: number;
  opcionElegidaEvaluacionFormativa?: string;

  public showModalCreateEvaluacionFormativa() {
    this.evaluacionFormativaCurricular = new EvalucionFormativaCurriculares;
    this.opcionElegidaEvaluacionFormativa = "C"
    this.visibleFive1 = true;
  }

  public showModalEditEvaluacionFormativa(idEvalucionFormativaCurricular: number) {
    this.visibleFive1 = true;
    this.opcionElegidaEvaluacionFormativa = "U"
    this.evaluacionFormativaCurricularService.getEvaluacionFormativaCurricularById(idEvalucionFormativaCurricular).subscribe(
      data => {
        this.evaluacionFormativaCurricular = data;
        this.idCapModelEditEvaluacionFormativa = this.evaluacionFormativaCurricular.idEvalucionFormativaCurricular;
      }
    )
  }

  public actualizarEvaluacionFormativa(): void {
    // if (!this.evaluacionFormativaCurricular?.instrumnetoFormativa || !this.evaluacionFormativaCurricular?.tecnicaFormativa) {

    //   this.toastr.warning(
    //     'Se encontraron campos vacios, por favor complete el formulario', 'CAMPOS VACIOS'

    //   );
    // } else {
    if (this.opcionElegidaEvaluacionFormativa == "C") {
      this.evaluacionFormativaCurricular.disenioCurricular = this.disenioCurricular;
      this.evaluacionFormativaCurricular.estadoEvaluacionFormativa = true;
      this.evaluacionFormativaCurricularService.saveEvaluacionFormativaCurricular(this.evaluacionFormativaCurricular).subscribe(
        dataTwo => {
          this.traerDatosEvaluacionFormativaFull(this.idDelDisenio!);
          this.toastr.success('Registro Exitoso');
          console.log("Se creo uno nuevo EFC")
        }
      )
    } else {
      this.evaluacionFormativaCurricularService.updateEvaluacionFormativaCurricular(this.idCapModelEditEvaluacionFormativa!, this.evaluacionFormativaCurricular).subscribe(
        dataTwo => {
          this.traerDatosEvaluacionFormativaFull(this.idDelDisenio!);
          this.toastr.success('Actualización exitosa ', '¡Bien hecho!');
          console.log("Se actualizo EFC")
        }
      )
    }
    //}
  }

  // CREATE AND UPDATE EVALUACION Final
  visibleFive2?: boolean;
  visibleFiveCreate2?: boolean;
  idCapModelEditEvaluacionFinal?: number;
  opcionElegidaEvaluacionFinal?: string;

  public showModalCreateEvaluacionFinal() {
    this.evaluacionFinalCurricular = new EvaluacionFinalCurriculares;
    this.opcionElegidaEvaluacionFinal = "C"
    this.visibleFive2 = true;
  }

  public showModalEditEvaluacionFinal(idEvaluacionFinal: number) {
    this.visibleFive2 = true;
    this.opcionElegidaEvaluacionFinal = "U"
    this.evaluacionFinalCurricularService.getEvaluacionFinalCurricularById(idEvaluacionFinal).subscribe(
      data => {
        this.evaluacionFinalCurricular = data;
        this.idCapModelEditEvaluacionFinal = this.evaluacionFinalCurricular.idEvaluacionFinal;
      }
    )
  }

  public actualizarEvaluacionFinal(): void {

    // if (!this.evaluacionFinalCurricular?.instrumnetoFormativaFinal || !this.evaluacionFinalCurricular?.tecnicaFormativaFinal) {

    //   this.toastr.warning(
    //     'Se encontraron campos vacios, por favor complete el formulario', 'CAMPOS VACIOS'

    //   );
    // } else {
    if (this.opcionElegidaEvaluacionFinal == "C") {
      this.evaluacionFinalCurricular.disenioCurricular = this.disenioCurricular;
      this.evaluacionFinalCurricular.estadoEvaluacionFinal = true;
      this.evaluacionFinalCurricularService.saveEvaluacionFinalCurricular(this.evaluacionFinalCurricular).subscribe(
        dataTwo => {
          this.traerDatosEvaluacionFinalFull(this.idDelDisenio!);
          this.toastr.success('Registro Exitoso');
          console.log("Se creo uno nuevo EFINAL")
        }
      )
    } else {
      this.evaluacionFinalCurricularService.updateEvaluacionFinalCurricular(this.idCapModelEditEvaluacionFinal!, this.evaluacionFinalCurricular).subscribe(
        dataTwo => {
          this.traerDatosEvaluacionFinalFull(this.idDelDisenio!);
          this.toastr.success('Actualización exitosa ', '¡Bien hecho!');
          console.log("Se actualizo EFINAL")
        }
      )
    }
    //}
  }

  // FIN

  // FIN //
  public actualizarSilabo(): void {

  }
  // FIN //
  // IMPRIMIR // VALIDAR idSilaboCapGlobal // idSilaboCap
  public getReportDisenioCurricular() {
    this.reportService.gedownloadDisenioC(this.idDelDisenio!)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }


  // guardarEntornoAprendizaje() {
  //   const faseTeoricas: FaseTeorica[] = [];
  //   const fasePracticas: FasePractica[] = [];

  //   // Recopila los datos de las fases teóricas
  //   const nombresFasesTeoricas = [
  //     'faseTeorica_aula_equipos',
  //     'faseTeorica_aula_Materiales',
  //     'faseTeorica_aula_Recursos',
  //     'faseTeorica_Taller_Máquinas',
  //     'faseTeorica_Taller_Materiales',
  //     'faseTeorica_Taller_Recursos'
  //   ];

  //   for (const nombreTextarea of nombresFasesTeoricas) {
  //     const textarea = (<HTMLTextAreaElement>document.querySelector(`textarea[name="${nombreTextarea}"]`));
  //     const valorTextarea = textarea.value;

  //     const faseTeorica = new FaseTeorica();
  //     faseTeorica.nombreFase = valorTextarea;
  //     faseTeorica.estado = true;

  //     const instalacion = new Instalacion();
  //     const recurso = new Recurso();
  //     const disenioCurricular = new DisenioCurriculares();
  //     disenioCurricular.idDisenioCurricular= this.idDelDisenio;

  //     // Asigna los IDs correspondientes a instalacion, recurso y disenioCurricular según tus reglas
  //     if (nombreTextarea.includes('aula')) {
  //       instalacion.idInstalacion = 1; // ID de aula
  //     } else {
  //       instalacion.idInstalacion = 2; // ID de taller o laboratorio
  //     }

  //     if (nombreTextarea.includes('equipos')) {
  //       recurso.idRecurso = 1; // ID de equipos
  //     } else if (nombreTextarea.includes('Materiales')) {
  //       recurso.idRecurso = 2; // ID de Materiales, insumos y recursos didácticos
  //     } else if (nombreTextarea.includes('Recursos')) {
  //       recurso.idRecurso = 3; // ID de Recursos didácticos y de consumo
  //     } else if (nombreTextarea.includes('Máquinas')) {
  //       recurso.idRecurso = 4; // ID de Máquinas, equipos y herramientas
  //     }

  //     // Asigna los IDs correspondientes a disenioCurricular (puedes obtenerlo de donde corresponda)

  //     faseTeorica.instalacion = instalacion;
  //     faseTeorica.recurso = recurso;
  //     faseTeorica.disenioCurricular = disenioCurricular;



  //     faseTeoricas.push(faseTeorica);
  //   }

  //   // Recopila los datos de las fases prácticas
  //   const nombresFasesPracticas = [
  //     'fasePractica_aula_equipos',
  //     'fasePractica_aula_Materiales',
  //     'fasePractica_aula_Recursos',
  //     'fasePractica_Taller_Máquinas',
  //     'fasePractica_Taller_Materiales',
  //     'fasePractica_Taller_Recursos'
  //   ];

  //   for (const nombreTextarea of nombresFasesPracticas) {
  //     const textarea = (<HTMLTextAreaElement>document.querySelector(`textarea[name="${nombreTextarea}"]`));
  //     const valorTextarea = textarea.value;

  //     const fasePractica = new FasePractica();
  //     fasePractica.nombreFase = valorTextarea;
  //     fasePractica.estado = true;

  //     const instalacion = new Instalacion();
  //     const recurso = new Recurso();
  //     const disenioCurricular = new DisenioCurriculares();

  //     // Asigna los IDs correspondientes a instalacion, recurso y disenioCurricular según tus reglas
  //     if (nombreTextarea.includes('aula')) {
  //       instalacion.idInstalacion = 1; // ID de aula
  //     } else {
  //       instalacion.idInstalacion = 2; // ID de taller o laboratorio
  //     }

  //     if (nombreTextarea.includes('equipos')) {
  //       recurso.idRecurso = 1; // ID de equipos
  //     } else if (nombreTextarea.includes('Materiales')) {
  //       recurso.idRecurso = 2; // ID de Materiales, insumos y recursos didácticos
  //     } else if (nombreTextarea.includes('Recursos')) {
  //       recurso.idRecurso = 3; // ID de Recursos didácticos y de consumo
  //     } else if (nombreTextarea.includes('Máquinas')) {
  //       recurso.idRecurso = 4; // ID de Máquinas, equipos y herramientas
  //     }

  //     // Asigna los IDs correspondientes a disenioCurricular (puedes obtenerlo de donde corresponda)

  //     fasePractica.instalacion = instalacion;
  //     fasePractica.recurso = recurso;
  //     fasePractica.disenioCurricular = disenioCurricular;


  //     fasePracticas.push(fasePractica);
  //   }

  //   // Ahora tienes listas separadas de objetos de fase teórica y fase práctica
  //   // Puedes enviar estas listas al servicio Angular para guardarlas en tu backend
  //   console.log('Fases Teóricas:');
  //   console.log(faseTeoricas);
  //   console.log('Fases Prácticas:');
  //   console.log(fasePracticas);

  //     // Llama al servicio para guardar las fases teóricas en el backend
  //     for (const faseTeorica of faseTeoricas) {
  //       this.faseTeoricaService.save(faseTeorica).subscribe(
  //         (response) => {
  //           // Maneja la respuesta exitosa aquí si es necesario
  //           console.log('Fase teórica guardada con éxito:', response);
  //         },
  //         (error) => {
  //           // Maneja cualquier error que ocurra durante la solicitud HTTP
  //           console.error('Error al guardar la fase teórica:', error);
  //         }
  //       );
  //     }

  //   // Llama a tu servicio Angular para guardar los datos en el backend
  // }

  // Método para obtener las fases teóricas por ID de diseño curricular
  // traerFaseTeoricasPorIdDisenoCurricular(idDisenioCurricular: number): void {
  //   this.faseTeoricaService.findAllByDisenioCurricularId(idDisenioCurricular).subscribe(
  //     (fasesTeoricas: FaseTeorica[]) => {
  //       // Verificar si la lista de fases teóricas está vacía
  //       if (fasesTeoricas && fasesTeoricas.length > 0) {
  //         // La lista no está vacía, asignamos los resultados a la variable de componente
  //         this.fasesTeoricas = fasesTeoricas;
  //         // Imprimir las fases teóricas en la consola
  //         console.log('Fases Teóricas:', this.fasesTeoricas);
  //       } else {
  //         // La lista está vacía o es nula, puedes manejar esto según tus necesidades
  //         console.log('No se encontraron fases teóricas.');
  //         // Puedes asignar un valor por defecto o realizar otras acciones aquí
  //         // Por ejemplo:
  //          this.fasesTeoricas = []; // Asignar una lista vacía
  //         // O mostrar un mensaje al usuario
  //         // this.mostrarMensaje('No se encontraron fases teóricas.');
  //       }
  //     },
  //     (error) => {
  //       // Maneja cualquier error que ocurra durante la solicitud HTTP
  //       console.error('Error al obtener las fases teóricas:', error);
  //       // Puedes mostrar un mensaje de error al usuario si lo deseas
  //       // this.mostrarMensaje('Error al obtener las fases teóricas. Intente nuevamente más tarde.');
  //     }
  //   );
  // }
  // Cambiamos el nombre del método y lo modificamos para llenar tanto fasesTeoricas como fasesPracticas
  cargarFasesPorIdDisenoCurricular(idDisenioCurricular: number): void {
    this.faseTeoricaService.findAllByDisenioCurricularId(idDisenioCurricular).subscribe(
      (fasesTeoricas: FaseTeorica[]) => {
        // Verificar si la lista de fases teóricas está vacía
        if (fasesTeoricas && fasesTeoricas.length > 0) {
          // La lista no está vacía, asignamos los resultados a la variable de componente
          this.fasesTeoricas = fasesTeoricas;
          // Imprimir las fases teóricas en la consola
          console.log('Fases Teóricas:', this.fasesTeoricas);
        } else {
          // La lista está vacía o es nula, puedes manejar esto según tus necesidades
          console.log('No se encontraron fases teóricas.');
          // Puedes asignar un valor por defecto o realizar otras acciones aquí
          // Por ejemplo:
          this.fasesTeoricas = []; // Asignar una lista vacía
          // O mostrar un mensaje al usuario
          // this.mostrarMensaje('No se encontraron fases teóricas.');
        }
      },
      (error) => {
        // Maneja cualquier error que ocurra durante la solicitud HTTP
        console.error('Error al obtener las fases teóricas:', error);
        // Puedes mostrar un mensaje de error al usuario si lo deseas
        // this.mostrarMensaje('Error al obtener las fases teóricas. Intente nuevamente más tarde.');
      }
    );

    // Ahora cargamos las fases prácticas
    this.fasePracticaService.findAllByDisenioCurricularId(idDisenioCurricular).subscribe(
      (fasesPracticas: FasePractica[]) => {
        // Verificar si la lista de fases prácticas está vacía
        if (fasesPracticas && fasesPracticas.length > 0) {
          // La lista no está vacía, asignamos los resultados a la variable de componente
          this.fasesPracticas = fasesPracticas;
          // Imprimir las fases prácticas en la consola
          console.log('Fases Prácticas:', this.fasesPracticas);
        } else {
          // La lista está vacía o es nula, puedes manejar esto según tus necesidades
          console.log('No se encontraron fases prácticas.');
          // Puedes asignar un valor por defecto o realizar otras acciones aquí
          // Por ejemplo:
          this.fasesPracticas = []; // Asignar una lista vacía
          // O mostrar un mensaje al usuario
          // this.mostrarMensaje('No se encontraron fases prácticas.');
        }
      },
      (error) => {
        // Maneja cualquier error que ocurra durante la solicitud HTTP
        console.error('Error al obtener las fases prácticas:', error);
        // Puedes mostrar un mensaje de error al usuario si lo deseas
        // this.mostrarMensaje('Error al obtener las fases prácticas. Intente nuevamente más tarde.');
      }
    );
  }


  obtenerNombreFaseTeorico(instalacionId: number, recursoId: number): string {
    const faseEncontrada = this.fasesTeoricas.find(
      (fase) =>
        fase.instalacion?.idInstalacion === instalacionId &&
        fase.recurso?.idRecurso === recursoId
    );
    return faseEncontrada ? faseEncontrada.nombreFase || '' : '';
  }
  obtenerNombreFasePractico(instalacionId: number, recursoId: number): string {
    const faseEncontrada = this.fasesPracticas.find(
      (fase) =>
        fase.instalacion?.idInstalacion === instalacionId &&
        fase.recurso?.idRecurso === recursoId
    );
    return faseEncontrada ? faseEncontrada.nombreFase || '' : '';
  }





  crearfasesteorica() {


    //let idFaseTeorica = 1;
    // const faseTeoricas: FaseTeorica[] = [];
    const fasePracticas: FasePractica[] = [];

    // Recopila los datos de las fases teóricas
    const nombresFasesTeoricas = [
      'faseTeorica_1_1',
      'faseTeorica_1_2',
      'faseTeorica_1_3',
      'faseTeorica_2_4',
      'faseTeorica_2_2',
      'faseTeorica_2_3'
    ];

    for (const nombreTextarea of nombresFasesTeoricas) {
      const [idInstalacion, idRecurso] = nombreTextarea.split('_').slice(1).map(Number);
      const textarea = <HTMLTextAreaElement>document.querySelector(`textarea[name="${nombreTextarea}"]`);
      // const valorTextarea = textarea.value;
      // const valorTextarea = textarea ? textarea.value : ''; 
      // Verifica si se encontró el textarea y si tiene un valor
      if (textarea) {


        const valorTextarea = textarea.value;

        const faseTeorica = new FaseTeorica();
        faseTeorica.nombreFase = valorTextarea;
        faseTeorica.estado = true;

        const instalacion = new Instalacion();
        const recurso = new Recurso();
        const disenioCurricular = new DisenioCurriculares();
        disenioCurricular.idDisenioCurricular = this.idDelDisenio;

        instalacion.idInstalacion = idInstalacion;
        recurso.idRecurso = idRecurso;

        faseTeorica.instalacion = instalacion;
        faseTeorica.recurso = recurso;
        faseTeorica.disenioCurricular = disenioCurricular;

        console.log('idistalacion +++++++++++++++' + idInstalacion + '       idrecurso ++++++++++++++++++++=++' + idRecurso)
        console.log('nombreFase: ' + faseTeorica.nombreFase);
        this.fasesTeoricas.push(faseTeorica);
      } else {
        console.error(`No se encontró el textarea para ${nombreTextarea}`);
      }


    }






  }

  crearfasesPractica() {




    //  Recopila los datos de las fases prácticas
    const nombresFasesPracticas = [
      'fasePractica_1_1',
      'fasePractica_1_2',
      'fasePractica_1_3',
      'fasePractica_2_4',
      'fasePractica_2_2',
      'fasePractica_2_3'
    ];

    for (const nombreTextarea of nombresFasesPracticas) {
      // const textarea = (<HTMLTextAreaElement>document.querySelector(`textarea[name="${nombreTextarea}"]`));

      const [idInstalacion, idRecurso] = nombreTextarea.split('_').slice(1).map(Number);
      const textarea = <HTMLTextAreaElement>document.querySelector(`textarea[name="${nombreTextarea}"]`);


      if (textarea) {


        const valorTextarea = textarea.value;

        const fasePractica = new FaseTeorica();
        fasePractica.nombreFase = valorTextarea;
        fasePractica.estado = true;

        const instalacion = new Instalacion();
        const recurso = new Recurso();
        const disenioCurricular = new DisenioCurriculares();
        disenioCurricular.idDisenioCurricular = this.idDelDisenio;

        instalacion.idInstalacion = idInstalacion;
        recurso.idRecurso = idRecurso;

        fasePractica.instalacion = instalacion;
        fasePractica.recurso = recurso;
        fasePractica.disenioCurricular = disenioCurricular;

        console.log('idistalacion +++++++++++++++' + idInstalacion + '       idrecurso ++++++++++++++++++++=++' + idRecurso)
        console.log('nombreFase: ' + fasePractica.nombreFase);
        this.fasesPracticas.push(fasePractica);
      } else {
        console.error(`No se encontró el textarea para ${nombreTextarea}`);
      }

    }




  }



  guardarEntornoAprendizaje() {
    if (!this.fasesTeoricas || this.fasesTeoricas.length === 0) {
      // Si `this.fasesTeoricas` está vacía, crea las fases utilizando `crearfasesteorica`
      this.crearfasesteorica();
      // Llama al servicio para guardar las fases teóricas en el backend
      for (const faseTeorica of this.fasesTeoricas) {
        this.guardarFaseTeorica(faseTeorica);
      }

    } else {
      for (const faseTeorica of this.fasesTeoricas) {
        // Verifica si la fase teórica ya tiene un ID asignado
        if (faseTeorica.idFaseTeorica) {
          // Si ya tiene un ID, significa que existe y debes actualizarla

          // Encuentra el textarea correspondiente utilizando el nombre del textarea
          const nombreTextarea = `faseTeorica_${faseTeorica.instalacion?.idInstalacion}_${faseTeorica.recurso?.idRecurso}`;
          const textarea = <HTMLTextAreaElement>document.querySelector(`textarea[name="${nombreTextarea}"]`);

          // Verifica si se encontró el textarea
          if (textarea) {
            // Asigna el valor del textarea al objeto faseTeorica
            faseTeorica.nombreFase = textarea.value;

            // Llama a la función para actualizar la fase teórica
            this.actualizarFaseTeorica(faseTeorica);

          } else {
            console.error(`No se encontró el textarea para ${nombreTextarea}`);
          }
        } else {
          // Si la fase teórica no tiene un ID asignado, puedes manejarlo como quieras, ya sea ignorarla o mostrar un mensaje de error
        }
      }
      this.generarDisenioCurricular();

    }

    if (!this.fasesPracticas || this.fasesPracticas.length === 0) {
      // Si `this.fasesTeoricas` está vacía, crea las fases utilizando `crearfasesteorica`
      this.crearfasesPractica();
      // Llama al servicio para guardar las fases teóricas en el backend

      for (const fasePractica of this.fasesPracticas) {
        this.guardarFasePractica(fasePractica);
      }
    } else {

      for (const fasePractica of this.fasesPracticas) {
        // Verifica si la fase teórica ya tiene un ID asignado
        if (fasePractica.idFasePractica) {
          // Si ya tiene un ID, significa que existe y debes actualizarla

          // Encuentra el textarea correspondiente utilizando el nombre del textarea
          const nombreTextarea = `fasePractica_${fasePractica.instalacion?.idInstalacion}_${fasePractica.recurso?.idRecurso}`;
          const textarea = <HTMLTextAreaElement>document.querySelector(`textarea[name="${nombreTextarea}"]`);

          // Verifica si se encontró el textarea
          if (textarea) {
            // Asigna el valor del textarea al objeto fasep
            fasePractica.nombreFase = textarea.value;

            // Llama a la función para actualizar la fase 
            this.actualizarFasePractica(fasePractica);

          } else {
            console.error(`No se encontró el textarea para ${nombreTextarea}`);
          }
        } else {
          // Si la fase teórica no tiene un ID asignado, puedes manejarlo como quieras, ya sea ignorarla o mostrar un mensaje de error
        }
      }

    }


  }



  // Función para guardar una fase  en el backend
  guardarFaseTeorica(faseTeorica: FaseTeorica) {
    this.faseTeoricaService.save(faseTeorica).subscribe(
      (response) => {
        // Maneja la respuesta exitosa aquí si es necesario
        console.log('Fase teórica guardada con éxito: ', response);
      },
      (error) => {
        // Maneja cualquier error que ocurra durante la solicitud HTTP
        console.error('Error al guardar la fase teórica:', error);
      }
    );
    this.cargarFasesPorIdDisenoCurricular(this.idDelDisenio)
  }


  guardarFasePractica(fasePractica: FasePractica) {
    this.fasePracticaService.save(fasePractica).subscribe(
      (response) => {
        // Maneja la respuesta exitosa aquí si es necesario
        console.log('Fase Practica guardada con éxito: ', response);
      },
      (error) => {
        // Maneja cualquier error que ocurra durante la solicitud HTTP
        console.error('Error al guardar la fase Practica:', error);
      }
    );
    this.cargarFasesPorIdDisenoCurricular(this.idDelDisenio)
  }


  // Función para actualizar una fase teórica en el backend
  actualizarFaseTeorica(faseTeorica: FaseTeorica) {
    // Verifica si idFaseTeorica es un número válido antes de llamar a update
    if (typeof faseTeorica.idFaseTeorica === 'number') {
      this.faseTeoricaService.update(faseTeorica, faseTeorica.idFaseTeorica).subscribe(
        (response) => {
          // Maneja la respuesta exitosa aquí si es necesario
          console.log('Fase teórica actualizada con éxito xxxxxx:', response);
        },
        (error) => {
          // Maneja cualquier error que ocurra durante la solicitud HTTP
          console.error('Error al actualizar la fase teórica:', error);
        }
      );
      this.cargarFasesPorIdDisenoCurricular(this.idDelDisenio)
    } else {
      console.error('ID de fase teórica no válido:', faseTeorica.idFaseTeorica);
    }
  }

  actualizarFasePractica(fasePractica: FasePractica) {
    // Verifica si idFaseTeorica es un número válido antes de llamar a update
    if (typeof fasePractica.idFasePractica === 'number') {
      this.fasePracticaService.update(fasePractica, fasePractica.idFasePractica).subscribe(
        (response) => {
          // Maneja la respuesta exitosa aquí si es necesario
          console.log('Fase Practica actualizada con éxito xxxx xx:', response);
        },
        (error) => {

          console.error('Error al actualizar la fase Practica:', error);
        }
      );
      this.cargarFasesPorIdDisenoCurricular(this.idDelDisenio)
    } else {
      console.error('ID de fase practica no válido:', fasePractica.idFasePractica);
    }
  }


  public blockButtonCourse(): boolean {
    return this.silabo.curso!.estadoPublicasionCurso === 'F' || this.silabo.curso!.estadoPublicasionCurso === 'I';
  }

}


