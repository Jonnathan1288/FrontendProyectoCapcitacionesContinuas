import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Table } from 'primeng/table';
import { Curso } from 'src/app/models/curso';
import { HojaVidaCapacitador } from 'src/app/models/hoja-vida-capacitador';
import { Persona } from 'src/app/models/persona';
import { Programas } from 'src/app/models/programa';
import { Usuario } from 'src/app/models/usuario';
import { CursoService } from 'src/app/service/curso.service';
import { HojaVidaCapacitadorService } from 'src/app/service/hoja-vida-capacitador.service';
import { PeriodoProgramaService } from 'src/app/service/periodo-programa.service';
import { PersonaService } from 'src/app/service/persona.service';
import { ProgramasService } from 'src/app/service/programas.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-validacion-cursos-capacitacion',
  templateUrl: './validacion-cursos-capacitacion.component.html',
  styleUrls: [
    './validacion-cursos-capacitacion.component.css',
    './validacion-cursos-capacitacion.component.scss',
  ],
})
export class ValidacionCursosCapacitacionComponent implements OnInit {
  public listaProgramas: Programas[] = [];

  //Declaracion de las clases que vamos a usar

  public listP: Persona[] = [];

  public listCursos: Curso[] = [];
  public listUsuario: Usuario[] = [];

  //Método que me va servir para impplementar los periodos de programas
  statuses: any[] = [];

  loading: boolean = false;

  activityValues: number[] = [0, 100];

  private sanitizer!: DomSanitizer;

  constructor(
    private periodoProgramaService: PeriodoProgramaService,
    private programaService: ProgramasService,
    private P: PersonaService,
    private cursoService: CursoService,
    private userService: UsuarioService,
    private hojaVidaService: HojaVidaCapacitadorService,
    sanitizer: DomSanitizer,
    private reportService: ReportsCapacitacionesService
  ) {
    this.sanitizer = sanitizer
  }
  ngOnInit(): void {
    // this.getTodosLosProgramasPorAdministrador();

    // this.getpersona();

    this.getpersona();
    this.getTodosLosProgramasPorAdministrador();
    this.obtenerTodosLosCursos();
  }

  public getTodosLosProgramasPorAdministrador() {
    this.programaService.listPrograma().subscribe((data) => {
      // if (data != null) {
        this.listaProgramas = data;
        console.log({list: this.listaProgramas})
        //  = data.filter(
        //   (programa: any) => programa.estadoProgramaActivo === true
        // );
      // }
    });
  }

  public getpersona() {
    this.userService.listUsuario().subscribe((data) => {
      this.listUsuario = data;
    });
  }

  clear(table: Table) {
    table.clear();
  }

  //Implementtacion de lso metodos para validar los cursos

  public obtenerTodosLosCursos() {
    this.cursoService.listCurso().subscribe((data) => {
      if (data != null) {
        // this.loading = false
        this.listCursos = data;
        this.listCursos.forEach(
          (curso) =>
            (curso.fechaInicioCurso = new Date(curso.fechaInicioCurso!))
        );
        this.listCursos.forEach(
          (curso) =>
            (curso.fechaFinalizacionCurso = new Date(
              curso.fechaFinalizacionCurso!
            ))
        );
      }
    });
  }

  //IMPLEMENTACION PARA HACER QUE EL CURSO SE ACEPTE
  public classCursoValidanew = new Curso();
  visibleCursoDeCapacitacion?: boolean;
  public validarHojaDeVida(curso: Curso, idCurso: number) {
    this.classCursoValidanew = { ...curso };
    this.obtenerHojaVidaCapacitador(this.classCursoValidanew.capacitador!.idCapacitador!)
    this.obtenerReportesValidacion(idCurso)
    this.visibleCursoDeCapacitacion = true;

  }

  public UpdateValidacionCurso(idCurso: number) {
    if (idCurso == 1) {
      this.classCursoValidanew.estadoAprovacionCurso = 'A';
    }else{
      this.classCursoValidanew.estadoAprovacionCurso = 'R';
    }
    this.cursoService.updateCurso(this.classCursoValidanew.idCurso!, this.classCursoValidanew).subscribe((data) => {
      if (data != null) {
        console.log({dataCurso: data})
        alert('succesful');
      }
    });
  }

  public classHojaVidaDocenteCapacitador = new HojaVidaCapacitador();
  public obtenerHojaVidaCapacitador(idCapacitador: number){
    this.classHojaVidaDocenteCapacitador = new HojaVidaCapacitador();
    this.hojaVidaService.getHojaVidaCapacitadorByIdCapacitador(idCapacitador).subscribe((data)=>{
      if(data != null){
        // alert()
        this.classHojaVidaDocenteCapacitador = data;
      }
  
    })
  }

  public pdfSrc: any;
  public obtenerReportesValidacion(idCurso: number){
    switch(idCurso){
      case 1:
        this.reportService.gedownloadSilabo(idCurso).subscribe((data)=>{
          if(data != null){
            const url = URL.createObjectURL(data);
            this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          }
        })
        break;

      case 2:
        this.reportService.getDownloadReportNecesidadCurso(idCurso).subscribe((data)=>{
          if(data != null){
            const url = URL.createObjectURL(data);
            this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          }
        })
        break;

      case 3:
        
        break;
    }

  }

  //Implementacion de los filtros
  // public filterTableEvent(e: any) {
  //   let letter = e.target.value.toLowerCase();

  //   this.wordNoFind = letter;
  //   console.log(this.wordNoFind);

  //   if (this.wordNoFind === '') {

  //     this.listALLAnimalsFiltered = this.listALLAnimals;
  //     this.numerFoundCountAnimal = this.listALLAnimals.length;
  //   } else {
  //     let filteredAnimals = this.listALLAnimals.filter(
  //       (animal: any) =>
  //         animal.persona.id_persona != this.id_user_person &&
  //         (animal.nombre.toLowerCase().includes(this.wordNoFind) ||
  //           animal.raAnimal.nombreraza
  //             .toLowerCase()
  //             .includes(this.wordNoFind) ||
  //           animal.raAnimal.razaAnimal.nombretipo
  //             .toLowerCase()
  //             .includes(this.wordNoFind))
  //     );
  //     this.numerFoundCountAnimal = filteredAnimals.length;
  //     this.listALLAnimalsFiltered = filteredAnimals;
  //   }
  // }
}
