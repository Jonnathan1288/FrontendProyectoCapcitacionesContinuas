import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contenidosilabos } from 'src/app/models/contenidosilabos';
import { Curso } from 'src/app/models/curso';
import { EstrategiasMetodologica } from 'src/app/models/estrategias-metodologica';
import { MaterialAudiovisuales } from 'src/app/models/material-audiovisuales';
import { MaterialConvencionales } from 'src/app/models/material-convencionales';
import { ResultadoAprendizajeSilabo } from 'src/app/models/resultado-aprendizaje-silabo';
import { Silabo } from 'src/app/models/silabo';
import { ContenidoSilaboService } from 'src/app/service/contenido-silabo.service';
import { CursoService } from 'src/app/service/curso.service';
import { EstrategiaMetodologicaService } from 'src/app/service/estrategia-metodologica.service';
import { MaterialAudiovisualService } from 'src/app/service/material-audiovisual.service';
import { MaterialConvencionalService } from 'src/app/service/material-convencional.service';
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
    private materialesAudivisualesSilabo: MaterialAudiovisualService,
    private materialesConvencianales: MaterialConvencionalService,
    private resultadosAprendizajeService: ResultadoAprendizajeSilaboService,
    private contenidoSilabo: ContenidoSilaboService
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


  ngOnInit() {
    this.obtenerDatosCurso();
  }

  /* TRAER DATOS DEL CURSO*/
  idCursoCap?: number = 1;
  CapIdCursoSend?: number;

  public obtenerDatosCurso(): void {
    if (this.idCursoCap != null && this.idCursoCap != undefined) {
      this.cursoService.getCursoById(this.idCursoCap).subscribe((data) => {
        this.curso = data;
        this.CapIdCursoSend = this.curso.idCurso;
      })
    } else {
      console.log("Curso not found =(")
    }
  }
  /* FIN TRAER DATOS*/

  /* CREACION RESULTADOS APRENDIZAJE - ARRAY TEMPORAL*/
  listResultadosAprendizajes: ResultadoAprendizajeSilabo[] = [];

  public almacenarLista(): void {
    if (!this.resultadoAprendizajeSilabo.temaUnidadSilabo || !this.resultadoAprendizajeSilabo.elementosCompetenciaSilabo ||
      !this.resultadoAprendizajeSilabo.activadesResultadoAprendizaje || !this.resultadoAprendizajeSilabo.formaEvidenciar || !this.resultadoAprendizajeSilabo.descripcionUnidadSilabo) {
    } else {
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

  public quitarElementoConvencional(index: number): void {
    this.listCMaterialAudiovisuales.splice(index, 1);
  }
  /* */
  
  /* METODO POST */
  idSilaboCap?:number;
  
  public generarSilabo():void{
    this.silabo.curso = this.curso;
    this.silaboService.saveSilabo(this.silabo).subscribe(silaboData=>{
        this.silabo = silaboData;
        this.idSilaboCap = this.silabo.idSilabo;
        console.log("Data + " + silaboData)
        /* TABLAS */
        this.generarResultadosAprendizaje();
        /* */
        console.log("Silabo generado id->" + this.idSilaboCap )
    })
  }
  /* */

  /* ENTIDADES SEGUIDAS DEL SILABO */
  public generarResultadosAprendizaje(): void {
    for (let resultado of this.listResultadosAprendizajes) {
      resultado.silabo = this.silabo; 
      resultado.estadoUnidadActivo = true;
      this.resultadosAprendizajeService.saveResultadosArendizaje(resultado).subscribe(dataAprendizaje => {
        console.log("Se creo el resultados =)");
      });
    }
  }
  
  /* */
}
