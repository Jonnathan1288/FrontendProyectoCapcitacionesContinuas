import { Component } from '@angular/core';
import { PrimeNGConfig, SelectItem } from 'primeng/api';
import { Area } from 'src/app/models/area';
import { Capacitador } from 'src/app/models/capacitador';
import { Curso } from 'src/app/models/curso';
import { Especialidad } from 'src/app/models/especialidad';
import { HorarioCurso } from 'src/app/models/horario-curso';
import { ModalidadCurso } from 'src/app/models/modalidad-curso';
import { NivelCurso } from 'src/app/models/nivel-curso';
import { Programa } from 'src/app/models/programa';
import { TipoCurso } from 'src/app/models/tipo-curso';
import { AreaService } from 'src/app/service/area.service';
import { CapacitadorService } from 'src/app/service/capacitador.service';
import { CursoService } from 'src/app/service/curso.service';
import { EspecialidadService } from 'src/app/service/especialidad.service';
import { HorarioCursoService } from 'src/app/service/horario-curso.service';
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
  public listTipo: TipoCurso[] = [];
  public listNivelCurso: NivelCurso[] = [];
  public listModalidadCurso: ModalidadCurso[] = [];
  public listProgramas: Programa[] = [];

  //Para mostrarlos en el combobox con la key: value ->
  public listAreaItem: SelectItem[] = [];
  public listEspecialidadItem: SelectItem[] = [];
  public listProgramasItem: SelectItem[] = [];

  public especialidad = new Especialidad();
  public area = new Area();
  public curso = new Curso();
  public tipo = new TipoCurso();
  public horarioC = new HorarioCurso();
  public capacitador = new Capacitador();

  selectedModalidadCurso!: string;
  selectedTipoCurs!: string;
  selectedNivelCurso!: string;

  //Par el día de la semana
  daysOfTheweek: string[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  selectedDays: string[] = [];

  constructor(
    private primengConfig: PrimeNGConfig,
    private areaService: AreaService,
    private especialidadService: EspecialidadService,
    private programaService: ProgramasService,
    private tipoCursoService: TipoCursoService,
    private modalidadCursoService: ModalidadService,
    private nivelCursoService: NivelCursoService,
    private capacitadorService: CapacitadorService,
    private horarioService: HorarioCursoService,
    private cursoService: CursoService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.listArea();
    this.allList();
    this.capacitadorService.getCapacitadorById(1).subscribe((data) => {
      console.log({ capacitador: data });
      this.curso.capacitador = data;
    });
  }

  getTipoView(tipo: TipoCurso) {
    this.curso.tipoCurso = tipo;
    console.log(tipo);
  }

  getEspecialidadView(especialid: Especialidad) {
    this.curso.especialidad = especialid;
    console.log(especialid);
  }

  getmodalidadCursoView(modalida: ModalidadCurso) {
    this.curso.modalidadCurso = modalida;
    console.log(modalida);
  }

  getnivelCursoView(nivelCurso: NivelCurso) {
    this.curso.nivelCurso = nivelCurso;
    console.log(nivelCurso);
  }

  //Create horario and curso
  public createHorarioCurso() {
    this.horarioC.estadoHorarioCurso = true;
    this.horarioService.crearHorarioCurso(this.horarioC).subscribe((data) => {
      if (data != null) {
        this.curso.horarioCurso = data;
        this.cursoService.saveCurso(this.curso).subscribe((data) => {
          if (data != null) {
            alert('Correcto al crear el curso');
          }
        });
      }
    });
  }

  //Para listar todas las areas..
  public listArea() {
    this.areaService.listArea().subscribe((data) => {
      this.listAreaE = data;
      this.listAreaItem = this.listAreaE.map((area) => {
        return {
          label: area.nombreArea,
          value: area.idArea,
        };
      });
    });
  }

  //Método para obtener por el id..
  public getEspecialidadesDependenceOfArea(e: any) {
    let codigoArea = e.value;
    let filterEsp = this.listEspeciali.filter(
      (especialidad: any) => especialidad.area.idArea === codigoArea
    );

    this.listEspecialidadItem = filterEsp.map((esp) => {
      return {
        label: esp.nombreEspecialidad,
        value: esp.idEspecialidad,
      };
    });
  }

  //Método para obtener el objecot por especialidad
  public getObjectEspecialidad(e: any) {
    let codigoEspecialidad = e.value;
    this.especialidadService
      .getEspecialidadById(codigoEspecialidad)
      .subscribe((data) => {
        this.curso.especialidad = data;
        console.log({ espercialida: data });
      });
  }

  //Método para obtener el programa
  public getObjectprogram(e: any) {
    let codigoPrograma = e.value;
    alert('codigo-> '+codigoPrograma)
    this.programaService.getProgramaById(codigoPrograma).subscribe((data) => {
      this.curso.programa = data;
      console.log({ espercialida: data });
    });
  }

  //Método que me cargara toda la view para hacer dinamico
  public allList() {
    this.programaService.listPrograma().subscribe((data) => {
      this.listProgramas = data;
      this.listProgramasItem = this.listProgramas.map((area) => {
        return {
          label: area.nombrePrograma,
          value: area.idPrograma,
        };
      });
    });

    this.especialidadService.listEspecialidad().subscribe((data) => {
      this.listEspeciali = data;
    });

    this.tipoCursoService.listTipoCurso().subscribe((data) => {
      this.listTipo = data;
    });

    this.modalidadCursoService.listModalidadCurso().subscribe((data) => {
      this.listModalidadCurso = data;
    });

    this.nivelCursoService.listNivelCurso().subscribe((data) => {
      this.listNivelCurso = data;
    });
  }
}
