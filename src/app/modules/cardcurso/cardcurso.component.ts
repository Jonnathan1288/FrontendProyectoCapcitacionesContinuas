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
  listCursosOriginal: Curso[] = [];

  public obtenerCursosFull():void{
    this.cursoService.listCursoDisponibles().subscribe( 
      (data: Curso[]) => {
      this.listCursos = data;
      this.listCursosOriginal = data;
    })
  }


  public pasarInfoCurso(idCurso:any):void{
    this.router.navigate(['/cardcu/detalle',idCurso ]);
  }

  public pasarInfoCursoIsncripcion(idCurso:any):void{
    this.router.navigate(['/mat', idCurso ]);
  }

  // FILTROS
  filtrarPorModalidadVirtual() {
    this.listCursos = this.listCursosOriginal.filter(curso => curso.modalidadCurso!.nombreModalidadCurso === 'Virtual');
  }

  filtrarPorModalidadPresencial() {
    this.listCursos = this.listCursosOriginal.filter(curso => curso.modalidadCurso!.nombreModalidadCurso === 'Presencial');
  }

  filtrarPorModalidadTecnico() {
    this.listCursos = this.listCursosOriginal.filter(curso => curso.tipoCurso!.nombreTipoCurso === 'Técnico');
  }

  filtrarPorModalidadAdministrativo() {
    this.listCursos = this.listCursosOriginal.filter(curso => curso.tipoCurso!.nombreTipoCurso === 'Administrativo');
  }

  filtrarPorModalidadBasicos() {
    this.listCursos = this.listCursosOriginal.filter(curso => curso.nivelCurso!.nombreNivelCurso === 'Basico');
  }

  filtrarPorModalidadSuperior() {
    this.listCursos = this.listCursosOriginal.filter(curso => curso.nivelCurso!.nombreNivelCurso === 'Superior');
  }

  filtrarPorModalidadIntermedios() {
    this.listCursos = this.listCursosOriginal.filter(curso => curso.nivelCurso!.nombreNivelCurso === 'Intermedio');
  }

  filtrarPorModalidadManana() {
    this.listCursos = this.listCursosOriginal.filter(curso => {
      const horaInicio = parseInt(curso.horarioCurso!.horaInicio!.split(':')[0]);
      const horaFin = parseInt(curso.horarioCurso!.horaFin!.split(':')[0]);
      return horaInicio >= 7 && horaFin <= 12;
    });
  }

  filtrarPorModalidadTarde() {
    this.listCursos = this.listCursosOriginal.filter(curso => {
      const horaInicio = parseInt(curso.horarioCurso!.horaInicio!.split(':')[0]);
      const horaFin = parseInt(curso.horarioCurso!.horaFin!.split(':')[0]);
      return horaInicio >= 12 && horaFin <= 23;
    });
  }


}
