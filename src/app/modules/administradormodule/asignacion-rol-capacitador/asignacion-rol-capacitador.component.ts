import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Capacitador } from 'src/app/models/capacitador';
import { DocenteFenix } from 'src/app/models/docente-fenix';
import { HojaVidaCapacitador } from 'src/app/models/hoja-vida-capacitador';
import { Persona } from 'src/app/models/persona';
import { Rol } from 'src/app/models/rol';
import { Usuario } from 'src/app/models/usuario';
import { CapacitadorService } from 'src/app/service/capacitador.service';
import { DocenteFenixService } from 'src/app/service/docente-fenix.service';
import { HojaVidaCapacitadorService } from 'src/app/service/hoja-vida-capacitador.service';
import { PersonaService } from 'src/app/service/persona.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import { RolService } from 'src/app/service/rol.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { DisenioHojaVidaComponent } from '../../hojavida/disenio-hoja-vida/disenio-hoja-vida.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asignacion-rol-capacitador',
  templateUrl: './asignacion-rol-capacitador.component.html',
  styleUrls: ['./asignacion-rol-capacitador.component.css'],
})
export class AsignacionRolCapacitadorComponent implements OnInit {
  public classPersona = new Persona();

  public classUsuario = new Usuario();

  public classRol = new Rol();

  public classCapacitador = new Capacitador();

  public listClassUsuario: Usuario[] = [];

  public listClassCapacitador: Capacitador[] = [];

  public classDocenteFenix = new DocenteFenix();

  public listRole: Rol[] = [];

  public listRoleAsignarUser: Rol[] = [];

  private sanitizer!: DomSanitizer;

  //IMPORT PARA EL OFF AND ON
  public stateOptions: any[] = [];
  public selectedState: any;
  public estadoValidacionBusqueda: string = 'off';
  constructor(
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private docenteFenixService: DocenteFenixService,
    private capacitadorService: CapacitadorService,
    private hojadeVidaServcie: HojaVidaCapacitadorService,
    sanitizer: DomSanitizer,
    private toastrService: ToastrService,

  ) {
    this.sanitizer = sanitizer;
    this.stateOptions = [
      { label: 'Off', value: 'off' },
      { label: 'On', value: 'on' },
    ];
  }
  ngOnInit(): void {
    this.listDocentesCapacitadores();
    this.obtenerRol();
    this.getAllRolesOfDataBase();
  }

  //PAR EL EVENTO DE BUSQUEDA
  //Implementacion de los filtros
  public wordNoFind?: any;
  public listDocentesCapacitadoresFilter: Capacitador[] = [];
  public filterEventDocentesCapacitadores(e: any) {
    let letter = e.target.value.toLowerCase();

    this.wordNoFind = letter;
    console.log(this.wordNoFind);

    if (this.wordNoFind === '') {
      this.listDocentesCapacitadoresFilter = this.listClassCapacitador;
      // this.numerFoundCountAnimal = this.listALLAnimals.length;
    } else {
      let filterDocenteCapacitador =
        this.listDocentesCapacitadoresFilter.filter(
          (capacitador) =>
            capacitador.usuario?.persona?.nombre1
              ?.toLowerCase()
              .includes(this.wordNoFind) ||
            capacitador.usuario?.persona?.nombre2
              ?.toLowerCase()
              .includes(this.wordNoFind) ||
            capacitador.usuario?.persona?.apellido1
              ?.toLowerCase()
              .includes(this.wordNoFind) ||
            capacitador.usuario?.persona?.apellido2
              ?.toLowerCase()
              .includes(this.wordNoFind) ||
            capacitador.usuario?.persona?.identificacion
              ?.toLowerCase()
              .includes(this.wordNoFind) ||
            capacitador.usuario?.username
              ?.toLowerCase()
              .includes(this.wordNoFind)
        );

      this.listDocentesCapacitadoresFilter = filterDocenteCapacitador;
    }
  }
  //END-------------------------------------------------------------------

  //OBTENER TODOS LOS ROLES DE LA BASE DE DATOS..
  public getAllRolesOfDataBase() {
    this.rolService.getAllRoleOfDataBase().subscribe((data) => {
      if (data != null) {
        this.listRole = data;
      }
    });
  }

  public filterGlobalDocenteFenix(e: any) {
    let letter = e.target.value;
    if (letter.length == 10) {
      this.getodosUsuariocConRolDocenteCapacitador(letter);
    }
    console.log(letter);
  }

  public obtenerRol() {
    this.rolService.getRolById(2).subscribe((data) => {
      if (data != null) {
        this.classRol = data;
        console.log({ rol: data });
      }
    });
  }

  //Todos con roles de docente capacitador
  public getodosUsuariocConRolDocenteCapacitador(identificasion: string) {
    this.docenteFenixService
      .getDocenteFenixFindByIdentificasión(identificasion)
      .subscribe(
        (data) => {
          if (data != null) {
            this.classDocenteFenix = data;
            this.classPersona.identificacion =
              this.classDocenteFenix.identificacion;
            this.classPersona.nombre1 = this.classDocenteFenix.nombre1;
            this.classPersona.apellido1 = this.classDocenteFenix.apellido1;
            this.visible = true;
          }
        },
        (err) => {
          this.toastrService.error(
            'La identificasión ingresada no esta en fenix.',
            'DOCENTE NO ENCONTRADO.'
          );
        }
      );
  }

  public cargarDatosDocenteCapacitador(docenteCapacitador: Capacitador) {
    console.log(docenteCapacitador);
    this.classCapacitador = { ...docenteCapacitador };
    this.classUsuario = this.classCapacitador.usuario!;
    this.classPersona = this.classCapacitador.usuario?.persona!;

    this.listRoleAsignarUser = [...this.classUsuario.roles!];
    // this.listRoleAsignarUser = this.classUsuario.roles!;
    console.log(this.classUsuario.roles);
    this.visible = true;
  }

  //Método para guardar todoslos datos de la persona con rol de capacitador..
  public saveUpdateDocenteDocenteCapacitadorRol() {
    if (
      !this.classPersona?.identificacion ||
      !this.classPersona?.nombre1 ||
      !this.classPersona?.apellido1 ||
      !this.classUsuario?.username ||
      !this.classUsuario?.password
    ) {
      // this.toastrService.success('Se añadio correctamente', 'Registro Exitoso');
      this.toastrService.warning(
        'Verifique los campos obligatorios.',
        'Uno o más campos vacios.'
      );
    } else {
      if (this.classPersona?.identificacion?.length === 10) {
        if (this.listRoleAsignarUser.length === 0) {
          // this.toastrService.warning('Verifique los campos obligatorios', 'Debe darle almenos un rol al usuario');
          this.toastrService.error(
            'Debe darle un rol al usuario.',
            'Rol no asignado.'
          );
        } else {
          if (this.classCapacitador.idCapacitador) {
            this.updateDocenteCapacitador();
          } else {
            this.saveDocenteCapacitador();
          }
        }
      } else {
        this.toastrService.error(
          'Ingrese una identificasión valida.',
          'Identificasión invalida.'
        );
      }
    }
  }

  //ASIGNAR ROLES A USUARIO
  public asignarRolesUsuario(rol: Rol) {
    const index = this.listRoleAsignarUser.findIndex(
      (item) => item.idRol === rol.idRol
    );

    if (index !== -1) {
      // Si el rol ya existe, lo eliminamos del arreglo
      this.listRoleAsignarUser.splice(index, 1);
    } else {
      // Si el rol no existe, lo agregamos al arreglo
      this.listRoleAsignarUser.push(rol);
    }

    console.log(this.listRoleAsignarUser);
  }

  isRoleAssigned(role: Rol): boolean {
    return this.listRoleAsignarUser.some(
      (assignedRole) => assignedRole.idRol === role.idRol
    );
  }

  //Metodo para actualizar al docente Capacitador
  public updateDocenteCapacitador() {
    this.personaService
      .updatePersona(this.classPersona.idPersona!, this.classPersona)
      .subscribe((data) => {
        if (data != null) {
          this.classUsuario.roles = this.listRoleAsignarUser;
          this.usuarioService
            .updateUsuario(this.classUsuario.idUsuario!, this.classUsuario)
            .subscribe((data) => {
              if (data != null) {
                this.toastrService.success(
                  'Los datos fueron actualizados correctamente',
                  'Datos Actualizados Correctamente.'
                );
                this.visible = false;
              }
            });
        }
      });
  }

  //Metodo para crear al docente capacitador
  public saveDocenteCapacitador() {
    this.personaService
      .getPersonaByIdentificasion(this.classPersona?.identificacion!)
      .subscribe((data) => {
        if (data !== true) {
          this.usuarioService
            .getExistUsuarioByUsername(this.classUsuario?.username!)
            .subscribe((data1) => {
              if (data1 !== true) {
                // INGRESO PARA LA CREACION------------------------------
                if (this.classDocenteFenix.identificacion) {
                  this.classUsuario.idUsuario = 0;
                  this.classPersona.nombre1 = this.classDocenteFenix.nombre1;
                  this.classPersona.nombre2 = this.classDocenteFenix.nombre2;
                  this.classPersona.apellido1 =
                    this.classDocenteFenix.apellido1;
                  this.classPersona.apellido2 =
                    this.classDocenteFenix.apellido2;
                  this.classPersona.fechaNacimiento =
                    this.classDocenteFenix.fechaNacimiento!;
                  this.classPersona.direccion =
                    this.classDocenteFenix.direccion;
                  this.classPersona.correo = this.classDocenteFenix.correo;
                  this.classPersona.telefono = this.classDocenteFenix.telefono;
                  this.classPersona.celular = this.classDocenteFenix.celular;
                  // this.classPersona.genero = this.classDocenteFenix.genero;
                  this.classPersona.genero = this.classDocenteFenix.genero?.charAt(0) || '';

                  this.classPersona.etnia = this.classDocenteFenix.etnia;

                  //Para el servicio
                  this.personaService
                    .savePersona(this.classPersona)
                    .subscribe((data) => {
                      if (data != null) {
                        this.classUsuario.estadoUsuarioActivo = true;
                        this.classUsuario.persona = data;
                        this.classUsuario.roles = this.listRoleAsignarUser;
                        this.usuarioService
                          .saveUsuario(this.classUsuario)
                          .subscribe((data1) => {
                            if (data1 != null) {
                              this.classCapacitador.usuario = data1;
                              this.classCapacitador.tipoAbreviaturaTitulo =
                                this.classDocenteFenix.tipoAbreviaturaTitulo;
                              this.classCapacitador.tituloCapacitador =
                                this.classDocenteFenix.tituloCapacitador;
                              this.classCapacitador.estadoActivoCapacitador =
                                true;
                              this.capacitadorService
                                .saveCapacitador(this.classCapacitador)
                                .subscribe((data2) => {
                                  if (data2) {
                                    this.toastrService.success(
                                      'El ingreso de información exitoso.',
                                      'Registro Exitoso.'
                                    );
                                    this.classCapacitador = new Capacitador();
                                    this.classPersona = new Persona();
                                    this.classUsuario = new Usuario();
                                    this.listDocentesCapacitadores();
                                    this.visible = false;
                                  }
                                });
                            }
                          });
                      }
                    });
                } else {
                  this.personaService
                    .savePersona(this.classPersona)
                    .subscribe((data) => {
                      if (data != null) {
                        this.classUsuario.idUsuario = 0;
                        this.classUsuario.estadoUsuarioActivo = true;
                        this.classUsuario.persona = data;
                        this.classUsuario.roles = this.listRoleAsignarUser;
                        //this.classUsuario.rol = this.classRol;
                        this.usuarioService
                          .saveUsuario(this.classUsuario)
                          .subscribe((data1) => {
                            if (data1 != null) {
                              this.classCapacitador.usuario = data1;
                              this.classCapacitador.estadoActivoCapacitador =
                                true;
                              this.capacitadorService
                                .saveCapacitador(this.classCapacitador)
                                .subscribe((data2) => {
                                  if (data2) {
                                    this.toastrService.success(
                                      'El ingreso de información exitoso.',
                                      'Registro Exitoso.'
                                    );
                                    this.classCapacitador = new Capacitador();
                                    this.classPersona = new Persona();
                                    this.classUsuario = new Usuario();
                                    this.visible = false;
                                    this.listDocentesCapacitadores();
                                    
                                  }
                                });
                            }
                          });
                      }
                    });
                }

                //END-------------------------------------------------
              } else {
                this.toastrService.error(
                  'El nombre del usuario ya esta en el sistema.',
                  'Usuario existente'
                );
              }
            });
        } else {
          this.toastrService.error(
            'La identificasión ya esta en el sistema.',
            'Identificasión existente'
          );
        }
      });
  }

  //Eliminado logico del sistema
  public eliminadoLogicoDelCapacitador(user: Usuario) {

    user.estadoUsuarioActivo = !user.estadoUsuarioActivo; // Alternar el estado activo/desactivado

      this.usuarioService.updateUsuario(user?.idUsuario!, user!).subscribe((data)=>{
        if(data != null){
          if (user.estadoUsuarioActivo) {
            this.toastrService.success('Usuario a sido activodo/a', 'Usuario activo');
          } else {
            this.toastrService.warning('Usuario a sido inactivado/a', 'Usuario Inactivo');
          }
          this.listDocentesCapacitadores();
        }
      })
  }

  //Traer los docetes capacitadores en el sistema..
  public listDocentesCapacitadores() {
    this.capacitadorService.getAllCapacitador().subscribe((data) => {
      if (data != null) {
        this.listClassCapacitador = data;
        this.listDocentesCapacitadoresFilter = this.listClassCapacitador;
      }
    });
  }

  //Parte para aprobar la hoja de vida del docente capacitador.
  public classHojaDevida = new HojaVidaCapacitador();
  visibleHojaVida?: boolean;
  public showModaLHojaVidaCapacitador(idCapacitador: number) {
    this.pdfSrc = null;
    this.fileUrl = null;
    // this.fileUrl =
    this.classHojaDevida = new HojaVidaCapacitador();
    this.hojadeVidaServcie
      .getHojaVidaCapacitadorByIdCapacitador(idCapacitador)
      .subscribe(
        (data) => {
          if (data != null) {
            this.classHojaDevida = data;
            console.log({ capa: this.classHojaDevida });
            this.visibleHojaVida = true;
            this.mostrarPDF_BDA(idCapacitador);
          }
        },
        (err) => {
          this.toastrService.error('Docente capacitador no tiene hoja de vida', 'Hoja de vida vacio');
        }
      );
  }

  //MOSTRAR HOJA VIDA
  //mETOO QUE ME MOSTRAR EN EL CASO DE LA VISTA

  // fileUrl!: SafeResourceUrl;
  fileUrl: SafeResourceUrl | null = null;
  isInNewComponet:boolean = false;
  public pdfSrc: any;
  idCapacitadorSend?:number;
  public mostrarPDF_BDA(idCapacitador: number): void {
    if (
      this.classHojaDevida.documento &&
      this.classHojaDevida.documento.length > 0
    ) {
      const byteCharacters = atob(this.classHojaDevida.documento);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        window.URL.createObjectURL(pdfBlob)
      );
      this.isInNewComponet = false;
    } else {
      this.isInNewComponet = true;
      this.idCapacitadorSend = idCapacitador;
      // this.router.navigate(['/ver/hojaVida/capacitador/', idCapacitador]);
      // this.reportService.gedownloadHojaVida(idCapacitador).subscribe((data) => {
      //   if (data != null) {
      //     const url = URL.createObjectURL(data);
      //     this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      //   }
      // });
    }
    //this.classHojaDevida = new HojaVidaCapacitador();
  }

  //Validar hoja de vida.
  public validarHojaDeVida(estado: number) {
    if (estado == 1) {
      this.classHojaDevida.estadoAprobacion = 'A';
    } else {
      this.classHojaDevida.estadoAprobacion = 'R';
    }
    console.log({ hojaVida: this.classHojaDevida });
    this.hojadeVidaServcie
      .updateHojaDeVida(this.classHojaDevida.idHojaVida!, this.classHojaDevida)
      .subscribe((data) => {
        if (data != null) {

          if(data.estadoAprobacion === 'A'){
            this.toastrService.success('Hoja de vida aceptada.', 'ACEPTADO.', {
              timeOut: 2000,
            });
          }else{

            this.toastrService.error('Hoja de vida rechazada.', 'RECHAZADA.', {
              timeOut: 2000,
            });
          }


          // alert('Succesful');
          // console.log({ hojaVida: data });
        }
      });
    setTimeout(() => {
      this.visibleHojaVida = false;
    }, 1200);
  }

  //vISIVILIADA DEL MODAL
  visible?: boolean;

  public showModaL() {
    this.classPersona = new Persona();
    this.classCapacitador = new Capacitador();
    this.classUsuario = new Usuario();
    this.listRoleAsignarUser = [];
    this.visible = true;
  }
}
