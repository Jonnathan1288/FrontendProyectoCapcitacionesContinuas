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
    private actiRouter: ActivatedRoute,
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
          alert('Ya tiene disenio Curricular' + data)
          this.traerDatos(this.idSilaboCap);
        } else {
          alert(" no tien Disenio Curricular")
          this.obtenerDatosSilabo();
        }
      }
    )
  }
  /* TRAER DATOS DEL SILABO*/


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
      alert("Campos Vacios")
    } else {
      this.listEvaluacionDiagnosticaCurricular.push(this.evaluacionDiagnosticoCurricular);
      this.evaluacionDiagnosticoCurricular = new EvaluacionDiagnosticaCurriculares();
      this.evaluacionDiagnosticoCurricular.instrumnetoEvaluar = '';
      this.evaluacionDiagnosticoCurricular.tecnicaEvaluar = '';
    }
  }

  public quitarElementoEvaluacionD(indx: any): void {
    const index = this.listEvaluacionDiagnosticaCurricular.findIndex(
      (item) => item.tecnicaEvaluar === indx
    );
    if (index !== -1) {
      this.listEvaluacionDiagnosticaCurricular.splice(index, 1);
    }


    // this.listEvaluacionDiagnosticaCurricular.splice(index, 1);
  }

  /* FIN RESULTADOS Evaluacion Diagnostica */


  /* CREACION RESULTADOS EVALUACION FORMATIVA- ARRAY TEMPORAL*/
  listEvaluacionFormativaCurricular: EvalucionFormativaCurriculares[] = [];


  public almacenarListaEvaluacionFormativa(): void {
    if (!this.evaluacionFormativaCurricular.instrumnetoFormativa || !this.evaluacionFormativaCurricular.tecnicaFormativa) {
      alert("Campos Vacios")
    } else {
      this.listEvaluacionFormativaCurricular.push(this.evaluacionFormativaCurricular);
      this.evaluacionFormativaCurricular = new EvalucionFormativaCurriculares();
      this.evaluacionFormativaCurricular.instrumnetoFormativa = '';
      this.evaluacionFormativaCurricular.tecnicaFormativa = '';
    }
  }

  public quitarElementoEvaluacionFormativa(inde: any): void {
    // this.listEvaluacionFormativaCurricular.splice(index, 1);
    const index = this.listEvaluacionFormativaCurricular.findIndex(
      (item) => item.tecnicaFormativa === inde
    );
    if (index !== -1) {
      this.listEvaluacionFormativaCurricular.splice(index, 1);
    }
  }

  /* FIN RESULTADOS Evaluacion FORMATIVA */


  /* CREACION RESULTADOS EVALUACION FINAL- ARRAY TEMPORAL*/
  listEvaluacionFinalCurricular: EvaluacionFinalCurriculares[] = [];


  public almacenarListaEvaluacionF(): void {
    if (!this.evaluacionFinalCurricular.instrumnetoFormativaFinal || !this.evaluacionFinalCurricular.tecnicaFormativaFinal) {
      alert("Campos Vacios")
    } else {
      this.listEvaluacionFinalCurricular.push(this.evaluacionFinalCurricular);
      this.evaluacionFinalCurricular = new EvaluacionFinalCurriculares();
      this.evaluacionFinalCurricular.instrumnetoFormativaFinal = '';
      this.evaluacionFinalCurricular.tecnicaFormativaFinal = '';
    }
  }

  public quitarElementoEvaluacionF(inde: any): void {
    // this.listEvaluacionFinalCurricular.splice(index, 1);

    const index = this.listEvaluacionFinalCurricular.findIndex(
      (item) => item.tecnicaFormativaFinal === inde
    );
    if (index !== -1) {
      this.listEvaluacionFinalCurricular.splice(index, 1);
    }
  }

  /* FIN RESULTADOS Evaluacion FINAL */


  /* CREACION RESULTADOS ENTORNO APRENDIZAJE- ARRAY TEMPORAL*/
  listEntornoAprendizaje: EntornoAprendizajeCurricular[] = [];


  public almacenarEntornoAprendizaje(): void {
    if (!this.entornoAprendizajeCurricular.instalaciones || !this.entornoAprendizajeCurricular.faseTeorica
      || !this.entornoAprendizajeCurricular.fasePractica) {
      alert("Campos Vacios")
    } else {
      this.listEntornoAprendizaje.push(this.entornoAprendizajeCurricular);
      this.entornoAprendizajeCurricular = new EntornoAprendizajeCurricular();
      this.entornoAprendizajeCurricular.instalaciones = '';
      this.entornoAprendizajeCurricular.faseTeorica = '';
      this.entornoAprendizajeCurricular.fasePractica = '';
    }
  }

  public quitarEntornoAprendizaje(inde: any): void {
    // this.listEntornoAprendizaje.splice(index, 1);
    const index = this.listEntornoAprendizaje.findIndex(
      (item) => item.instalaciones === inde
    );
    if (index !== -1) {
      this.listEntornoAprendizaje.splice(index, 1);
    }
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
      alert('Guardado exitoso');

      /* */
      console.log("Disenio Curricular generado id->" + this.idDisenioCurricularCap)
    })
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
  
    this.disenioCurricularService.updateDisenioCurricular(this.idDelDisenio!, nuevoDisenioCurricular).subscribe(
      data => {
        console.log('idO-> '+data.idDisenioCurricular!)
        console.log('id-> '+this.idDelDisenio!)
        //ID DEL DISEÑO CURRICULAR DE OTRA PARTE QUE RECIBE DEL DEÑO MAS NO DEL ID DEL SILABO
        this.traerDatos(this.idSilaboCap!);
        console.log("Se actualizó el Diseño Curricular");
      }
    );
  }
  
  

  public actualizarEntornoAprendizaje(): void {
    if (this.opcionCapEntornoAprendizaje == "C") {
      this.entornoAprendizajeCurricular.disenioCurricular = this.disenioCurricular;
      this.entornoAprendizajeCurricular.estadoEntornoAprendizaje = true;
      this.entornoAprendizajeService.saveEntornoAprendizajeCurricular(this.entornoAprendizajeCurricular).subscribe(
        dataTwo => {
          this.traerDatosEntornoAprendizajeFull(this.idDelDisenio!);
          console.log("Se creo uno nuevo EA")
        }
      )
    } else {
      this.entornoAprendizajeService.updateEntornoAprendizajeCurricular(this.idCapModelEdit!, this.entornoAprendizajeCurricular).subscribe(
        dataTwo => {
          this.traerDatosEntornoAprendizajeFull(this.idDelDisenio!);
          console.log("Se actualizo EA")
        }
      )
    }
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
    if (this.opcionElegida == "C") {
      this.evaluacionDiagnosticoCurricular.disenioCurricular = this.disenioCurricular;
      this.evaluacionDiagnosticoCurricular.estadoEvaluacionDiagnostica = true;
      this.evaluacionDiagnosticoCurricularService.saveEvaluacionDiagnosticoCurricular(this.evaluacionDiagnosticoCurricular).subscribe(
        dataTwo => {
          this.traerDatosEvaluacionDiagnosticaFull(this.idDelDisenio!);
          console.log("Se creo uno nuevo ED")
        }
      )
    } else {
      this.evaluacionDiagnosticoCurricularService.updateEvaluacionDiagnosticaCurricular(this.idCapModelEditEvaluacionDiagnostica!, this.evaluacionDiagnosticoCurricular).subscribe(
        dataTwo => {
          this.traerDatosEvaluacionDiagnosticaFull(this.idDelDisenio!);
          console.log("Se actualizo ED")
        }
      )
    }
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
    if (this.opcionElegidaEvaluacionFormativa == "C") {
      this.evaluacionFormativaCurricular.disenioCurricular = this.disenioCurricular;
      this.evaluacionFormativaCurricular.estadoEvaluacionFormativa = true;
      this.evaluacionFormativaCurricularService.saveEvaluacionFormativaCurricular(this.evaluacionFormativaCurricular).subscribe(
        dataTwo => {
          this.traerDatosEvaluacionFormativaFull(this.idDelDisenio!);
          console.log("Se creo uno nuevo EFC")
        }
      )
    } else {
      this.evaluacionFormativaCurricularService.updateEvaluacionFormativaCurricular(this.idCapModelEditEvaluacionFormativa!, this.evaluacionFormativaCurricular).subscribe(
        dataTwo => {
          this.traerDatosEvaluacionFormativaFull(this.idDelDisenio!);
          console.log("Se actualizo EFC")
        }
      )
    }
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
    if (this.opcionElegidaEvaluacionFinal == "C") {
      this.evaluacionFinalCurricular.disenioCurricular = this.disenioCurricular;
      this.evaluacionFinalCurricular.estadoEvaluacionFinal = true;
      this.evaluacionFinalCurricularService.saveEvaluacionFinalCurricular(this.evaluacionFinalCurricular).subscribe(
        dataTwo => {
          this.traerDatosEvaluacionFinalFull(this.idDelDisenio!);
          console.log("Se creo uno nuevo EFINAL")
        }
      )
    } else {
      this.evaluacionFinalCurricularService.updateEvaluacionFinalCurricular(this.idCapModelEditEvaluacionFinal!, this.evaluacionFinalCurricular).subscribe(
        dataTwo => {
          this.traerDatosEvaluacionFinalFull(this.idDelDisenio!);
          console.log("Se actualizo EFINAL")
        }
      )
    }
  }

  // FIN

  // FIN //
  public actualizarSilabo(): void {

  }
  // FIN //

  /* METODOS DE LIMPIAR */


  /* */

}