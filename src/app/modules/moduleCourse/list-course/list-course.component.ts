import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/service/curso.service';

@Component({
  selector: 'app-list-course',
  templateUrl: './list-course.component.html',
  styleUrls: ['./list-course.component.css'],
})
export class ListCourseComponent implements OnInit {
  public curso = new Curso();

  public cursoList: Curso[] = [];

  first = 0;

  rows = 5;

  constructor(private cursoService: CursoService, private router: Router,
    private actiRouter: ActivatedRoute) {}

  ngOnInit(): void {
    this.listCourse();
  }

  public listCourse() {
    this.cursoService.listCurso().subscribe((data) => {
      this.cursoList = data;
      console.log(data)
    });
  }

  public silabo(idcurso: number){
    localStorage.setItem('idCurso', String(idcurso));
    location.replace('/silabo');
  }

  public editCurso(idcurso: number){
    // localStorage.setItem('idCurso', String(idcurso));
    this.router.navigate(['/register/course', idcurso]);
  }

  public necesidadCurso(idcurso: number){
    // localStorage.setItem('idCurso', String(idcurso));
    this.router.navigate(['/register/necesidad', idcurso]);
  }

  //Implementacion de la tabla de todo referente a primeng
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.cursoList
      ? this.first === this.cursoList.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.cursoList ? this.first === 0 : true;
  }
}
