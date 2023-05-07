import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { LoadScript } from 'src/app/scripts/load-script';
import { CursoService } from 'src/app/service/curso.service';

@Component({
  selector: 'app-panel-modulo-cursos',
  templateUrl: './panel-modulo-cursos.component.html',
  styleUrls: ['./panel-modulo-cursos.component.css','./panel-modulo-cursos.component .scss']
})
export class PanelModuloCursosComponent implements OnInit {


  constructor(
    private cursoService: CursoService,
    private router: Router,
    private activateRoute: ActivatedRoute,
  ) {
  }

  idCursoGlobal?:number;

  ngOnInit(): void {
    this.activateRoute.params.subscribe((param) => {
      const idCurso = param['id'];
      this.idCursoGlobal = idCurso;
      this.verProgreso();
    });
  }

  public datosDelCurso():void{
    this.cursoService.getCursoById(this.idCursoGlobal!).subscribe(
      data=>{
        this.curso = data;
      }
    )
  }

  // CALCULAR EL PROGRESO
  curso: Curso = new Curso();
  progreso: number = 0;
  diasTotal?: any;
  diasTranscurridos?: any;
  fechaActual = new Date();
  public verProgreso():void{
    this.cursoService.getCursoById(this.idCursoGlobal!).subscribe(
      data=>{
        this.curso = data;
        const fechaInicio = new Date(this.curso.fechaInicioCurso!);
        const fechaFin = new Date(this.curso.fechaFinalizacionCurso!);
        this.diasTotal = Math.round(Math.abs((fechaFin.getTime() - fechaInicio.getTime()) / (24 * 60 * 60 * 1000))) + 1;
        this.diasTranscurridos = Math.round(Math.abs((this.fechaActual.getTime() - fechaInicio.getTime()) / (24 * 60 * 60 * 1000)));
        this.progreso = (this.diasTranscurridos / this.diasTotal) * 100;
        console.log("Dias totales -> " + this.diasTotal)
        console.log("Dias transcurridos -> " + this.diasTranscurridos)
        console.log("Progreso -> " + this.progreso)
        this.coloresDeProgressVar();
      }
    )
  }

  progresoBoolean!:boolean;

  coloresDeProgressVar(){
    if (this.progreso >= 100) {
      this.progresoBoolean=true;
    } else {
      this.progresoBoolean=false;
    }
  }

  // FIN CALCULO

}
