import { Component } from '@angular/core';
import { PrimeNGConfig, SelectItem } from 'primeng/api';
import { Area } from 'src/app/models/area';
import { Curso } from 'src/app/models/curso';
import { Especialidad } from 'src/app/models/especialidad';
import { ModalidadCurso } from 'src/app/models/modalidad-curso';
import { NivelCurso } from 'src/app/models/nivel-curso';
import { Programa } from 'src/app/models/programa';
import { TipoCurso } from 'src/app/models/tipo-curso';
import { AreaService } from 'src/app/service/area.service';
import { EspecialidadService } from 'src/app/service/especialidad.service';
import { ModalidadService } from 'src/app/service/modalidad.service';
import { NivelCursoService } from 'src/app/service/nivel-curso.service';
import { ProgramasService } from 'src/app/service/programas.service';
import { TipoCursoService } from 'src/app/service/tipo-curso.service';

@Component({
  selector: 'app-course-register',
  templateUrl: './course-register.component.html',
  styleUrls: [
    './course-register.component.css',
    './course-register.component.scss',
  ],
})
export class CourseRegisterComponent {

  //Para todas las listas de los diferentes campos que vamos hacer dinamico los atributos
  public listAreaE: Area[] = [];
  public listEspeciali: Especialidad[] = [];
  public listTipo: TipoCurso[]= [];
  public listnivelCurso: NivelCurso[]= [];
  public listModalidadCurso: ModalidadCurso[]= [];
  public listProgramas: Programa[]= [];

  //Para mostrarlos en el combobox con la key: value -> 
  public listAreaItem: SelectItem[] = [];
  public listEspecialidadItem: SelectItem[] = [];
  public listProgramasItem: SelectItem[] = [];

  public especialidad = new Especialidad();
  public area = new Area();
  public curso = new Curso();

  selectedDay:any;
  other:any;
  other1:any;
  constructor(
    private primengConfig: PrimeNGConfig,
    private areaService: AreaService,
    private especialidadService: EspecialidadService,
    private programaService: ProgramasService,
    private tipoCursoService: TipoCursoService,
    private modalidadCursoService: ModalidadService,
    private nivelCursoService: NivelCursoService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.listArea();
    this.listEspecialidad();
    this.allList();
  }

  //Para listar todas las areas..
  public listArea() {
    this.areaService.listArea().subscribe((data) => {
      this.listAreaE = data;
  
      this.listAreaItem = this.listAreaE.map((area) => {
        return {
          label: area.nombreArea,
          value: area.idArea
        };
      });
    });
  }

  //Para listar todas las especialidades..
  public listEspecialidad() {
    this.especialidadService.listEspecialidad().subscribe((data) => {
      this.listEspeciali = data;
    });
  }

  //Método para obtener por el id.. 
  public getEspecialidadesDependenceOfArea(e: any) {
    let codigoArea = e.value;
    let filterEsp = this.listEspeciali.filter(
      (especialidad: any) =>
    
      especialidad.area.idArea === codigoArea
    );

    this.listEspecialidadItem = filterEsp.map((esp)=>{
      return{
        label: esp.nombreEspecialidad,
        value: esp.idEspecialidad
      };
    });
  }

  //Método para listar todos los programas..
  public getAllProgramas(){
    // this.programaService.
  }

  public allList(){
    this.tipoCursoService.listTipoCurso().subscribe((data)=>{
      this.listTipo = data;
      console.log({infoList: this.listTipo})
    })
  }


  
}
