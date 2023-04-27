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

  }

  /* TRAER DATOS DEL CURSO*/

  idCursoCap?: number;
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
      !this.resultadoAprendizajeSilabo.activadesResultadoAprendizaje || !this.resultadoAprendizajeSilabo.formaEvidenciar) {
      alert("Campos Vacios")
    } else {
      this.listResultadosAprendizajes.push(this.resultadoAprendizajeSilabo);
      this.resultadoAprendizajeSilabo = new ResultadoAprendizajeSilabo();
      this.resultadoAprendizajeSilabo.temaUnidadSilabo = '';
      this.resultadoAprendizajeSilabo.elementosCompetenciaSilabo = '';
      this.resultadoAprendizajeSilabo.activadesResultadoAprendizaje = '';
      this.resultadoAprendizajeSilabo.formaEvidenciar = '';
    }
  }

  public quitarElemento(index: number): void {
    this.listResultadosAprendizajes.splice(index, 1);
  }

  /* FIN RESULTADOS APRENDIZAJE */

}
