import { Component, OnInit } from '@angular/core';
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

  constructor(
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private docenteFenixService: DocenteFenixService,
    private capacitadorService: CapacitadorService,
    private hojadeVidaServcie: HojaVidaCapacitadorService
  ) {}
  ngOnInit(): void {
    this.listDocentesCapacitadores();
    this.obtenerRol();
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
    this.classCapacitador = { ...docenteCapacitador };
    this.classUsuario = this.classCapacitador.usuario!;
    this.classPersona = this.classCapacitador.usuario?.persona!;
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

  //Metodo para actualizar al docente Capacitador
  public updateDocenteCapacitador() {
    console.log({ persona: this.classPersona });
    this.personaService
      .updatePersona(this.classPersona.idPersona!, this.classPersona)
      .subscribe((data) => {
        if (data != null) {
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
          this.classUsuario.rol = this.classRol;
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
          this.classUsuario.rol = this.classRol;
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
    this.hojadeVidaServcie
      .getHojaVidaCapacitadorByIdCapacitador(idCapacitador)
      .subscribe((data) => {
        if (data != null) {
          this.classHojaDevida = data;
          this.visibleHojaVida = true;
        }
      });
    
  }

  //Validar hoja de vida.
  public validarHojaDeVida(estado: number) {
    if(estado == 1){
      this.classHojaDevida.estadoAprobacion = 'A'
    }else{
      this.classHojaDevida.estadoAprobacion = 'R'
    }
    console.log({hojaVida: this.classHojaDevida})
    this.hojadeVidaServcie.updateHojaDeVida(this.classHojaDevida.idHojaVida!, this.classHojaDevida).subscribe((data)=>{
      if(data != null){
        alert('Succesful')
        console.log({hojaVida: data})
      }
    })
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
