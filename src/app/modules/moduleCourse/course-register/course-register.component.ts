import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNGConfig, SelectItem } from 'primeng/api';
import { Area } from 'src/app/models/area';
import { Capacitador } from 'src/app/models/capacitador';
import { Curso } from 'src/app/models/curso';
import { Especialidad } from 'src/app/models/especialidad';
import { HorarioCurso } from 'src/app/models/horario-curso';
import { ModalidadCurso } from 'src/app/models/modalidad-curso';
import { NivelCurso } from 'src/app/models/nivel-curso';
import { PrerequisitoCurso } from 'src/app/models/prerequisito-curso';
import { Programas } from 'src/app/models/programa';
import { TipoCurso } from 'src/app/models/tipo-curso';
import { AreaService } from 'src/app/service/area.service';
import { CapacitadorService } from 'src/app/service/capacitador.service';
import { CursoService } from 'src/app/service/curso.service';
import { EspecialidadService } from 'src/app/service/especialidad.service';
import { HojaVidaCapacitadorService } from 'src/app/service/hoja-vida-capacitador.service';
import { HorarioCursoService } from 'src/app/service/horario-curso.service';
import { ModalidadService } from 'src/app/service/modalidad.service';
import { NivelCursoService } from 'src/app/service/nivel-curso.service';
import { PrerrequisitosCursoService } from 'src/app/service/prerrequisitosCurso.service';
import { ProgramasService } from 'src/app/service/programas.service';
import { TipoCursoService } from 'src/app/service/tipo-curso.service';

@Component({
  selector: 'app-course-register',
  templateUrl: './course-register.component.html',
  styleUrls: [
    './course-register.component.css'
  ],
})
export class CourseRegisterComponent {
  //Para todas las listas de los diferentes campos que vamos hacer dinamico los atributos
  public listAreaE: Area[] = [];
  public listEspeciali: Especialidad[] = [];
  public listTipo: TipoCurso[] = [];
  public listNivelCurso: NivelCurso[] = [];
  public listModalidadCurso: ModalidadCurso[] = [];
  public listProgramas: Programas[] = [];
  public prerequisitoCursoC: PrerequisitoCurso[] = [];

  //Para mostrarlos en el combobox con la key: value ->
  public listAreaItem: SelectItem[] = [];
  public listEspecialidadItem: SelectItem[] = [];
  public listProgramasItem: SelectItem[] = [];

  public especialidad = new Especialidad();
  public area = new Area();
  public curso = new Curso();
  public programa = new Programas();
  public tipo = new TipoCurso();
  public horarioC = new HorarioCurso();
  public capacitador = new Capacitador();
  public prerequisito = new PrerequisitoCurso();

  selectedModalidadCurso!: string;
  selectedTipoCurs!: string;
  selectedNivelCurso!: string;
  daysOfTheweekV!: string;

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

  //Vamoa a traer al usuario loggiado..
  idUserLoggin: any;

  public idCursoUpdate!: any;
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
    private cursoService: CursoService,
    private prerequisitoService: PrerrequisitosCursoService,
    private hojaVidaService: HojaVidaCapacitadorService,
    private router: Router,
    private actiRouter: ActivatedRoute
  ) {}

  ngOnInit() {
    this.idUserLoggin = localStorage.getItem('id_username');
    this.validarHojaVidaByIdCapacitdor(this.idUserLoggin);
    this.primengConfig.ripple = true;
    this.actiRouter.params.subscribe((params) => {
      const idCurso = params['id'];
      this.idCursoUpdate = idCurso;
      if (idCurso) {
        this.findCursoById(idCurso);
      }
    });
    this.capacitadorService.getCapacitadorByUsuarioIdUsuario(this.idUserLoggin).subscribe((data) => {
      console.log({ capacitador: data });
      this.curso.capacitador = data;
    });
    this.listArea();
    this.allList();
  }

  //PARA VALIDAR LA HOJA DE VIDA Y DARLE LAS DIFERENTES VISTAS
  public estadoHojaVida: string= '';
  public validarHojaVidaByIdCapacitdor(idCapacitador: number){
    this.hojaVidaService.getHojadeVidaByIdUsuarioLoggin(idCapacitador).subscribe((data)=>{
      if(data != null){
        this.estadoHojaVida = data.estadoAprobacion!
      }
    })
  }

  public findCursoById(idCurso: number) {
    this.cursoService.getCursoById(idCurso).subscribe((data) => {
      this.curso = data;
      this.listPrerequisitoCurso(this.curso.idCurso!);
      if (this.curso != null) {
        if (this.curso.fechaInicioCurso) {
          this.curso.fechaInicioCurso = new Date(this.curso.fechaInicioCurso);
        }

        if (this.curso.fechaFinalizacionCurso) {
          this.curso.fechaFinalizacionCurso = new Date(
            this.curso.fechaFinalizacionCurso
          );
        }

      }
    });
  }
  public editPrerequisito(prerequisito: any) {
    this.prerequisito = {
      ...prerequisito,
    };
  }

  public eliminadologicoDeprerequisito(prerequisito: PrerequisitoCurso) {
    prerequisito.estadoPrerequisitoCurso = false;
    this.prerequisitoService
      .updatePrerequisitoCurso(prerequisito.idPrerequisitoCurso!, prerequisito)
      .subscribe((data) => {
        this.listPrerequisitoCurso(this.idCursoUpdate);
      });
  }

  public createPrerequisitoCurso() {
    this.prerequisito.curso = this.curso;
    if (this.prerequisito.idPrerequisitoCurso) {
      this.prerequisitoService
        .updatePrerequisitoCurso(
          this.prerequisito.idPrerequisitoCurso,
          this.prerequisito
        )
        .subscribe((data) => {
          if (data != null) {
            this.listPrerequisitoCurso(this.idCursoUpdate);
          }
        });
    } else {
      this.prerequisito.estadoPrerequisitoCurso = true;
      this.prerequisitoService
        .savePrerequisitoCurso(this.prerequisito)
        .subscribe((data) => {
          if (data != null) {
            this.listPrerequisitoCurso(this.idCursoUpdate);
          }
        });
    }
    this.prerequisito = new PrerequisitoCurso();
    this.visible = false;
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
    this.horarioC.dias = this.daysOfTheweekV;
    this.horarioC.estadoHorarioCurso = true;
    this.horarioService.crearHorarioCurso(this.horarioC).subscribe((data) => {
      if (data != null) {
        this.curso.horarioCurso = data;
        this.curso.programas = this.programa;
       console.log({ programa: this.curso });
        this.cursoService.saveCurso(this.curso).subscribe((data) => {
          if (data != null) {
            this.curso = data;
            this.idCursoUpdate = this.curso.idCurso;
            for (let prerequisito of this.listPrerequisitoCurso1) {
              prerequisito.estadoPrerequisitoCurso = true;
              prerequisito.curso = this.curso;
              this.prerequisitoService
                .savePrerequisitoCurso(prerequisito)
                .subscribe((data) => {
                  if (data != null) {
               
                  }
                });
            }
            alert('Correcto al crear el curso');
          }
        });
      }
    });
  }

  public listPrerequisitoCurso(idCursoUpdate: number) {
    if (idCursoUpdate) {
      this.prerequisitoService
        .listPrerequisitoCursoByIdCurso(this.idCursoUpdate)
        .subscribe((data) => {
          this.listPrerequisitoCurso1 = data;
          this.listPrerequisitoCurso1 = this.listPrerequisitoCurso1.filter(
            (prerequisito) => prerequisito.estadoPrerequisitoCurso === true
          );
        });
    }
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

    // this.listEspecialidadItem = filterEsp.map((esp) => {
    //   return {
    //     label: esp.nombreEspecialidad!.slice(0, 40),
    //     value: esp.idEspecialidad,
    //   };
    // });
    this.listEspecialidadItem = filterEsp.map((esp) => {
      return {
        label: esp.nombreEspecialidad!.slice(0, 40) + '\n' + esp.nombreEspecialidad!.slice(40, 80),
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
    this.programaService.getProgramaById(codigoPrograma).subscribe((data) => {
      this.programa = data
      console.log({ programa: this.programa});
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

  // Metodos para cargar la fotofilte
  // foto
  async subirFoto(event: any) {
    const file = event.target.files[0];
    const fileSize = file.size; // tamaño en bytes
    if (fileSize > 262144) {
      // mensaje de error al usuario
      alert('La foto es muy pesada');
      event.target.value = null;
    } else {
      try {
        this.curso.fotoCurso = await this.convertToBase64(file);
      } catch (error) {
        console.error(error);
      }
    }
  }

  //convesion a base 64
  async convertToBase64(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const result = btoa(reader.result as string);
        resolve(result);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsBinaryString(file);
    });
  }

  
  listPrerequisitoCurso1: PrerequisitoCurso[] = [];
  public almacenarListaDeprerequisitos(): void {
    if (!this.prerequisito.nombrePrerequisitoCurso) {
      alert('vacio');
    } else {
      this.listPrerequisitoCurso1.push(this.prerequisito);
      this.prerequisito = new PrerequisitoCurso();
    }
  }

  public quitarPrerequisitos(prerequisito: any): void {
    const index = this.listPrerequisitoCurso1.findIndex(
      (item) => item.nombrePrerequisitoCurso === prerequisito
    );
    if (index !== -1) {
      this.listPrerequisitoCurso1.splice(index, 1);
    }
  }


  //Ruteo a otras ventanas
  public silabo() {
    this.router.navigate(['/silabo', this.idCursoUpdate]);
  }

  public necesidad() {
    this.router.navigate(['/register/necesidad', this.idCursoUpdate]);
  }

  //PARA EL MODAL

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
}
