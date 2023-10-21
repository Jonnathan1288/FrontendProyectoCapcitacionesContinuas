import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CursoPaginacion } from 'src/app/models/cursopaginacion';
import { CursoService } from 'src/app/service/curso.service';
import { FOLDER_IMAGE_COURSE, getFile } from 'src/app/util/folder-upload';

@Component({
  selector: 'app-card-visible-courses',
  templateUrl: './card-visible-courses.component.html',
  styleUrls: ['./card-visible-courses.component.css']
})
export class CardVisibleCoursesComponent implements OnInit {

  public estadoMovimient?: boolean = false;

  public initLoader: boolean = false;
  constructor(
    private router: Router,
    private cursoService: CursoService,

  ) { }


  ngOnInit(): void {
    this.obtenerCursosFull();
  }

  listCursos: CursoPaginacion[] = [];
  isFirst: boolean = false;
  isLast: boolean = false;
  isPage: number = 0;
  isSize: number = 8
  valor: string = "";
  isSosrt: string[] = [this.valor, 'asc']
  public searchTerm: string = '';
  pageTotal: number = 0;

  public obtenerCursosFull(): void {
    this.initLoader = true
    this.cursoService.listaCursoDisponiblesPaginacion(this.isPage, this.isSize, this.isSosrt).subscribe((data: any) => {


      this.listCursos = data.content;

      this.pageTotal = Math.ceil(data.totalElements / this.isSize);

      this.initLoader = false

    });
  }

  //Pagina Anterior
  anteriorPage(): void {
    if (!this.isFirst) {
      this.isPage--;
      this.obtenerCursosFull();
    }
  }

  //Pagina Siguiente
  siguientePage(): void {
    if (!this.isLast) {
      this.isPage++;
      this.obtenerCursosFull();
    }
  }


  public getUriFile(fileName: string): string {
    return getFile(fileName, FOLDER_IMAGE_COURSE);
  }


}
