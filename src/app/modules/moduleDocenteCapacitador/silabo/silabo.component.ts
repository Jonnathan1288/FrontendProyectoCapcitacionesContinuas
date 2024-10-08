import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Contenidosilabos } from 'src/app/models/contenidosilabos';
import { Curso } from 'src/app/models/curso';
import { EstrategiasMetodologica } from 'src/app/models/estrategias-metodologica';
import { MaterialAudiovisuales } from 'src/app/models/material-audiovisuales';
import { MaterialConvencionales } from 'src/app/models/material-convencionales';
import { PrerequisitoCurso } from 'src/app/models/prerequisito-curso';
import { ResultadoAprendizajeSilabo } from 'src/app/models/resultado-aprendizaje-silabo';
import { Silabo } from 'src/app/models/silabo';
import { ContenidoSilaboService } from 'src/app/service/contenido-silabo.service';
import { CursoService } from 'src/app/service/curso.service';
import { EstrategiaMetodologicaService } from 'src/app/service/estrategia-metodologica.service';
import { MaterialAudiovisualService } from 'src/app/service/material-audiovisual.service';
import { MaterialConvencionalService } from 'src/app/service/material-convencional.service';
import { PrerrequisitosCursoService } from 'src/app/service/prerrequisitosCurso.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import { ResultadoAprendizajeSilaboService } from 'src/app/service/resultado-aprendizaje-silabo.service';
import { SilaboService } from 'src/app/service/silabo.service';

@Component({
  selector: 'app-silabo',
  templateUrl: './silabo.component.html',
  styleUrls: ['./silabo.component.css']
})
export class SilaboComponent implements OnInit {

  constructor(
    private router: Router,
    private silaboService: SilaboService,
    private cursoService: CursoService,
    private estrategiasMetodologicasService: EstrategiaMetodologicaService,
    private materialesAudivisualesSilaboService: MaterialAudiovisualService,
    private materialesConvencianalesService: MaterialConvencionalService,
    private resultadosAprendizajeService: ResultadoAprendizajeSilaboService,
    private contenidoSilaboService: ContenidoSilaboService,
    private prerrequitsitoCursoService: PrerrequisitosCursoService,
    private reportService: ReportsCapacitacionesService,
    private actiRouter: ActivatedRoute,
    private toastrService: ToastrService
  ) {
  }

  /* ENTIDADES UTILIZAR*/
  curso: Curso = new Curso();
  silabo: Silabo = new Silabo();
  estrategiasMetodologicas: EstrategiasMetodologica = new EstrategiasMetodologica();
  materialesAudiovisuales: MaterialAudiovisuales = new MaterialAudiovisuales();
  materialesConvecionales: MaterialConvencionales = new MaterialConvencionales();
  resultadoAprendizajeSilabo: ResultadoAprendizajeSilabo = new ResultadoAprendizajeSilabo();
  contenidosSilabo: Contenidosilabos = new Contenidosilabos();
  prerrequisitosCurso: PrerequisitoCurso = new PrerequisitoCurso();

  ngOnInit() {
    this.actiRouter.params.subscribe((params) => {
      const id_curso = params['id'];
      this.idCursoCap = id_curso;
      // this.obtenerDatosCurso();
      this.validacionDeSilaboExistente();
    });
  }

  //IMPLEMENTACION DEL ROUTENIG PARA EL DISEÑO CURRICULAR
  verDisenioCurricular(){
    this.router.navigate(['/diseño', this.idDelSilabo!]);
  }

  validacionDeSilaboExistente():void{
    this.silaboService.getsilabooValidacion(this.idCursoCap).subscribe(
      data =>{
        if (data === true) {
          this.toastrService.success('Datos recuperados!.');
            // alert('Ya tiene silabo' + data)
            this.traerDatos(this.idCursoCap);
        } else {
          this.toastrService.info('Listo para crear silabo!.');
          // alert(" no tien silabo")
          this.obtenerDatosCurso();
        }
      }
    )
  }

  /* TRAER DATOS DEL CURSO*/
  idCursoCap?: any;
  //CapIdCursoSend?: number;

  public obtenerDatosCurso(): void {
    if (this.idCursoCap != null && this.idCursoCap != undefined) {
      this.cursoService.getCursoById(this.idCursoCap).subscribe((data) => {
        this.curso = data;
        // this.CapIdCursoSend = this.curso.idCurso;
        this.obtenerPrerrequisistos( this.curso.idCurso!);
      })
    } else {
      console.log("Curso not found =(")
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

  /* CREACION RESULTADOS APRENDIZAJE - ARRAY TEMPORAL*/
  listResultadosAprendizajes: ResultadoAprendizajeSilabo[] = [];
  public almacenarLista(): void {
    if (!this.resultadoAprendizajeSilabo.temaUnidadSilabo || !this.resultadoAprendizajeSilabo.elementosCompetenciaSilabo ||
      !this.resultadoAprendizajeSilabo.activadesResultadoAprendizaje || !this.resultadoAprendizajeSilabo.formaEvidenciar) {
      this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
    } else {
      this.resultadoAprendizajeSilabo.estadoUnidadActivo = true;
      this.listResultadosAprendizajes.push(this.resultadoAprendizajeSilabo);
      this.toastrService.success('Se añadio correctamente', 'Registro Exitoso');
      this.limpiarResultadoAprendizaje();
    }
  }

  public quitarElemento(temaUnidadSilabo: any): void {
    const index = this.listResultadosAprendizajes.findIndex(item => item.temaUnidadSilabo === temaUnidadSilabo);
    if (index !== -1) {
      this.listResultadosAprendizajes.splice(index, 1);
      this.toastrService.error('Datos eliminados', 'Eliminado');
    }
  }

  limpiarResultadoAprendizaje(){
    this.resultadoAprendizajeSilabo = new ResultadoAprendizajeSilabo();
    this.resultadoAprendizajeSilabo.temaUnidadSilabo = '';
    this.resultadoAprendizajeSilabo.elementosCompetenciaSilabo = '';
    this.resultadoAprendizajeSilabo.activadesResultadoAprendizaje = '';
    this.resultadoAprendizajeSilabo.formaEvidenciar = '';
    this.resultadoAprendizajeSilabo.descripcionUnidadSilabo = '';
  }
  /* FIN RESULTADOS APRENDIZAJE */

  /* CREACION CONTENIDOS - ARRAY TEMPORAL*/
  listContenidosSilabo: Contenidosilabos[] = [];
  public almacenarListaContenidos(): void {
    if (!this.contenidosSilabo.temaContenido || !this.contenidosSilabo.horasAutonomas || !this.contenidosSilabo.diaContenido ||
      !this.contenidosSilabo.actividadesPracticas || !this.contenidosSilabo.actividadesAutonomas || !this.contenidosSilabo.actividadesDocencia || !this.contenidosSilabo.horasPracticas || !this.contenidosSilabo.horasClaseContenido) {
        this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
    } else {
      this.listContenidosSilabo.push(this.contenidosSilabo);
      this.toastrService.success('Se añadio correctamente', 'Registro Exitoso');
      this.contenidosSilabo = new Contenidosilabos();
      this.contenidosSilabo.temaContenido = '';
      this.contenidosSilabo.horasPracticas = 0;
      this.contenidosSilabo.horasClaseContenido = 0;
      this.contenidosSilabo.horasAutonomas = 0;
    }
  }

  public quitarElementoContenido(temaContenido: any): void {
    const index = this.listContenidosSilabo.findIndex(item => item.temaContenido === temaContenido);
    if (index !== -1) {
      this.listContenidosSilabo.splice(index, 1);
      this.toastrService.error('Datos eliminados', 'Eliminado');
    }
  }
  /* FIN CONTENIDOS */

  /* */
  listEstrategiasMetodologica: EstrategiasMetodologica[] = [];

  public almacenarListaEstrategias(): void {
    if (!this.estrategiasMetodologicas.nombreEstrategiaMetodologica || !this.estrategiasMetodologicas.finalidadEstrategiaMetodologica) {
      this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
    } else {
      this.listEstrategiasMetodologica.push(this.estrategiasMetodologicas);
      this.toastrService.success('Se añadio correctamente', 'Registro Exitoso');
      this.limpiarEstrategias();
    }
  }

  public quitarElementoEstrategias(nombreEstrategiaMetodologica: any): void {
    const index = this.listEstrategiasMetodologica.findIndex(item => item.nombreEstrategiaMetodologica === nombreEstrategiaMetodologica);
    if (index !== -1) {
      this.listEstrategiasMetodologica.splice(index, 1);
      this.toastrService.error('Datos eliminados', 'Eliminado');
    }
  }

  limpiarEstrategias(){
    this.estrategiasMetodologicas = new EstrategiasMetodologica();
    this.estrategiasMetodologicas.nombreEstrategiaMetodologica = '';
    this.estrategiasMetodologicas.finalidadEstrategiaMetodologica = '';
  }
  /* */

  /* */
  listMaterialConvencionales: MaterialConvencionales[] = [];

  public almacenarListaMaterialConvencionales(): void {
    if (!this.materialesConvecionales.descripcionMaterialConvencional) {
      this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
    } else {
      this.listMaterialConvencionales.push(this.materialesConvecionales);
      this.toastrService.success('Se añadio correctamente', 'Registro Exitoso');
      this.limpiarMaterialezConvencionales();
    }
  }

  public quitarElementoMateriales(descripcionMaterialConvencional: any): void {
    const index = this.listMaterialConvencionales.findIndex(item => item.descripcionMaterialConvencional === descripcionMaterialConvencional);
    if (index !== -1) {
      this.listMaterialConvencionales.splice(index, 1);
      this.toastrService.error('Datos eliminados', 'Eliminado');
    }
  }

  limpiarMaterialezConvencionales(){
    this.materialesConvecionales = new MaterialConvencionales();
    this.materialesConvecionales.descripcionMaterialConvencional = '';
  }
  /* */

  /* */
  listCMaterialAudiovisuales: MaterialAudiovisuales[] = [];

  public almacenarListaMaterialAudiovisualess(): void {
    if (!this.materialesAudiovisuales.descripcionMaterialAudiovisual) {
      this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
    } else {
      this.listCMaterialAudiovisuales.push(this.materialesAudiovisuales);
      this.toastrService.success('Se añadio correctamente', 'Registro Exitoso');
      this.limpiarMaterialesAudivisuales();
    }
  }

  public quitarElementoConvencional(descripcionMaterialAudiovisual: any): void {
    const index = this.listCMaterialAudiovisuales.findIndex(item => item.descripcionMaterialAudiovisual === descripcionMaterialAudiovisual);
    if (index !== -1) {
      this.listCMaterialAudiovisuales.splice(index, 1);
      this.toastrService.error('Datos eliminados', 'Eliminado');
    }
  }

  limpiarMaterialesAudivisuales(){
    this.materialesAudiovisuales = new MaterialAudiovisuales();
    this.materialesAudiovisuales.descripcionMaterialAudiovisual = '';
  }
  /* */

  /* METODO POST */
  idSilaboCap!: any;
  public generarSilabo(): void {
    if (this.listResultadosAprendizajes.length == 0) {
      this.toastrService.error('Agregue al menos un resultado', 'Resultados de Aprendizaje!');
    } else {
      if (this.listContenidosSilabo.length  == 0) {
        this.toastrService.error('Agregue al menos un contenido', 'Contenidos Silabo!');
      } else {
        if (this.listEstrategiasMetodologica.length  == 0) {
          this.toastrService.error('Agregue al menos una estrategia', 'Estrategias Metodológicas!');
        } else {
          if (!this.silabo.campoAprovadoPor || !this.silabo.campoRevisadoPor || !this.silabo.campoFormacion) {
            this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
          } else {
            this.silabo.curso = this.curso;
            this.silaboService.saveSilabo(this.silabo).subscribe(
              silaboData => {
                this.silabo = silaboData;
                this.idSilaboCap = this.silabo.idSilabo;
                console.log("Data + " + this.idSilaboCap)
                /* TABLAS */
                this.generarResultadosAprendizaje();
                this.generarContenidos();
                this.generarEstetegiasMetodologicas();
                this.generarMaterialesAudivisuales();
                this.generarMaterialesConvecionales();
                /* */
                console.log("Silabo generado id->" + this.idSilaboCap);
                this.toastrService.success('Silabo Registrado Correctamente', 'Registro Exitoso');
                this.reportService.gedownloadSilabo(this.silabo.idSilabo!)
                .subscribe((r) => {
                  const url = URL.createObjectURL(r);
                  window.open(url, '_blank');
                });

                setTimeout(() => {
                  location.reload();
                }, 1200);
            })
          }
        }
      }
    }
  }
  /* */

  /* ENTIDADES SEGUIDAS DEL SILABO */
  public generarResultadosAprendizaje(): void {
    for (let resultado of this.listResultadosAprendizajes) {
      resultado.silabo = this.silabo;
      resultado.estadoUnidadActivo = true;
      this.resultadosAprendizajeService.saveResultadosArendizaje(resultado).subscribe(data => {
        console.log("Se creo el resultados =)");
      });
    }
  }

  public generarContenidos(): void {
    for (let contenidos of this.listContenidosSilabo) {
      contenidos.silabo = this.silabo;
      contenidos.estadoContenido = true;
      this.contenidoSilaboService.saveContenidosilabos(contenidos).subscribe(data => {
        console.log("Se creo =)");
      });
    }
  }

  public generarMaterialesConvecionales(): void {
    for (let convencionales of this.listMaterialConvencionales) {
      convencionales.silabo = this.silabo;
      convencionales.estadoMaterialConvencional = true;
      this.materialesConvencianalesService.saveMaterialConvencional(convencionales).subscribe(data => {
        console.log("Se creo =)");
      });
    }
  }

  public generarMaterialesAudivisuales(): void {
    for (let audiovisuales of this.listCMaterialAudiovisuales) {
      audiovisuales.silabo = this.silabo;
      audiovisuales.estadoMaterialAudiovisual = true;
      this.materialesAudivisualesSilaboService.saveMaterialAudiovisuales(audiovisuales).subscribe(data => {
        console.log("Se creo =)");
      });
    }
  }

  public generarEstetegiasMetodologicas(): void {
    for (let estrategias of this.listEstrategiasMetodologica) {
      estrategias.silabo = this.silabo;
      estrategias.estadoEstrategiaMetodologicaActivo = true;
      this.estrategiasMetodologicasService.saveEstrategiasMetodologica(estrategias).subscribe(data => {
        console.log("Se creo =)");
      });
    }
  }
  /* */

  // EL TRAER DATOS *****************************************************************************************************************************************************

  validarIdSilabo: Boolean = false;
  idDelSilabo: any;
  public traerDatos(idCurso:number): void {
    this.silaboService.getSilaboByIdPorCurso(idCurso).subscribe(
      data =>{
          this.silabo = data;
          this.idDelSilabo = this.silabo.idSilabo;
          console.log("id del sialbo nuevo -> " + this.idDelSilabo)
          this.traerDatosEstretegiasFull(this.idDelSilabo!);
          this.traerDatosContenidosFull(this.idDelSilabo!);
          this.traerDatosEstrategiasFull(this.idDelSilabo!);
          this.traerDatosMaudiovisualesFull(this.idDelSilabo!);
          this.traerDatosMconvencionalesFull(this.idDelSilabo!);
          this.validarIdSilabo = true;
      }
    )
  }


  public actualizarSilabo(): void {
    if (this.contadorValidasUnoG == 0) {
      this.toastrService.error('Active al menos un resultado', 'Resultados de Aprendizaje!');
    } else {
      if (this.contadorValidasDosG == 0) {
        this.toastrService.error('Active al menos un contenido', 'Contenidos Silabo!');
      } else {
        if (this.contadorValidasTresG == 0) {
          this.toastrService.error('Active al menos una estrategia', 'Estrategias Metodológicas!');
        } else {
          if (!this.silabo.campoAprovadoPor || !this.silabo.campoRevisadoPor || !this.silabo.campoFormacion) {
            this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
          } else {
              this.silaboService.saveSilabo(this.silabo).subscribe(
              silaboData => {
                this.silabo = silaboData;
                this.toastrService.success('Silabo actualizado correctamente', 'Actualización Exitosa');
                setTimeout(() => {
                  location.reload();
                }, 1200);
            })
          }
        }
      }
    }
  }

  // TRAER TODOS LOS DATOS DEL SILABO
  contadorValidasUnoG:number = 0;
  public traerDatosEstretegiasFull(idSilabo: number): void {
    this.resultadosAprendizajeService.getResultadosPorIdSilabo(idSilabo).subscribe(
      data => {
        let contadorValidasUno = 0;
        this.listResultadosAprendizajes = data.map(
          dataTwo => {
            let resultadoAprendizajeSilabo = new ResultadoAprendizajeSilabo();
            resultadoAprendizajeSilabo.idResultadoAprendizajeSilabo = dataTwo.idResultadoAprendizajeSilabo;
            resultadoAprendizajeSilabo.temaUnidadSilabo = dataTwo.temaUnidadSilabo;
            resultadoAprendizajeSilabo.elementosCompetenciaSilabo = dataTwo.elementosCompetenciaSilabo;
            resultadoAprendizajeSilabo.activadesResultadoAprendizaje = dataTwo.activadesResultadoAprendizaje;
            resultadoAprendizajeSilabo.formaEvidenciar = dataTwo.formaEvidenciar;
            resultadoAprendizajeSilabo.descripcionUnidadSilabo = dataTwo.descripcionUnidadSilabo;
            resultadoAprendizajeSilabo.estadoUnidadActivo = dataTwo.estadoUnidadActivo;
            // VALIDAR QUE TENGA AL MENOS UNO ACTIVO EN LA TABLA
            if (resultadoAprendizajeSilabo.estadoUnidadActivo === true) {
                contadorValidasUno ++;
            }
            return resultadoAprendizajeSilabo;
          }
        )
        this.contadorValidasUnoG = contadorValidasUno;
        console.log("Numero de activos public ->" + this.contadorValidasUnoG);
      }
    )
  }

  contadorValidasDosG:number = 0;
  public traerDatosContenidosFull(idSilabo: number): void {
    this.contenidoSilaboService.getContenidoSilaboPorIdSilabo(idSilabo).subscribe(
      data => {
        let contadorValidasDos = 0;
        this.listContenidosSilabo = data.map(
          dataTwo => {
            let contenidosilabo = new Contenidosilabos();
            contenidosilabo.idContenidoSilabo = dataTwo.idContenidoSilabo;
            contenidosilabo.temaContenido = dataTwo.temaContenido;
            contenidosilabo.diaContenido = dataTwo.diaContenido;
            contenidosilabo.horasClaseContenido = dataTwo.horasClaseContenido;
            contenidosilabo.actividadesDocencia = dataTwo.actividadesDocencia;
            contenidosilabo.horasPracticas = dataTwo.horasPracticas;
            contenidosilabo.actividadesPracticas = dataTwo.actividadesPracticas;
            contenidosilabo.horasAutonomas = dataTwo.horasAutonomas;
            contenidosilabo.actividadesAutonomas = dataTwo.actividadesAutonomas;
            contenidosilabo.observaciones = dataTwo.observaciones;
            contenidosilabo.estadoContenido = dataTwo.estadoContenido;
            // VALIDAR QUE TENGA AL MENOS UNO ACTIVO EN LA TABLA
            if (contenidosilabo.estadoContenido === true) {
              contadorValidasDos ++;
            }
            return contenidosilabo;
          }
        )
        this.contadorValidasDosG = contadorValidasDos;
        console.log("Numero de activos contenidos public ->" + this.contadorValidasDosG);
      }
    )
  }

  contadorValidasTresG:number = 0;
  public traerDatosEstrategiasFull(idSilabo: number): void {
    this.estrategiasMetodologicasService.getEstrategiasMetodologicaPorIdSilabo(idSilabo).subscribe(
      data => {
        let contadorValidasTres = 0;
        this.listEstrategiasMetodologica = data.map(
          dataTwo => {
            let estrategiaMetodologica = new EstrategiasMetodologica();
            estrategiaMetodologica.idEstrategiaMetodologica = dataTwo.idEstrategiaMetodologica;
            estrategiaMetodologica.nombreEstrategiaMetodologica = dataTwo.nombreEstrategiaMetodologica;
            estrategiaMetodologica.finalidadEstrategiaMetodologica = dataTwo.finalidadEstrategiaMetodologica;
            estrategiaMetodologica.estadoEstrategiaMetodologicaActivo = dataTwo.estadoEstrategiaMetodologicaActivo;
            // VALIDAR QUE TENGA AL MENOS UNO ACTIVO EN LA TABLA
            if (estrategiaMetodologica.estadoEstrategiaMetodologicaActivo === true) {
              contadorValidasTres ++;
            }
            return estrategiaMetodologica;
          }
        )
        this.contadorValidasTresG = contadorValidasTres;
        console.log("Numero de activos estrategias public ->" + this.contadorValidasTresG);
      }
    )
  }

  public traerDatosMaudiovisualesFull(idSilabo: number): void {
    this.materialesAudivisualesSilaboService.getMaterialAudiovisualesPorIdSilabo(idSilabo).subscribe(
      data => {
        this.listCMaterialAudiovisuales = data.map(
          dataTwo => {
            let materialAudiovisual = new MaterialAudiovisuales();
            materialAudiovisual.idMaterialAudiovisual = dataTwo.idMaterialAudiovisual;
            materialAudiovisual.descripcionMaterialAudiovisual = dataTwo.descripcionMaterialAudiovisual;
            materialAudiovisual.estadoMaterialAudiovisual = dataTwo.estadoMaterialAudiovisual;
            return materialAudiovisual;
          }
        )
      }
    )
  }

  public traerDatosMconvencionalesFull(idSilabo: number): void {
    this.materialesConvencianalesService.getMaterialConvencionalesPorIdSilabo(idSilabo).subscribe(
      data => {
        this.listMaterialConvencionales = data.map(
          dataTwo => {
            let materialConvencional = new MaterialConvencionales();
            materialConvencional.idMaterialConvencional = dataTwo.idMaterialConvencional;
            materialConvencional.descripcionMaterialConvencional = dataTwo.descripcionMaterialConvencional;
            materialConvencional.estadoMaterialConvencional = dataTwo.estadoMaterialConvencional;
            return materialConvencional;
          }
        )
      }
    )
  }
  // FIN

  // METODO ESTADOS TABLES//
  public cambiarEstadoResultadosAprensizajeFalse(idResultadoAprendizajeSilabo: number): void {
    this.resultadosAprendizajeService.getResultadosArendizajeById(idResultadoAprendizajeSilabo).subscribe(
      data => {
        this.resultadoAprendizajeSilabo = data;
        this.resultadoAprendizajeSilabo.estadoUnidadActivo = false;
        this.resultadosAprendizajeService.cambiarEstadosResultadosSilaboId(idResultadoAprendizajeSilabo, this.resultadoAprendizajeSilabo).subscribe(
          dataTwo => {
            this.traerDatosEstretegiasFull(this.idDelSilabo!);
            console.log("Se actualizo")
          }
        )
      }
    )

  }

  public cambiarEstadoResultadosAprensizajeTrue(idResultadoAprendizajeSilabo: number): void {
    this.resultadosAprendizajeService.getResultadosArendizajeById(idResultadoAprendizajeSilabo).subscribe(
      data => {
        this.resultadoAprendizajeSilabo = data;
        this.resultadoAprendizajeSilabo.estadoUnidadActivo = true;
        this.resultadosAprendizajeService.cambiarEstadosResultadosSilaboId(idResultadoAprendizajeSilabo, this.resultadoAprendizajeSilabo).subscribe(
          dataTwo => {
            this.traerDatosEstretegiasFull(this.idDelSilabo!);
            console.log("Se actualizo")
          }
        )
      }
    )

  }

  // CONTENIDOS
  public cambiarEstadosContenidosTrue(idContenidoSilabo: number):void{
    this.contenidoSilaboService.getContenidosilabosById(idContenidoSilabo).subscribe(
      data=>{
        this.contenidosSilabo = data;
        this.contenidosSilabo.estadoContenido = true;
        this.contenidoSilaboService.updateContenidoSilabo(idContenidoSilabo,this.contenidosSilabo).subscribe(
          data=>{
            this.traerDatosContenidosFull(this.idDelSilabo!);
            console.log("cambio")
          }
        )
      }
    )
  }

  public cambiarEstadosContenidosFalse(idContenidoSilabo: number):void{
    this.contenidoSilaboService.getContenidosilabosById(idContenidoSilabo).subscribe(
      data=>{
        this.contenidosSilabo = data;
        this.contenidosSilabo.estadoContenido = false;
        this.contenidoSilaboService.updateContenidoSilabo(idContenidoSilabo,this.contenidosSilabo).subscribe(
          data=>{
            this.traerDatosContenidosFull(this.idDelSilabo!);
            console.log("cambio")
          }
        )
      }
    )
  }
  // FIN CONTENIDOS

  // ESTRATEGIAS
  public cambiarEstadosEstrategiasTrue(idEstrategiaMetodologica: number):void{
    this.estrategiasMetodologicasService.getEstrategiasMetodologicaById(idEstrategiaMetodologica).subscribe(
      data=>{
        this.estrategiasMetodologicas = data;
        this.estrategiasMetodologicas.estadoEstrategiaMetodologicaActivo = true;
        this.estrategiasMetodologicasService.updateEstrategiasSilabo(idEstrategiaMetodologica,this.estrategiasMetodologicas).subscribe(
          data=>{
            this.traerDatosEstrategiasFull(this.idDelSilabo!);
            console.log("cambio")
          }
        )
      }
    )
  }

  public cambiarEstadosEstrategiasFalse(idEstrategiaMetodologica: number):void{
    this.estrategiasMetodologicasService.getEstrategiasMetodologicaById(idEstrategiaMetodologica).subscribe(
      data=>{
        this.estrategiasMetodologicas = data;
        this.estrategiasMetodologicas.estadoEstrategiaMetodologicaActivo = false;
        this.estrategiasMetodologicasService.updateEstrategiasSilabo(idEstrategiaMetodologica,this.estrategiasMetodologicas).subscribe(
          data=>{
            this.traerDatosEstrategiasFull(this.idDelSilabo!);
            console.log("cambio")
          }
        )
      }
    )
  }
  // FIN ESTRATEGIAS

  // CONVECIONLAES
    public cambiarEstadosConvencionalTrue(idMaterialConvencional: any):void{
      this.materialesConvencianalesService.getMaterialConvencionaleById(idMaterialConvencional).subscribe(
        data=>{
          this.materialesConvecionales = data;
          this.materialesConvecionales.estadoMaterialConvencional = true;
          this.materialesConvencianalesService.updateMaterialConvencionales(idMaterialConvencional,this.materialesConvecionales).subscribe(
            data=>{
              this.traerDatosMconvencionalesFull(this.idDelSilabo!);
              console.log("cambio")
            }
          )
        }
      )
    }
  
    public cambiarEstadosConvencionalFalse(idMaterialConvencional: any):void{
      this.materialesConvencianalesService.getMaterialConvencionaleById(idMaterialConvencional).subscribe(
        data=>{
          this.materialesConvecionales = data;
          this.materialesConvecionales.estadoMaterialConvencional = false;
          this.materialesConvencianalesService.updateMaterialConvencionales(idMaterialConvencional,this.materialesConvecionales).subscribe(
            data=>{
              this.traerDatosMconvencionalesFull(this.idDelSilabo!);
              console.log("cambio")
            }
          )
        }
      )
    }
  // FIN CONVECIONLAES

  // AUDIVISUALES
  public cambiarEstadosAudiovisualesTrue(idMaterialAudiovisual: any):void{
    this.materialesAudivisualesSilaboService.getMaterialAudiovisualesById(idMaterialAudiovisual).subscribe(
      data=>{
        this.materialesAudiovisuales = data;
        this.materialesAudiovisuales.estadoMaterialAudiovisual = true;
        this.materialesAudivisualesSilaboService.updateEstadosMaterialAudio(idMaterialAudiovisual,this.materialesAudiovisuales).subscribe(
          data=>{
            this.traerDatosMaudiovisualesFull(this.idDelSilabo!);
            console.log("cambio")
          }
        )
      }
    )
  }

  public cambiarEstadosAudiovisualesFalse(idMaterialAudiovisual: any):void{
    this.materialesAudivisualesSilaboService.getMaterialAudiovisualesById(idMaterialAudiovisual).subscribe(
      data=>{
        this.materialesAudiovisuales = data;
        this.materialesAudiovisuales.estadoMaterialAudiovisual = false;
        this.materialesAudivisualesSilaboService.updateEstadosMaterialAudio(idMaterialAudiovisual,this.materialesAudiovisuales).subscribe(
          data=>{
            this.traerDatosMaudiovisualesFull(this.idDelSilabo!);
            console.log("cambio")
          }
        )
      }
    )
  }
  // FIN AUDIVISUALES

// FIN ACTUALIZADOS ********************************************************************************************************************************************

  /* MODALES */
  visible?: boolean;
  idCapModelEdit?: number;
  opcionCapResultado?: string;

  // EDIT AND CREATE RESULTADOS //
  public showModalEdit(idResultadoAprendizajeSilabo: number) {
    this.opcionCapResultado = "U"
    this.visible = true;
      this.resultadosAprendizajeService.getResultadosArendizajeById(idResultadoAprendizajeSilabo).subscribe(
        data => {
          this.resultadoAprendizajeSilabo = data;
          this.idCapModelEdit = this.resultadoAprendizajeSilabo.idResultadoAprendizajeSilabo;
        }
      )
  }
  
  public showModalCreate() {
    this.opcionCapResultado = "C"
    this.resultadoAprendizajeSilabo = new ResultadoAprendizajeSilabo;
    this.visible = true;
  }

  public actualizarResultadosEstrategia(): void {
    if (this.opcionCapResultado == "C") {
      if (!this.resultadoAprendizajeSilabo.temaUnidadSilabo || !this.resultadoAprendizajeSilabo.elementosCompetenciaSilabo ||
        !this.resultadoAprendizajeSilabo.activadesResultadoAprendizaje || !this.resultadoAprendizajeSilabo.formaEvidenciar) {
        this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
      } else {
        this.resultadoAprendizajeSilabo.silabo = this.silabo;
        this.resultadoAprendizajeSilabo.estadoUnidadActivo = true;
        this.resultadosAprendizajeService.saveResultadosArendizaje(this.resultadoAprendizajeSilabo).subscribe(
          dataTwo => {
            this.traerDatosEstretegiasFull(this.idDelSilabo!);
            console.log("Se creo uno nuevo")
            this.toastrService.success('Nuevo registro existoso', 'Registro Exitoso');
          }
        )
      }
    } else {
      if (!this.resultadoAprendizajeSilabo.temaUnidadSilabo || !this.resultadoAprendizajeSilabo.elementosCompetenciaSilabo ||
        !this.resultadoAprendizajeSilabo.activadesResultadoAprendizaje || !this.resultadoAprendizajeSilabo.formaEvidenciar) {
        this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
      } else {
        this.resultadosAprendizajeService.updateEstadosResultados(this.idCapModelEdit!, this.resultadoAprendizajeSilabo).subscribe(
          dataTwo => {
            this.traerDatosEstretegiasFull(this.idDelSilabo!);
            this.toastrService.success('', 'Registro Actualizado');
          }
        )
      }
    }
  }
  // FIN 


  // CREATE AND UPDATE CONTENIDOS 
  opcionDelContenido!:string;
  idCapModelEditContenido?: number;
  visibleTree?: boolean;

  public showModalCreateContenidos() {
    this.opcionDelContenido = "C"
    this.contenidosSilabo = new Contenidosilabos;
    this.visibleTree = true;
  }

  public showModalEditContenidos(idContenidoSilabo:number) {
    this.opcionDelContenido = "U"
    this.visibleTree = true;
    this.contenidoSilaboService.getContenidosilabosById(idContenidoSilabo).subscribe(
      data => {
        this.contenidosSilabo = data;
        this.idCapModelEditContenido = this.contenidosSilabo.idContenidoSilabo;
      }
    )
  }

  public metodoElejidoContenidos():void{
    if (this.opcionDelContenido == "C") {
      if (!this.contenidosSilabo.temaContenido || !this.contenidosSilabo.horasAutonomas || !this.contenidosSilabo.diaContenido ||
        !this.contenidosSilabo.actividadesPracticas || !this.contenidosSilabo.actividadesAutonomas || !this.contenidosSilabo.actividadesDocencia || !this.contenidosSilabo.horasPracticas || !this.contenidosSilabo.horasClaseContenido) {
          this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
      } else {
        this.contenidosSilabo.silabo = this.silabo;
        this.contenidosSilabo.estadoContenido = true;
        this.contenidoSilaboService.saveContenidosilabos(this.contenidosSilabo).subscribe(
        dataTwo => {
          this.traerDatosContenidosFull(this.idDelSilabo!);
          this.toastrService.success('Nuevo registro existoso', 'Registro Exitoso');
        })
      }
    } else {
      if (!this.contenidosSilabo.temaContenido || !this.contenidosSilabo.horasAutonomas || !this.contenidosSilabo.diaContenido ||
        !this.contenidosSilabo.actividadesPracticas || !this.contenidosSilabo.actividadesAutonomas || !this.contenidosSilabo.actividadesDocencia || !this.contenidosSilabo.horasPracticas || !this.contenidosSilabo.horasClaseContenido) {
          this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
      } else {
      this.contenidoSilaboService.updateContenidoSilabo(this.idCapModelEditContenido!, this.contenidosSilabo).subscribe(
        dataTwo => {
          this.traerDatosContenidosFull(this.idDelSilabo!);
          this.toastrService.success('', 'Registro Actualizado');
        })
      }
    }
  }
  // FIN

  // CREATE AND UPDATE AUDIVISUAL
  visibleFive?: boolean;
  idCapModelEditAudiovisual?: number;
  opcionElegida?: string;

  public showModalCreateAudivisuales() {
    this.materialesAudiovisuales = new MaterialAudiovisuales;
    this.opcionElegida = "C"
    this.visibleFive = true;
  }

  public showModalEditAudivisuales(idMaterialAudiovisual: number) {
    this.visibleFive = true;
    this.opcionElegida = "U"
    this.materialesAudivisualesSilaboService.getMaterialAudiovisualesById(idMaterialAudiovisual).subscribe(
      data => {
        this.materialesAudiovisuales = data;
        this.idCapModelEditAudiovisual = this.materialesAudiovisuales.idMaterialAudiovisual;
      }
    )
  }

  public actualizarAudiovisual(): void {
    if (this.opcionElegida == "C") {
      if (!this.materialesAudiovisuales.descripcionMaterialAudiovisual) {
        this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
      } else {
          this.materialesAudiovisuales.silabo = this.silabo;
          this.materialesAudiovisuales.estadoMaterialAudiovisual = true;
          this.materialesAudivisualesSilaboService.saveMaterialAudiovisuales(this.materialesAudiovisuales).subscribe(
          dataTwo => {
            this.traerDatosMaudiovisualesFull(this.idDelSilabo!);
            this.toastrService.success('Nuevo registro existoso', 'Registro Exitoso');
          }
        )
      }
    } else {
      if (!this.materialesAudiovisuales.descripcionMaterialAudiovisual) {
        this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
      } else {
        this.materialesAudivisualesSilaboService.updateEstadosMaterialAudio(this.idCapModelEditAudiovisual!, this.materialesAudiovisuales).subscribe(
          dataTwo => {
            this.traerDatosMaudiovisualesFull(this.idDelSilabo!);
            this.toastrService.success('', 'Registro Actualizado');
          }
        )
      }
    }
  }
  // FIN

  // MODAL CONVENCIONALES
  visibleSeven?: boolean;
  opcionEscojidaConvencional?: string;
  idCaoModelConvencional?: number;

  
  public showModalEditConvencionales(idMaterialConvencional:number):void{
    this.visibleSeven = true;
    this.opcionEscojidaConvencional = "U"
    this.materialesConvencianalesService.getMaterialConvencionaleById(idMaterialConvencional).subscribe(
      data => {
        this.materialesConvecionales = data;
        this.idCaoModelConvencional = this.materialesConvecionales.idMaterialConvencional;
      }
    )
  }

  public showModalCreateConvencionales() {
    this.materialesConvecionales = new MaterialConvencionales;
    this.opcionEscojidaConvencional = "C"
    this.visibleSeven = true;
  }

  public opcionAEnviar(): void {
    if (this.opcionEscojidaConvencional == "C") {
        if (!this.materialesConvecionales.descripcionMaterialConvencional) {
          this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
        } else {
          this.materialesConvecionales.silabo = this.silabo;
          this.materialesConvecionales.estadoMaterialConvencional = true;
          this.materialesConvencianalesService.saveMaterialConvencional(this.materialesConvecionales).subscribe(
          dataTwo => {
            this.traerDatosMconvencionalesFull(this.idDelSilabo!);
            this.toastrService.success('Nuevo registro existoso', 'Registro Exitoso');
          }
        )
      }
    } else {
      if (!this.materialesConvecionales.descripcionMaterialConvencional) {
        this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
      } else {
        this.materialesConvencianalesService.updateMaterialConvencionales(this.idCaoModelConvencional!, this.materialesConvecionales).subscribe(
          dataTwo => {
            this.traerDatosMconvencionalesFull(this.idDelSilabo!);
            this.toastrService.success('', 'Registro Actualizado');
          }
        )
      }
    }
  }
  // FIN CONVE

  // CREATE AND UPDATE ESTRATEGIAS 
  visibleSixe?: boolean;
  opcionEscojidaEstrategia?: string;
  idCapModelEditEstetegia?:number;

  public showModalCreateEstretegias():void{
    this.estrategiasMetodologicas = new EstrategiasMetodologica;
    this.opcionEscojidaEstrategia = "C"
    this.visibleSixe = true;
  }
  
  public showModalEditEstretegias(idEstrategiaMetodologica:number):void{
    this.visibleSixe = true;
    this.opcionElegida = "U"
    this.estrategiasMetodologicasService.getEstrategiasMetodologicaById(idEstrategiaMetodologica).subscribe(
      data => {
        this.estrategiasMetodologicas = data;
        this.idCapModelEditEstetegia = this.estrategiasMetodologicas.idEstrategiaMetodologica;
      }
    )
  }

  public metodoElejidoEstrategias():void{
    if (this.opcionEscojidaEstrategia == "C") {
      if (!this.estrategiasMetodologicas.nombreEstrategiaMetodologica || !this.estrategiasMetodologicas.finalidadEstrategiaMetodologica) {
        this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
      } else {
        this.estrategiasMetodologicas.silabo = this.silabo;
        this.estrategiasMetodologicas.estadoEstrategiaMetodologicaActivo = true;
        this.estrategiasMetodologicasService.saveEstrategiasMetodologica(this.estrategiasMetodologicas).subscribe(
        dataTwo => {
          this.traerDatosEstrategiasFull(this.idDelSilabo!);
          this.toastrService.success('Nuevo registro existoso', 'Registro Exitoso');
        })
      }
    } else {
      if (!this.estrategiasMetodologicas.nombreEstrategiaMetodologica || !this.estrategiasMetodologicas.finalidadEstrategiaMetodologica) {
        this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
      } else {
        this.estrategiasMetodologicasService.updateEstrategiasSilabo(this.idCapModelEditEstetegia!, this.estrategiasMetodologicas).subscribe(
          dataTwo => {
            this.traerDatosEstrategiasFull(this.idDelSilabo!);
            this.toastrService.success('', 'Registro Actualizado');
          })
      }
    }
  }
  // FIN ESTRATEGIAS
  
  // IMPRIMIR // VALIDAR idSilaboCapGlobal // idSilaboCap
  public getReportSilabo() {
    if (this.contadorValidasUnoG == 0) {
      this.toastrService.error('Active al menos un resultado', 'Resultados de Aprendizaje!');
    } else {
      if (this.contadorValidasDosG == 0) {
        this.toastrService.error('Active al menos un contenido', 'Contenidos Silabo!');
      } else {
        if (this.contadorValidasTresG == 0) {
          this.toastrService.error('Active al menos una estrategia', 'Estrategias Metodológicas!');
        } else {
          if (!this.silabo.campoAprovadoPor || !this.silabo.campoRevisadoPor || !this.silabo.campoFormacion) {
            this.toastrService.error('Verifique los campos obligatorios', 'Uno o más campos vacios');
          } else {
          this.reportService.gedownloadSilabo(this.idDelSilabo!)
            .subscribe((r) => {
              const url = URL.createObjectURL(r);
              window.open(url, '_blank');
            });
          }
        }
      }
    }
  }

  // SALTOS DE LINEA
  // onBibliografiaChange(event: any) {
  //   this.silabo.bibliografia = event.replace(/\n/g, '\n');  
  // }

}
