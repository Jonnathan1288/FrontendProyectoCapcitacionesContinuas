import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Area } from 'src/app/models/area';
import { Curso } from 'src/app/models/curso';
import { CursoPaginacion } from 'src/app/models/cursopaginacion';
import { LoadScript } from 'src/app/scripts/load-script';
import { CursoService } from 'src/app/service/curso.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-cardcurso',
  templateUrl: './cardcurso.component.html',
  styleUrls: ['./cardcurso.component.css'],
})
export class CardcursoComponent implements OnInit {

  public estadoMovimient?: boolean = false;
  constructor(
    private router: Router,
    private cursoService: CursoService,
    private toastrService: ToastrService,
    private localService: StorageService
  ) { }

  ngOnInit(): void {
    this.obtenerCursosFull();
    if (this.localService.isLoggedIn()) {
      this.estadoMovimient = true;
    } else {
      this.estadoMovimient = false;
    }
  }

  listCursos: CursoPaginacion[] = [];
  listCursosOriginal: CursoPaginacion[] = [];
  isFirst: boolean = false;
  isLast: boolean = false;
  isPage: number = 0;
  isSize: number = 6
  valor: string = "";
  isSosrt: string[] = [this.valor, 'asc']
  public searchTerm: string = '';
  pageTotal: number = 0;

  public obtenerCursosFull(): void {
    this.cursoService.listaCursoDisponiblesPaginacion(this.isPage, this.isSize, this.isSosrt).subscribe((data: any) => {
      this.listCursos = data.content;
      this.listCursosOriginal = data.content;
      this.listCursos = this.listCursosOriginal;
      this.filterAreasPerCurser();

      this.pageTotal = Math.ceil(data.totalElements / this.isSize);
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

  public pasarInfoCurso(idCurso: any): void {
    if (this.localService.isLoggedIn()) {
      this.router.navigate(['/cardcu/detalle', idCurso]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  public pasarInfoCursoIsncripcion(idCurso: any): void {
    this.router.navigate(['/mat', idCurso]);
  }

  // FILTROS
  filtrarPorModalidadVirtual() {
    this.listCursos = this.listCursosOriginal.filter((curso: any) => curso.nombreModalidadCurso === "Virtual");
  }

  filtrarPorModalidadPresencial() {
    this.listCursos = this.listCursosOriginal.filter((curso: any) => curso.nombreModalidadCurso === "Presencial");
  }

  filtrarPorModalidadTecnico() {
    this.listCursos = this.listCursosOriginal.filter((curso: any) => curso.nombreTipoCurso === "Técnico");
  }

  filtrarPorModalidadAdministrativo() {
    this.listCursos = this.listCursosOriginal.filter((curso: any) => curso.nombreTipoCurso === "Administrativo");
  }

  filtrarPorModalidadBasicos() {
    this.listCursos = this.listCursosOriginal.filter((curso: any) => curso.nombreNivelCurso === "Básico");
  }

  filtrarPorModalidadSuperior() {
    this.listCursos = this.listCursosOriginal.filter((curso: any) => curso.nombreNivelCurso === "Superior");
  }

  filtrarPorModalidadIntermedios() {
    this.listCursos = this.listCursosOriginal.filter((curso: any) => curso.nombreNivelCurso === "Intermedio");
  }

  filtrarPorModalidadManana() {
    this.listCursos = this.listCursosOriginal.filter((curso: any) => {
      const horaInicioComponents = curso.horaInicio.split(" ");
      const horaInicio = horaInicioComponents[0];
      const minutosInicio = horaInicioComponents[1];
      const periodoCurso = horaInicioComponents[2];
      return periodoCurso === "AM";
    });
  }

  filtrarPorModalidadTarde() {
    this.listCursos = this.listCursosOriginal.filter((curso: any) => {
      const horaInicioComponents = curso.horaInicio.split(" ");
      const horaInicio = horaInicioComponents[0];
      const minutosInicio = horaInicioComponents[1];
      const periodoCurso = horaInicioComponents[2];
      return periodoCurso === "PM";
    });
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
      this.toastrService.info('CURSOS ENCONTRADOS ' + this.listCursos.length);
    } else {
      this.toastrService.error('NO HAY CURSOS EN ESTA FECHA');
    }
  }


  //METODO PARA FILTRAR TODAS LAS AREAS..
  public listAreaFilter: string[] = [];

  public filterAreasPerCurser() {
    const especialidadesUnicas = new Set<string>();

    this.listCursos.forEach((curso: any) => {
      especialidadesUnicas.add(curso.nombreEspecialidad);
    });
    this.listAreaFilter = Array.from(especialidadesUnicas);
  }


  //Para el nombre ocn el filtro
  placeholder = 'Seleccione área';
  updatePlaceholder(event: any) {
    const selectedOption = event.value;

    if (selectedOption) {
      this.listCursos = this.listCursosOriginal.filter((curso: CursoPaginacion) => {
        return curso.nombreEspecialidad === selectedOption;
      });

      this.placeholder = selectedOption;
    } else {
      this.listCursos = this.listCursosOriginal;
      this.placeholder = 'Seleccione área';
    }
  }



  filterCourses() {
    let filteredCourses = this.listCursosOriginal;

    if (this.searchTerm) {
      filteredCourses = filteredCourses.filter((curso: CursoPaginacion) => {
        const searchTermLower = this.searchTerm.toLowerCase();

        return (
          (curso.nombreCurso && curso.nombreCurso.toLowerCase().includes(searchTermLower)) ||
          (curso.nombre && curso.nombre.toLowerCase().includes(searchTermLower)) ||
          (curso.duracionCurso && curso.duracionCurso.toString().includes(this.searchTerm)) ||
          (curso.fechaInicioCurso && curso.fechaInicioCurso.toString().includes(this.searchTerm)) ||
          (curso.fechaFinalizacionCurso && curso.fechaFinalizacionCurso.toString().includes(this.searchTerm)) ||
          (curso.horaInicio && curso.horaInicio.toLowerCase().includes(searchTermLower)) ||
          (curso.horaFin && curso.horaFin.toLowerCase().includes(searchTermLower)) ||
          (curso.dias && curso.dias.toLowerCase().includes(searchTermLower)) ||
          (curso.nombreModalidadCurso && curso.nombreModalidadCurso.toLowerCase().includes(searchTermLower)) ||
          (curso.nombreTipoCurso && curso.nombreTipoCurso.toLowerCase().includes(searchTermLower)) ||
          (curso.nombreNivelCurso && curso.nombreNivelCurso.toLowerCase().includes(searchTermLower)) ||
          (curso.numeroCuposCurso && curso.numeroCuposCurso.includes(this.searchTerm)) ||
          (curso.nombreEspecialidad && curso.nombreEspecialidad.toLowerCase().includes(searchTermLower))
        );
      });
    }
    this.listCursos = filteredCourses;
    if (!this.searchTerm) {
      this.listCursos = this.listCursosOriginal;
    }
  }



  /*public cedulaIdentificasion?: String = '';
  public capturarIDAreFiltercourse(idArea: number) {
     this.listCursos = this.listCursosOriginal.filter(
       (curso) => curso.especialidad?.area?.idArea === idArea
     );
 
     if (this.listCursos.length > 0) {
       this.toastrService.info('CURSOS ENCONTRADOS POR ESTA ÁREA ' + this.listCursos.length);
     } else {
       this.toastrService.error('NO HAY CURSOS EN ESTA ÁREA');
     }
   }*/

  public obtenernuevamenteLosCursosSinFiltros() {
    this.listCursos = this.listCursosOriginal;
  }
}
