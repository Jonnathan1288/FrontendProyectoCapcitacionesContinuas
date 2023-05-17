import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Area } from 'src/app/models/area';
import { Curso } from 'src/app/models/curso';
import { LoadScript } from 'src/app/scripts/load-script';
import { CursoService } from 'src/app/service/curso.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-cardcurso',
  templateUrl: './cardcurso.component.html',
  styleUrls: ['./cardcurso.component.css', './cardcurso.component.scss'],
})
export class CardcursoComponent implements OnInit {

  public estadoMovimient?: boolean = false;
  constructor(
    private router: Router,
    private cursoService: CursoService,
    private toastrService: ToastrService,
    private localService: StorageService
  ) {}
  
  ngOnInit(): void {
    this.obtenerCursosFull();
    if(this.localService.isLoggedIn()){
      this.estadoMovimient = true;
    }else{
      this.estadoMovimient = false;
    }
  }

  listCursos: Curso[] = [];
  listCursosOriginal: Curso[] = [];

  public obtenerCursosFull(): void {
    this.cursoService.listCursoDisponibles().subscribe((data: Curso[]) => {
      this.listCursos = data;
      this.listCursosOriginal = data;

      this.listCursos = this.listCursosOriginal;

      this.filterAreasPerCurser();
    });
  }

  public pasarInfoCurso(idCurso: any): void {

    if(this.localService.isLoggedIn()){
      this.router.navigate(['/cardcu/detalle', idCurso]);
    }else{
      this.router.navigate(['/login']);
    }
  }

  public pasarInfoCursoIsncripcion(idCurso: any): void {
    this.router.navigate(['/mat', idCurso]);
  }

  // FILTROS
  filtrarPorModalidadVirtual() {
    this.listCursos = this.listCursosOriginal.filter(
      (curso) => curso.modalidadCurso!.nombreModalidadCurso === 'Virtual'
    );
  }

  filtrarPorModalidadPresencial() {
    this.listCursos = this.listCursosOriginal.filter(
      (curso) => curso.modalidadCurso!.nombreModalidadCurso === 'Presencial'
    );
  }

  filtrarPorModalidadTecnico() {
    this.listCursos = this.listCursosOriginal.filter(
      (curso) => curso.tipoCurso!.nombreTipoCurso === 'Técnico'
    );
  }

  filtrarPorModalidadAdministrativo() {
    this.listCursos = this.listCursosOriginal.filter(
      (curso) => curso.tipoCurso!.nombreTipoCurso === 'Administrativo'
    );
  }

  filtrarPorModalidadBasicos() {
    this.listCursos = this.listCursosOriginal.filter(
      (curso) => curso.nivelCurso!.nombreNivelCurso === 'Básico'
    );
  }

  filtrarPorModalidadSuperior() {
    this.listCursos = this.listCursosOriginal.filter(
      (curso) => curso.nivelCurso!.nombreNivelCurso === 'Superior'
    );
  }

  filtrarPorModalidadIntermedios() {
    this.listCursos = this.listCursosOriginal.filter(
      (curso) => curso.nivelCurso!.nombreNivelCurso === 'Intermedio'
    );
  }

  filtrarPorModalidadManana() {
    this.listCursos = this.listCursosOriginal.filter((curso) => {
      const horaInicio = parseInt(
        curso.horarioCurso!.horaInicio!.split(':')[0]
      );
      const horaFin = parseInt(curso.horarioCurso!.horaFin!.split(':')[0]);
      return horaInicio >= 7 && horaFin <= 12;
    });
  }

  filtrarPorModalidadTarde() {
    this.listCursos = this.listCursosOriginal.filter((curso) => {
      const horaInicio = parseInt(
        curso.horarioCurso!.horaInicio!.split(':')[0]
      );
      const horaFin = parseInt(curso.horarioCurso!.horaFin!.split(':')[0]);
      return horaInicio >= 12 && horaFin <= 23;
    });
  }

  //filter l
  public wordNoFind?: any;
  public filterTableCursos(e: any) {
    let letter = e.target.value.toLowerCase();

    this.wordNoFind = letter;
    console.log(this.wordNoFind);

    if (this.wordNoFind === '') {
      this.listCursos = this.listCursosOriginal;
    } else {
      let programaslist = this.listCursosOriginal.filter(
        (p) =>
          p.nombreCurso?.toLowerCase().includes(this.wordNoFind) ||
          p.observacionCurso?.toLowerCase().includes(this.wordNoFind) ||
          p.programas?.nombrePrograma
            ?.toLowerCase()
            .includes(this.wordNoFind) ||
          p.programas?.periodoPrograma?.nombrePeriodoPrograma
            ?.toLowerCase()
            .includes(this.wordNoFind) ||
          p.especialidad?.nombreEspecialidad
            ?.toLowerCase()
            .includes(this.wordNoFind) ||
          p.especialidad?.area?.nombreArea
            ?.toLowerCase()
            .includes(this.wordNoFind) ||
          p.modalidadCurso?.nombreModalidadCurso
            ?.toLowerCase()
            .includes(this.wordNoFind) ||
          p.tipoCurso?.nombreTipoCurso
            ?.toLowerCase()
            .includes(this.wordNoFind) ||
          p.nivelCurso?.nombreNivelCurso
            ?.toLowerCase()
            .includes(this.wordNoFind) ||
          p.parroquia?.parroquia?.toLowerCase().includes(this.wordNoFind) ||
          p.parroquia?.canton?.canton
            ?.toLowerCase()
            .includes(this.wordNoFind) ||
          p.parroquia?.canton?.provincia?.provincia
            ?.toLowerCase()
            .includes(this.wordNoFind)
      );

      this.listCursos = programaslist;
    }
  }

  //Filtro por fecha ya sea de inicio o de fin que esten en ese mes
  onDateSelect(event: any) {
    const selectedDate: Date = event;

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;

    this.listCursos = this.listCursosOriginal.filter((curso) => {
      const fechaInicioCurso = new Date(curso.fechaInicioCurso!);
      const fechaFin = new Date(curso.fechaFinalizacionCurso!);
      return (
        (fechaInicioCurso.getFullYear() === year &&
          fechaInicioCurso.getMonth() + 1 === month) ||
        (fechaInicioCurso!.getFullYear() === year &&
          fechaFin!.getMonth() + 1 === month)
      );
    });

    if (this.listCursos.length > 0) {
      this.toastrService.info('CURSOS ENCONTRADOS '+this.listCursos.length);
    } else {
      this.toastrService.error('NO HAY CURSOS EN ESTA FECHA');
    }
  }

  //METODO PARA FILTRAR TODAS LAS AREAS..
  public listAreaFilter: Area[] = [];
  // public filterAreasPerCurser() {
  //   const areasUnicas = this.listCursos
  //     .map((curso) => curso.especialidad!.area) // Obtener todas las áreas
  //     .filter((area, index, self) => {
  //       // Filtrar las áreas únicas
  //       return (
  //         index ===
  //         self.findIndex(
  //           (a) =>
  //             a?.idArea === area?.idArea && a?.nombreArea === area?.nombreArea
  //         )
  //       );
  //     });

  //   console.log(areasUnicas);
  // }

  public filterAreasPerCurser() {
    const areasUnicas: Area[] = [];
  
    this.listCursos.forEach((curso) => {
      const area = curso.especialidad?.area;
      if (area && !areasUnicas.some((a) => a.idArea === area.idArea)) {
        areasUnicas.push(area);
      }
    });
  
    console.log(areasUnicas);
    this.listAreaFilter = areasUnicas;
  }

  //Para el nombre ocn el filtro
  placeholder = 'Seleccione área';
  updatePlaceholder(event: any) {
    const selectedOption = event.value;
    if (selectedOption) {
      this.placeholder = selectedOption.nombreArea;
    } else {
      this.listCursos = this.listCursosOriginal;
      this.placeholder = 'Seleccione área';
    }
  }

  public cedulaIdentificasion?: String = '';
  public capturarIDAreFiltercourse(idArea: number) {
    this.listCursos = this.listCursosOriginal.filter(
      (curso) => curso.especialidad?.area?.idArea === idArea
    );

    if (this.listCursos.length > 0) {
      this.toastrService.info('CURSOS ENCONTRADOS POR ESTA ÁREA '+this.listCursos.length);
    } else {
      this.toastrService.error('NO HAY CURSOS EN ESTA ÁREA');
    }
  }

  public obtenernuevamenteLosCursosSinFiltros(){
    this.listCursos = this.listCursosOriginal;
  }
}
