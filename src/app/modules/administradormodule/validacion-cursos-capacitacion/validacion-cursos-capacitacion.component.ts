import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Curso } from 'src/app/models/curso';
import { Persona } from 'src/app/models/persona';
import { Programas } from 'src/app/models/programa';
import { CursoService } from 'src/app/service/curso.service';
import { PeriodoProgramaService } from 'src/app/service/periodo-programa.service';
import { PersonaService } from 'src/app/service/persona.service';
import { ProgramasService } from 'src/app/service/programas.service';

@Component({
  selector: 'app-validacion-cursos-capacitacion',
  templateUrl: './validacion-cursos-capacitacion.component.html',
  styleUrls: ['./validacion-cursos-capacitacion.component.css', './validacion-cursos-capacitacion.component.scss'],
})
export class ValidacionCursosCapacitacionComponent implements OnInit {
  public listaProgramas: Programas[] = [];

  //Declaracion de las clases que vamos a usar

  statuses: any[] = [];

  loading: boolean = false;

  activityValues: number[] = [0, 100];

  public listP: Persona[] = [];



  public listCursos: Curso[] =[];


  constructor(
    private periodoProgramaService: PeriodoProgramaService,
    private programaService: ProgramasService,
    private P: PersonaService,
    private cursoService: CursoService
  ) {}
  ngOnInit(): void {
    // this.getTodosLosProgramasPorAdministrador();

    // this.getpersona();
    this.obtenerTodosLosCursos();
  }

  public getTodosLosProgramasPorAdministrador() {
    this.programaService.listPrograma().subscribe((data) => {
      if (data != null) {
        this.listaProgramas = data;
        //  = data.filter(
        //   (programa: any) => programa.estadoProgramaActivo === true
        // );
      }
    });
  }

  public getpersona() {
    this.P.getListaPersonas().subscribe((data) => {
      this.listP = data;
  

    });
  }

  clear(table: Table) {
    table.clear();
  }

  //Implementtacion de lso metodos para validar los cursos

  public obtenerTodosLosCursos(){
    this.cursoService.listCurso().subscribe((data)=>{
      if(data != null){

        // this.loading = false
        this.listCursos = data;
      }
    })
  }
}
