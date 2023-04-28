import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private reportService: ReportsCapacitacionesService
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
    this.obtenerDatosCurso();
  }

  /* TRAER DATOS DEL CURSO*/
  idCursoCap?: any = localStorage.getItem('idCurso');;
  CapIdCursoSend?: number;

  public obtenerDatosCurso(): void {
    if (this.idCursoCap != null && this.idCursoCap != undefined) {
      this.cursoService.getCursoById(this.idCursoCap).subscribe((data) => {
        this.curso = data;
        this.CapIdCursoSend = this.curso.idCurso;
        this.obtenerPrerrequisistos(this.CapIdCursoSend!);
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
      !this.resultadoAprendizajeSilabo.activadesResultadoAprendizaje || !this.resultadoAprendizajeSilabo.formaEvidenciar || !this.resultadoAprendizajeSilabo.descripcionUnidadSilabo) {
    } else {
      this.resultadoAprendizajeSilabo.estadoUnidadActivo = true;
      this.listResultadosAprendizajes.push(this.resultadoAprendizajeSilabo);
      this.resultadoAprendizajeSilabo = new ResultadoAprendizajeSilabo();
      this.resultadoAprendizajeSilabo.temaUnidadSilabo = '';
      this.resultadoAprendizajeSilabo.elementosCompetenciaSilabo = '';
      this.resultadoAprendizajeSilabo.activadesResultadoAprendizaje = '';
      this.resultadoAprendizajeSilabo.formaEvidenciar = '';
      this.resultadoAprendizajeSilabo.descripcionUnidadSilabo = '';
    }
  }

  public quitarElemento(index: number): void {
    this.listResultadosAprendizajes.splice(index, 1);
  }
  /* FIN RESULTADOS APRENDIZAJE */

  /* CREACION CONTENIDOS - ARRAY TEMPORAL*/
  listContenidosSilabo: Contenidosilabos[] = [];

  public almacenarListaContenidos(): void {
    if (!this.contenidosSilabo.temaContenido || !this.contenidosSilabo.horasAutonomas ||
      !this.contenidosSilabo.horasPracticas || !this.contenidosSilabo.horasClaseContenido) {
      alert('vacio')
    } else {
      this.listContenidosSilabo.push(this.contenidosSilabo);
      this.contenidosSilabo = new Contenidosilabos();
      this.contenidosSilabo.temaContenido = '';
      this.contenidosSilabo.horasPracticas = 0;
      this.contenidosSilabo.horasClaseContenido = 0;
      this.contenidosSilabo.horasAutonomas = 0;
    }
  }

  public quitarElementoContenido(index: number): void {
    this.listContenidosSilabo.splice(index, 1);
  }
  /* FIN CONTENIDOS */

  /* */
  listEstrategiasMetodologica: EstrategiasMetodologica[] = [];

  public almacenarListaEstrategias(): void {
    if (!this.estrategiasMetodologicas.nombreEstrategiaMetodologica || !this.estrategiasMetodologicas.finalidadEstrategiaMetodologica) {
      alert('vacio')
    } else {
      this.listEstrategiasMetodologica.push(this.estrategiasMetodologicas);
      this.estrategiasMetodologicas = new EstrategiasMetodologica();
      this.estrategiasMetodologicas.nombreEstrategiaMetodologica = '';
      this.estrategiasMetodologicas.finalidadEstrategiaMetodologica = '';
    }
  }

  public quitarElementoEstrategias(index: number): void {
    this.listEstrategiasMetodologica.splice(index, 1);
  }
  /* */

  /* */
  listMaterialConvencionales: MaterialConvencionales[] = [];

  public almacenarListaMaterialConvencionales(): void {
    if (!this.materialesConvecionales.descripcionMaterialConvencional) {
      alert('vacio')
    } else {
      this.listMaterialConvencionales.push(this.materialesConvecionales);
      this.materialesConvecionales = new MaterialConvencionales();
      this.materialesConvecionales.descripcionMaterialConvencional = '';
    }
  }

  public quitarElementoMateriales(index: number): void {
    this.listMaterialConvencionales.splice(index, 1);
  }
  /* */

  /* */
  listCMaterialAudiovisuales: MaterialAudiovisuales[] = [];

  public almacenarListaMaterialAudiovisualess(): void {
    if (!this.materialesAudiovisuales.descripcionMaterialAudiovisual) {
      alert('vacio')
    } else {
      this.listCMaterialAudiovisuales.push(this.materialesAudiovisuales);
      this.materialesAudiovisuales = new MaterialAudiovisuales();
      this.materialesAudiovisuales.descripcionMaterialAudiovisual = '';
    }
  }

  public quitarElementoConvencional(descripcionMaterialAudiovisual: any): void {
    const index = this.listCMaterialAudiovisuales.findIndex(item => item.descripcionMaterialAudiovisual === descripcionMaterialAudiovisual);
    if (index !== -1) {
      this.listCMaterialAudiovisuales.splice(index, 1);
    }
  }
  /* */

  /* METODO POST */
  idSilaboCap?: number;

  public generarSilabo(): void {
    this.silabo.curso = this.curso;
    this.silaboService.saveSilabo(this.silabo).subscribe(silaboData => {
      this.silabo = silaboData;
      this.idSilaboCap = this.silabo.idSilabo;
      console.log("Data + " + silaboData)
      /* TABLAS */
      this.generarResultadosAprendizaje();
      this.generarContenidos();
      this.generarEstetegiasMetodologicas();
      this.generarMaterialesAudivisuales();
      this.generarMaterialesConvecionales();
      /* */
      console.log("Silabo generado id->" + this.idSilaboCap)
    })
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
      this.materialesConvencianalesService.saveMaterialAudiovisuales(convencionales).subscribe(data => {
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

  // ACTUALIZAR SILABO //
  idSilaboCapEdit?: number = 1;
  idSilaboCapGlobal?: number;
  validarIdSilabo: Boolean = false;
  public traerDatos(): void {
    this.silaboService.getSilaboById(this.idSilaboCapEdit!).subscribe(
      data => {
        this.silabo = data;
        this.idSilaboCapGlobal = this.silabo.idSilabo;
        this.traerDatosEstretegiasFull(this.idSilaboCapGlobal!);
        this.traerDatosContenidosFull(this.idSilaboCapGlobal!);
        this.traerDatosEstrategiasFull(this.idSilaboCapGlobal!);
        this.traerDatosMaudiovisualesFull(this.idSilaboCapGlobal!);
        this.traerDatosMconvencionalesFull(this.idSilaboCapGlobal!);
        this.validarIdSilabo = true;
      }
    )
  }

  // TRAER TODOS LOS DATOS DEL SILABO
  public traerDatosEstretegiasFull(idSilabo: number): void {
    this.resultadosAprendizajeService.getResultadosPorIdSilabo(idSilabo).subscribe(
      data => {
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
            return resultadoAprendizajeSilabo;
          }
        )
      }
    )
  }

  public traerDatosContenidosFull(idSilabo: number): void {
    this.contenidoSilaboService.getContenidoSilaboPorIdSilabo(idSilabo).subscribe(
      data => {
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
            return contenidosilabo;
          }
        )
      }
    )
  }

  public traerDatosEstrategiasFull(idSilabo: number): void {
    this.estrategiasMetodologicasService.getEstrategiasMetodologicaPorIdSilabo(idSilabo).subscribe(
      data => {
        this.listEstrategiasMetodologica = data.map(
          dataTwo => {
            let estrategiaMetodologica = new EstrategiasMetodologica();
            estrategiaMetodologica.idEstrategiaMetodologica = dataTwo.idEstrategiaMetodologica;
            estrategiaMetodologica.nombreEstrategiaMetodologica = dataTwo.nombreEstrategiaMetodologica;
            estrategiaMetodologica.finalidadEstrategiaMetodologica = dataTwo.finalidadEstrategiaMetodologica;
            estrategiaMetodologica.estadoEstrategiaMetodologicaActivo = dataTwo.estadoEstrategiaMetodologicaActivo;
            return estrategiaMetodologica;
          }
        )
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
            this.traerDatosEstretegiasFull(this.idSilaboCapGlobal!);
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
            this.traerDatosEstretegiasFull(this.idSilaboCapGlobal!);
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
      this.resultadoAprendizajeSilabo.silabo = this.silabo;
      this.resultadoAprendizajeSilabo.estadoUnidadActivo = true;
      this.resultadosAprendizajeService.saveResultadosArendizaje(this.resultadoAprendizajeSilabo).subscribe(
        dataTwo => {
          this.traerDatosEstretegiasFull(this.idSilaboCapGlobal!);
          console.log("Se creo uno nuevo")
        }
      )
    } else {
      this.resultadosAprendizajeService.updateEstadosResultados(this.idCapModelEdit!, this.resultadoAprendizajeSilabo).subscribe(
        dataTwo => {
          this.traerDatosEstretegiasFull(this.idSilaboCapGlobal!);
          console.log("Se actualizo")
        }
      )
    }
  }
  // FIN 

  // CREATE AND UPDATE CONTENIDOS 
  public showModalCreateContenidos() {
    this.contenidosSilabo = new ResultadoAprendizajeSilabo;
    this.visibleTree = true;
  }
  // FIN

  // CREATE AND UPDATE AUDIVISUAL
  visibleFive?: boolean;
  visibleFiveCreate?: boolean;
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
      this.materialesAudiovisuales.silabo = this.silabo;
      this.materialesAudiovisuales.estadoMaterialAudiovisual = true;
      this.materialesAudivisualesSilaboService.saveMaterialAudiovisuales(this.materialesAudiovisuales).subscribe(
      dataTwo => {
        this.traerDatosMaudiovisualesFull(this.idSilaboCapGlobal!);
        console.log("Se creo uno nuevo")
      }
    )
    } else {
      this.materialesAudivisualesSilaboService.updateEstadosMaterialAudio(this.idCapModelEditAudiovisual!, this.materialesAudiovisuales).subscribe(
        dataTwo => {
          this.traerDatosMaudiovisualesFull(this.idSilaboCapGlobal!);
          console.log("Se actualizo")
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

  // IMPRIMIR
  public getReportSilabo() {
    this.reportService.gedownloadSilabo(this.idSilaboCapGlobal!)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }
}
