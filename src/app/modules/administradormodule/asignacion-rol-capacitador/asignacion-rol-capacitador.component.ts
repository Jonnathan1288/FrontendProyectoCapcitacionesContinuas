import { Component, OnInit } from '@angular/core';
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
  constructor(
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private docenteFenixService: DocenteFenixService,
    private capacitadorService: CapacitadorService,
    private hojadeVidaServcie: HojaVidaCapacitadorService,
    sanitizer: DomSanitizer,
    private reportService: ReportsCapacitacionesService
  ) {
    this.sanitizer = sanitizer;
  }
  ngOnInit(): void {
    this.listDocentesCapacitadores();
    this.obtenerRol();
    this.getAllRolesOfDataBase();
  }

  //OBTENER TODOS LOS ROLES DE LA BASE DE DATOS..
  public getAllRolesOfDataBase() {
    this.rolService.getAllRoleOfDataBase().subscribe((data) => {
      if (data != null) {
        this.listRole = data;
      }
    });
  }

  public filterGlobal(e: any) {
    let letter = e.target.value;
    if (letter.length == 10) {
      this.getodosUsuariocConRolDocenteCapacitador(letter);
      this.visible = true;
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
      .subscribe((data) => {
        if (data != null) {
          this.classDocenteFenix = data;
          this.classPersona.identificacion =
            this.classDocenteFenix.identificacion;
          this.classPersona.nombre1 = this.classDocenteFenix.nombre1;
          this.classPersona.apellido1 = this.classDocenteFenix.apellido1;
        }
      });
  }

  public cargarDatosDocenteCapacitador(docenteCapacitador: Capacitador) {
     console.log(docenteCapacitador)
    this.classCapacitador = {...docenteCapacitador };
    this.classUsuario = this.classCapacitador.usuario!;
    this.classPersona = this.classCapacitador.usuario?.persona!;

    this.listRoleAsignarUser = [...this.classUsuario.roles!];
    // this.listRoleAsignarUser = this.classUsuario.roles!;
    console.log(this.classUsuario.roles);
    this.visible = true;
  }

  //Método para guardar todoslos datos de la persona con rol de capacitador..
  public saveUpdateDocenteDocenteCapacitadorRol() {
    if (this.classCapacitador.idCapacitador) {
      this.updateDocenteCapacitador();
    } else {
      this.saveDocenteCapacitador();
    }
  }

  //ASIGNAR ROLES A USUARIO
  public asignarRolesUsuario(rol: Rol) {
    // const found = this.listRoleAsignarUser.find(role => role = rol)
    // const index = this.listRoleAsignarUser.findIndex(
    //   (item) => item === rol
    // );
    // if (index !== -1) {
    //   this.listRoleAsignarUser.splice(index, 1);
    //   console.log(this.listRoleAsignarUser);
    // }else{
    //   this.listRoleAsignarUser.push(rol);
    //   console.log(this.listRoleAsignarUser);
    // }

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
  public quitarElementoEstrategias(nombreEstrategiaMetodologica: any): void {}

  //Metodo para actualizar al docente Capacitador
  public updateDocenteCapacitador() {
    console.log({ persona: this.classPersona });
    this.personaService
      .updatePersona(this.classPersona.idPersona!, this.classPersona)
      .subscribe((data) => {
        if (data != null) {
          this.classUsuario.roles = this.listRoleAsignarUser;
          this.usuarioService
            .updateUsuario(this.classUsuario.idUsuario!, this.classUsuario)
            .subscribe((data) => {
              if (data != null) {
                alert('update user succesful');
                this.visible = false;
              }
            });
        }
      });
  }

  //Metodo para crear al docente capacitador
  public saveDocenteCapacitador() {
    if (this.classDocenteFenix.identificacion) {
      this.classPersona.identificacion = this.classDocenteFenix.identificacion;
      this.classPersona.nombre1 = this.classDocenteFenix.nombre1;
      this.classPersona.nombre2 = this.classDocenteFenix.nombre2;
      this.classPersona.apellido1 = this.classDocenteFenix.apellido1;
      this.classPersona.apellido2 = this.classDocenteFenix.apellido2;
      this.classPersona.fechaNacimiento =
        this.classDocenteFenix.fechaNacimiento;
      this.classPersona.direccion = this.classDocenteFenix.direccion;
      this.classPersona.correo = this.classDocenteFenix.correo;
      this.classPersona.telefono = this.classDocenteFenix.telefono;
      this.classPersona.celular = this.classDocenteFenix.celular;
      this.classPersona.genero = this.classDocenteFenix.genero;
      this.classPersona.etnia = this.classDocenteFenix.etnia;

      //Para el servicio
      this.personaService.savePersona(this.classPersona).subscribe((data) => {
        if (data != null) {
          console.log('Bien');
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
                this.classCapacitador.estadoActivoCapacitador = true;
                this.capacitadorService
                  .saveCapacitador(this.classCapacitador)
                  .subscribe((data2) => {
                    if (data2) {
                      alert('succesful');
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
      this.personaService.savePersona(this.classPersona).subscribe((data) => {
        if (data != null) {
          this.classUsuario.estadoUsuarioActivo = true;
          this.classUsuario.persona = data;
          //this.classUsuario.rol = this.classRol;
          this.usuarioService
            .saveUsuario(this.classUsuario)
            .subscribe((data1) => {
              if (data1 != null) {
                this.classCapacitador.usuario = data1;
                this.classCapacitador.estadoActivoCapacitador = true;
                this.capacitadorService
                  .saveCapacitador(this.classCapacitador)
                  .subscribe((data2) => {
                    if (data2) {
                      this.classCapacitador = new Capacitador();
                      this.classPersona = new Persona();
                      this.classUsuario = new Usuario();
                      this.visible = false;
                      this.listDocentesCapacitadores();
                      alert('succesful');
                    }
                  });
              }
            });
        }
      });
    }
  }

  //Eliminado logico del sistema
  public eliminadoLogicoDelCapacitador(capacitador: Capacitador) {
    capacitador.estadoActivoCapacitador = false;
    this.capacitadorService
      .updateCapacitador(capacitador.idCapacitador!, capacitador)
      .subscribe((data) => {
        if (data != null) {
          alert('Succesful delete logical');
          this.listDocentesCapacitadores();
        }
      });
  }

  //Traer los docetes capacitadores en el sistema..
  public listDocentesCapacitadores() {
    this.capacitadorService.getAllCapacitador().subscribe((data) => {
      if (data != null) {
        this.listClassCapacitador = data;
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
          alert('Docente capacitador no tiene hoja de vida');
        }
      );
  }

  //MOSTRAR HOJA VIDA
  //mETOO QUE ME MOSTRAR EN EL CASO DE LA VISTA

  // fileUrl!: SafeResourceUrl;
  fileUrl: SafeResourceUrl | null = null;

  public pdfSrc: any;
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
    } else {
      this.reportService.gedownloadHojaVida(idCapacitador).subscribe((data) => {
        if (data != null) {
          const url = URL.createObjectURL(data);
          this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
      });
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
          alert('Succesful');
          console.log({ hojaVida: data });
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
    this.visible = true;
  }
}
