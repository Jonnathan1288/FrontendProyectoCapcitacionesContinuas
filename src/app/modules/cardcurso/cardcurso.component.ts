import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { LoadScript } from 'src/app/scripts/load-script';
import { CursoService } from 'src/app/service/curso.service';

@Component({
  selector: 'app-cardcurso',
  templateUrl: './cardcurso.component.html',
  styleUrls: ['./cardcurso.component.css', './cardcurso.component.scss']
})
export class CardcursoComponent implements OnInit {



  ngOnInit(): void {
    this.obtenerCursosFull();
  }

  constructor(
    private router: Router,
    private cursoService: CursoService,
  ) {
  }

  listCursos: Curso[] = [];

  public obtenerCursosFull():void{
    this.cursoService.listCurso().subscribe( 
      data=>{
      this.listCursos = data
      // this.verProgreso();
    })
  }

  public pasarInfoCurso(idCurso:any):void{
    this.router.navigate(['/cardcu/detalle',idCurso ]);
  }

  public pasarInfoCursoIsncripcion(idCurso:any):void{
    this.router.navigate(['/mat', idCurso ]);
  }

  // CALCULAR EL PROGRESO
  // curso: Curso = new Curso();
  // progreso: number = 0;
  // diasTotal?: any;
  // diasTranscurridos?: any;
  // idCursoCapVerProgreso?:number = 2;
  // fechaActual = new Date();
  // public verProgreso():void{
  //   this.cursoService.getCursoById(this.idCursoCapVerProgreso!).subscribe(
  //     data=>{
  //       this.curso = data;
  //       const fechaInicio = new Date(this.curso.fechaInicioCurso!);
  //       const fechaFin = new Date(this.curso.fechaFinalizacionCurso!);
  //       this.diasTotal = Math.round(Math.abs((fechaFin.getTime() - fechaInicio.getTime()) / (24 * 60 * 60 * 1000))) + 1;
  //       this.diasTranscurridos = Math.round(Math.abs((this.fechaActual.getTime() - fechaInicio.getTime()) / (24 * 60 * 60 * 1000)));
  //       this.progreso = (this.diasTranscurridos / this.diasTotal) * 100;
  //       console.log("Dias totales -> " + this.diasTotal)
  //       console.log("Dias transcurridos -> " + this.diasTranscurridos)
  //       console.log("Progreso -> " + this.progreso)
  //     }
  //   )
  // }

  // FIN CALCULO
}
