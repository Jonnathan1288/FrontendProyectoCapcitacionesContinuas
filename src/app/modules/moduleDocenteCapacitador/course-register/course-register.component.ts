import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNGConfig, SelectItem } from 'primeng/api';
import { Area } from 'src/app/models/area';
import { Canton } from 'src/app/models/canton';
import { Capacitador } from 'src/app/models/capacitador';
import { Curso } from 'src/app/models/curso';
import { Especialidad } from 'src/app/models/especialidad';
import { HorarioCurso } from 'src/app/models/horario-curso';
import { ModalidadCurso } from 'src/app/models/modalidad-curso';
import { NivelCurso } from 'src/app/models/nivel-curso';
import { Parroquia } from 'src/app/models/parroquia';
import { PrerequisitoCurso } from 'src/app/models/prerequisito-curso';
import { Programas } from 'src/app/models/programa';
import { Provincia } from 'src/app/models/provincia';
import { TipoCurso } from 'src/app/models/tipo-curso';
import { AreaService } from 'src/app/service/area.service';
import { CantonService } from 'src/app/service/canton.service';
import { CapacitadorService } from 'src/app/service/capacitador.service';
import { CursoService } from 'src/app/service/curso.service';
import { EspecialidadService } from 'src/app/service/especialidad.service';
import { HojaVidaCapacitadorService } from 'src/app/service/hoja-vida-capacitador.service';
import { HorarioCursoService } from 'src/app/service/horario-curso.service';
import { ModalidadService } from 'src/app/service/modalidad.service';
import { NivelCursoService } from 'src/app/service/nivel-curso.service';
import { ParroquiaService } from 'src/app/service/parroquia.service';
import { PrerrequisitosCursoService } from 'src/app/service/prerrequisitosCurso.service';
import { ProgramasService } from 'src/app/service/programas.service';
import { ProvinciaService } from 'src/app/service/provincia.service';
import { TipoCursoService } from 'src/app/service/tipo-curso.service';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from 'src/app/service/upload.service';
import { LocalStorageKeys, getAttributeStorage } from 'src/app/util/local-storage-manager';

@Component({
  selector: 'app-course-register',
  templateUrl: './course-register.component.html',
  styleUrls: ['./course-register.component.css'],
})
export class CourseRegisterComponent {
  //Para todas las listas de los diferentes campos que vamos hacer dinamico los atributos
  public listAreaE: Area[] = [];

  public listTipo: TipoCurso[] = [];
  public listNivelCurso: NivelCurso[] = [];
  public listModalidadCurso: ModalidadCurso[] = [];
  public listProgramas: Programas[] = [];
  public prerequisitoCursoC: PrerequisitoCurso[] = [];

  //Para mostrarlos en el combobox con la key: value ->

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

  //Vamoa a traer al usuario loggiado..
  idUserLoggin: any;

  public idCursoUpdate!: any;
  public tieneIdEnLauta: boolean = false;
  //START--------------------------------------------------------NEW LOGIC
  public capacitadorCopy = new Capacitador();

  //END----------------------------------------------------------

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
    private actiRouter: ActivatedRoute,
    private parroquiaService: ParroquiaService,
    private cantonService: CantonService,
    private provinciaService: ProvinciaService,
    private ngZone: NgZone,
    private toastrService: ToastrService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.idUserLoggin = getAttributeStorage(LocalStorageKeys.ID_USUARIO);
    this.primengConfig.ripple = true;
    this.actiRouter.params.subscribe((params) => {
      const idCurso = params['id'];
      this.idCursoUpdate = idCurso;
      if (idCurso) {
        // this.modalidad = new ModalidadCurso()
        this.findCursoById(idCurso);
      }
    });
    this.capacitadorService
      .getCapacitadorByUsuarioIdUsuario(this.idUserLoggin)
      .subscribe((data) => {
        console.log({ capacitador: data });
        this.curso.capacitador = data;
        this.capacitadorCopy = data;
      });
    this.listArea();
    this.allList();
    this.traerTodosLosCursos();
    this.curso = {
      // Otras propiedades del curso
      fotoCurso: '', // Inicializar fotoCursoPreview como null
    };
  }

  //----------------------------------------------------------------------------------------------START
  //Implementacion de nuevos atributos

  public listProvincias: Provincia[] = [];
  public listCanton: Canton[] = [];
  public listParroquia: Parroquia[] = [];

  public findCantonByProvinciaEvent(e: any, id: any) {
    let idProvincia;
    if (id !== null) {
      idProvincia = id;
    } else {
      idProvincia = e.target.value;
    }

    this.cantonService
      .getAllCantonByIdProvincia(idProvincia)
      .subscribe((data) => {
        if (data != null) {
          // alert()
          this.listCanton = data;
        }
      });
  }

  public findParroquiaByCantonEvent(e: any, id: any) {
    let idCanton;
    if (id !== null) {
      idCanton = id;
    } else {
      idCanton = e.target.value;
    }
    this.parroquiaService
      .getAllParroquiaByIdCanton(idCanton)
      .subscribe((data) => {
        if (data != null) {
          this.listParroquia = data;
        }
      });
  }

  public catchParroquiaByCantonEvent(e: any) {
    if (typeof e === 'object') {
      this.curso.parroquia = e;
    } else if (typeof e === 'number') {
      this.curso.parroquia = this.listParroquia.find(
        (parroquia) => parroquia.idParroquia === e
      );
      console.log(this.curso.parroquia);
    }
  }

  public catchEspecialidadByEvent(e: any, id: any) {
    let Especialidad;
    if (id !== null) {
      Especialidad = id;
    } else {
      Especialidad = e.target.value;
    }
    this.especialidadService
      .getEspecialidadById(Especialidad)
      .subscribe((data) => {
        if (data != null) {
          this.curso.especialidad = data;
        }
      });
    console.log(this.curso.especialidad);
  }

  public classPrograms = new Programas();
  public catchProgramasByEvent(e: any) {
    if (typeof e === 'object') {
      this.curso.programas = e;
    } else if (typeof e === 'number') {
      this.curso.programas = this.listProgramas.find(
        (esp) => esp.idPrograma === e
      );
    }

    console.log(this.curso.programas);
  }

  //----------------------------------------------------------------------------------------------END

  //PARA VALIDAR LA HOJA DE VIDA Y DARLE LAS DIFERENTES VISTAS

  // VARIABLES QUE ME VAN SERVI PARA CARGAR EN LA LISTA
  public molalidadId?: number;
  public tipoCursoId?: number;
  public nivelCursoId?: number;
  //METODO QUE ME VA PERMITIR CARGAR LOS DATOS DEL CURSO PARA SU CORRECTIVA EDICION
  public findCursoById(idCurso: number) {
    this.cursoService.getCursoById(idCurso).subscribe((data) => {
      this.curso = data;

      this.listPrerequisitoCurso(this.curso.idCurso!);
      if (this.curso != null) {
        this.tieneIdEnLauta = true;
        if (this.curso.fechaInicioCurso) {
          this.curso.fechaInicioCurso = new Date(this.curso.fechaInicioCurso);
        }

        if (this.curso.fechaFinalizacionCurso) {
          this.curso.fechaFinalizacionCurso = new Date(
            this.curso.fechaFinalizacionCurso
          );
        }
        if (!data.especialidad) {
          data.especialidad = {
            idEspecialidad: 200,
            nombreEspecialidad: '',
            area: {
              idArea: 22,
              nombreArea: '',
            },
          };
        }

        if (!data.parroquia?.canton) {
          data.parroquia = {
            idParroquia: 2000,
            parroquia: '',
            canton: {
              idCanton: 225,
              provincia: { idProvincia: 26 },
            },
          };
        }
      }
      if (this.curso) {
        this.horarioC = this.curso.horarioCurso!;
        this.daysOfTheweekV = this.curso?.horarioCurso?.dias || '';
        this.molalidadId = this.curso.modalidadCurso?.idModalidadCurso;
        this.tipoCursoId = this.curso.tipoCurso?.idTipoCurso;
        this.nivelCursoId = this.curso.nivelCurso?.idNivelCurso;
        this.findCantonByProvinciaEvent(
          null,
          this.curso.parroquia?.canton?.provincia?.idProvincia
        );
        this.findParroquiaByCantonEvent(
          null,
          this.curso.parroquia?.canton?.idCanton
        );
        this.getEspecialidadesDependenceOfArea(
          null,
          this.curso.especialidad?.area?.idArea
        );
        this.formatHoraCourse(
          this.curso.horarioCurso?.horaInicio!,
          this.curso.horarioCurso?.horaFin!
        );

        //Méto para la fecha
      }
    });
  }

  //Método que me va permitir formatear la fecha-------------

  public formatHoraCourse(horaInit: string, horaFin: string) {
    //Para la fecha de inicio
    const horaInicioParts = horaInit.split(' ');
    if (horaInicioParts.length !== 3) {
      return;
    }
    const hora = parseInt(horaInicioParts[0]);
    const minutos = parseInt(horaInicioParts[1]);
    const amPm = horaInicioParts[2];

    //Formateo
    this.fechaInit = new Date();
    this.fechaInit.setHours(amPm === 'PM' ? hora + 12 : hora);
    this.fechaInit.setMinutes(minutos);

    //END-------------------------------

    //Para la hora fin
    const horaFinParts = horaFin.split(' ');
    if (horaFinParts.length !== 3) {
      return;
    }
    const horaF = parseInt(horaFinParts[0]);
    const minutosF = parseInt(horaFinParts[1]);
    const amPmF = horaFinParts[2];

    //Formateo
    this.fechaFin = new Date();
    this.fechaFin.setHours(amPmF === 'PM' ? horaF + 12 : horaF);
    this.fechaFin.setMinutes(minutosF);
    //END--------------------------------------
  }

  //END----------------------------------------
  //LINEA QUE ME PERMITE CONTROLAR EL VALOR INDEFINIADO DE LA LISTA
  public emptyVa: any = null;
  public emptyVa1: any = null;

  //END EDITION ---------------------------------------------------------------

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
        this.toastrService.error('Prerrequisito quitado.', 'ELIMINADO.', {
          timeOut: 1300,
        });
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
            this.toastrService.success(
              'Prerrequisito actualizado correctamente.',
              'ACTUALIZADO.',
              {
                timeOut: 1300,
              }
            );
          }
        });
    } else {
      if (this.listPrerequisitoCurso1.length >= 8) {
        this.toastrService.warning(
          'Puedes ingresar como maximo 8 prerrequisitos.',
          'LIMITE SUPERADO.',
          {
            timeOut: 1300,
          }
        );
      } else {
        this.prerequisito.estadoPrerequisitoCurso = true;
        this.prerequisitoService
          .savePrerequisitoCurso(this.prerequisito)
          .subscribe((data) => {
            if (data != null) {
              this.toastrService.success(
                'Prerrequisito agregado.',
                'CREADO CORRECTO.',
                {
                  timeOut: 1300,
                }
              );
              this.listPrerequisitoCurso(this.idCursoUpdate);
            }
          });
      }
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


  //PREVISUALIZACION LA IMAGEN SELECCIONADA
  public selectedFile!: File;
  public avatarURL: string = '';
  public onFileSelected(event: any) {
    console.log('File selected:', event);

    let data = event.target.files[0];

    if (data.size >= 1000000) {
      this.toastrService.error('', 'LA FOTO ES MUY GRANDE.', { timeOut: 2000 });
      return;
    }
    this.selectedFile = data;
    const imageURL = URL.createObjectURL(this.selectedFile);
    this.avatarURL = imageURL;
    console.log('Selected file:', this.selectedFile, this.avatarURL);
  }

  //GUARDAR IMAGEN EN EL BACK
  public async uploadImagen() {
    try {
      const result = await this.uploadService
        .upload(this.selectedFile, 'images_course')
        .toPromise();
      return result.key;
    } catch (error) {
      console.error('new income');
    }
  }

  //Create horario and curso

  public fechaInit?: Date;
  public fechaFin?: Date;

  public async validarCursosCpacitacionContinua() {

    if (this.selectedFile) {
      const key = await this.uploadImagen();
      this.curso.fotoCurso = key;
    }

    if (
      !this.curso?.nombreCurso ||
      !this.curso?.fotoCurso ||
      !this.curso?.programas?.nombrePrograma
    ) {
      this.toastrService.error(
        'Verifique los campos obligatorios.',
        'CAMPOS VACÍOS .',
        {
          timeOut: 1600,
        }
      );
    } else {
      console.log(this.listadoCursosReutilizar);
      //empieza validaciones si los campos obligatorios estan llenos
      if (this.curso.idCurso || !this.curso.idCurso) {
        // Validar si el nombre del curso ya existe en otros registros
        const nombreCursoExistente = this.listadoCursosReutilizar.some(
          (curso) =>
            curso.nombreCurso === this.curso.nombreCurso &&
            curso.idCurso !== this.curso.idCurso
        );
        if (nombreCursoExistente) {
          this.toastrService.error(
            'El nombre del curso ya existe en otros registros.',
            'NOMBRE DE CURSO REPETIDO.',
            {
              timeOut: 1600,
            }
          );
          //FIN VALIDACION NOMBRE

          //INICIO VALIDACION FECHAS - VALIDACION DE DIAS DE CURSO
        } else {
          if (
            !this.curso.fechaInicioCurso ||
            !this.curso.fechaFinalizacionCurso
          ) {
            //si las fechas estan vacias crea el curso con horas vacias
            if (!this.fechaInit || !this.fechaFin) {
              // si las horas estan vacias les manda vacio
              this.horarioC.horaInicio = '';
              this.horarioC.horaFin = '';
              this.horarioC.dias = '';
              this.createHorarioCurso();
            } else {
              const horaI = this.fechaInit!.getHours() % 12;
              const minutosI = this.fechaInit!.getMinutes();
              const amPmI = this.fechaInit!.toLocaleString('en-US', {
                hour: 'numeric',
                hour12: true,
              }).split(' ')[1];
              //END-------------------------------------------------

              //START Hora para el fin que se enviara como string
              const horaF = this.fechaFin!.getHours() % 12;
              const minutosF = this.fechaFin!.getMinutes();
              const amPmF = this.fechaFin!.toLocaleString('en-US', {
                hour: 'numeric',
                hour12: true,
              }).split(' ')[1];

              this.horarioC.horaInicio = horaI + ' ' + minutosI + ' ' + amPmI;
              this.horarioC.horaFin = horaF + ' ' + minutosF + ' ' + amPmF;
              this.horarioC.dias = this.daysOfTheweekV;
              this.createHorarioCurso();
            }
          } else {
            //si las fechas estan llenas comprueba los campos de la horas
            if (!this.fechaInit || !this.fechaFin) {
              // si las horas estan vacias les manda vacio
              this.horarioC.horaInicio = '';
              this.horarioC.horaFin = '';
              this.horarioC.dias = '';
              this.createHorarioCurso();
            } else {
              //si no estan vacias entra aqui
              const fechaInicio = new Date(this.curso.fechaInicioCurso);
              const fechaFinalizacion = new Date(
                this.curso.fechaFinalizacionCurso
              );
              const tiempoDiferencia =
                fechaFinalizacion.getTime() - fechaInicio.getTime();
              const diasDiferencia = tiempoDiferencia / (1000 * 60 * 60 * 24);

              if (this.listPrerequisitoCurso1.length >= 0) {
                //Hora para convertir a los horas minutos de la hora de inicio para mandarlo como string..
                const horaI = this.fechaInit!.getHours() % 12;
                const minutosI = this.fechaInit!.getMinutes();
                const amPmI = this.fechaInit!.toLocaleString('en-US', {
                  hour: 'numeric',
                  hour12: true,
                }).split(' ')[1];
                //END-------------------------------------------------

                //START Hora para el fin que se enviara como string
                const horaF = this.fechaFin!.getHours() % 12;
                const minutosF = this.fechaFin!.getMinutes();
                const amPmF = this.fechaFin!.toLocaleString('en-US', {
                  hour: 'numeric',
                  hour12: true,
                }).split(' ')[1];

                this.horarioC.horaInicio = horaI + ' ' + minutosI + ' ' + amPmI;
                this.horarioC.horaFin = horaF + ' ' + minutosF + ' ' + amPmF;
                this.horarioC.dias = this.daysOfTheweekV;
                this.createHorarioCurso();
              }
            }
          }
        }
      }
    }
  }

  public createHorarioCurso() {
    if (this.curso.idCurso) {
      this.horarioC.dias = this.daysOfTheweekV;
      this.horarioC.estadoHorarioCurso = true;
      console.log({ horarioEnvio: this.horarioC });
      this.horarioService
        .updateHorarioCurso(this.horarioC.idHorarioCurso!, this.horarioC)
        .subscribe((data) => {
          if (data != null) {
            console.log(data);
            this.cursoService
              .updateCurso(this.curso.idCurso!, this.curso)
              .subscribe((data) => {
                if (data != null) {
                  this.toastrService.success(
                    'Curso actualizado satisfactoriamente.',
                    'CURSO ACTUALIZADO',
                    {
                      timeOut: 1500,
                      progressBar: true,
                      progressAnimation: 'increasing',
                    }
                  );
                  setTimeout(() => {
                    window.location.reload();
                    location.replace('/list/course');
                  }, 1500);

                  // alert('succesful update course');
                }
              });
          }
        });
    } else {
      this.horarioC.dias = this.daysOfTheweekV;
      this.horarioC.estadoHorarioCurso = true;
      this.horarioService.crearHorarioCurso(this.horarioC).subscribe((data) => {
        if (data != null) {
          this.curso.horarioCurso = data;
          // console.log({ curso: this.curso });
          //Metodo para poner el objeto nuevo------------------------------------------------------------------------------------------------
          this.curso.capacitador = this.capacitadorCopy;
          this.cursoService.saveCurso(this.curso).subscribe(
            (data) => {
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
                this.toastrService.success(
                  'Curso creado satisfactoriamente.',
                  'CURSO CREADO',
                  {
                    timeOut: 1500,
                    progressBar: true,
                    progressAnimation: 'increasing',
                  }
                );
                setTimeout(() => {
                  window.location.reload();
                  location.replace('/list/course');
                }, 1500);

                // alert('Correcto al crear el curso');
              }
            },
            (err) => {
              alert('err');
            }
          );
        }
      });
    }
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
    });
  }

  //Método para obtener por el id..
  public listEspecialida: Especialidad[] = [];
  public getEspecialidadesDependenceOfArea(e: any, id: any) {
    let codigoArea;
    if (id !== null) {
      codigoArea = id;
    } else {
      codigoArea = e.target.value;
    }

    this.especialidadService
      .getespecialidadByIdArea(codigoArea)
      .subscribe((data) => {
        if (data != null) {
          console.log(data);
          this.listEspecialida = data;
        }
      });
  }

  //Método para obtener el objecot por especialidad
  public getObjectEspecialidad(e: any) {
    let codigoEspecialidad = e.target.value;
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
      this.programa = data;
      console.log({ programa: this.programa });
    });
  }

  //Método que me cargara toda la view para hacer dinamico
  public allList() {
    this.programaService.listPrograma().subscribe((data) => {
      this.listProgramas = data.filter(
        (avtivo) => avtivo.estadoProgramaActivo === true
      );
      // this.listProgramasItem = this.listProgramas.map((area) => {
      //   return {
      //     label: area.nombrePrograma,
      //     value: area.idPrograma,
      //   };
      // });
    });

    this.tipoCursoService.listTipoCurso().subscribe((data) => {
      if (data != null) {
        this.listTipo = data;
      }
    });

    this.modalidadCursoService.listModalidadCurso().subscribe((data) => {
      if (data != null) {
        this.listModalidadCurso = data;
      }
    });

    this.nivelCursoService.listNivelCurso().subscribe((data) => {
      if (data != null) {
        this.listNivelCurso = data;
      }
    });

    this.provinciaService.getlistProvincia().subscribe((data) => {
      if (data != null) {
        this.listProvincias = data;
        console.log({ prov: this.listProvincias });
      }
    });
  }

  listPrerequisitoCurso1: PrerequisitoCurso[] = [];
  public almacenarListaDeprerequisitos(): void {
    if (!this.prerequisito.nombrePrerequisitoCurso) {
      this.toastrService.error(
        'Usted no puede ingresar campos vacíos.',
        'CAMPO VACÍO.',
        {
          timeOut: 1300,
        }
      );
    } else {
      if (this.listPrerequisitoCurso1.length === 8) {
        this.toastrService.warning(
          'Puedes ingresar como maximo 8 prerrequisitos.',
          'LIMITE SUPERADO.',
          {
            timeOut: 1300,
          }
        );
      } else {
        this.listPrerequisitoCurso1.push(this.prerequisito);
        this.prerequisito = new PrerequisitoCurso();
        this.toastrService.success(
          'Ingreso correcto del prerrequisito.',
          'PRERREQUISITO AGREGADO.',
          {
            timeOut: 1000,
          }
        );
      }
    }
  }

  public quitarPrerequisitos(prerequisito: any): void {
    const index = this.listPrerequisitoCurso1.findIndex(
      (item) => item.nombrePrerequisitoCurso === prerequisito
    );
    if (index !== -1) {
      this.listPrerequisitoCurso1.splice(index, 1);
      this.toastrService.error('Prerrequisito quitado.', 'ELIMINADO.', {
        timeOut: 1300,
      });
    }
  }

  public necesidad() {
    this.router.navigate(['/register/necesidad', this.idCursoUpdate]);
  }

  //PARA EL MODAL

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  // PARA EL MODAL DE SILABOS A RESTAURAR
  visibleC!: boolean;
  showDialog2() {
    this.traerTodosLosCursos();
    this.visibleC = true;
  }

  listadoCursosReutilizar: Curso[] = [];

  public traerTodosLosCursos(): void {
    this.cursoService.listCurso().subscribe((data) => {
      this.listadoCursosReutilizar = data;
    });
  }

  public copiarDatos(idCurso: number): void {
    this.cursoService.getCursoById(idCurso).subscribe((data) => {
      this.curso = data;
      this.curso.idCurso = 0;
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
      if (this.curso) {
        this.horarioC = this.curso.horarioCurso!;
        this.daysOfTheweekV = this.curso?.horarioCurso?.dias || '';

        this.molalidadId = this.curso.modalidadCurso?.idModalidadCurso;
        this.tipoCursoId = this.curso.tipoCurso?.idTipoCurso;
        this.nivelCursoId = this.curso.nivelCurso?.idNivelCurso;
        this.findCantonByProvinciaEvent(
          null,
          this.curso.parroquia?.canton?.provincia?.idProvincia
        );
        this.findParroquiaByCantonEvent(
          null,
          this.curso.parroquia?.canton?.idCanton
        );
        this.getEspecialidadesDependenceOfArea(
          null,
          this.curso.especialidad?.area?.idArea
        );
        this.formatHoraCourse(
          this.curso.horarioCurso?.horaInicio!,
          this.curso.horarioCurso?.horaFin!
        );
        this.prerequisitoService
          .listPrerequisitoCursoByIdCurso(idCurso)
          .subscribe((data) => {
            this.listPrerequisitoCurso1 = data;
            this.listPrerequisitoCurso1 = this.listPrerequisitoCurso1.filter(
              (prerequisito) => prerequisito.estadoPrerequisitoCurso === true
            );
          });
      }
    });
  }

  //parate de los cursos para la creacion de la hoja de vida:

  public hojaVida() {
    this.router.navigate(['/hojaVida/capacitador']);
  }
}