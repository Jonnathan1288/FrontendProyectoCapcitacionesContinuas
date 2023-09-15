import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitador } from 'src/app/models/capacitador';
import { Persona } from 'src/app/models/persona';
import { Rol } from 'src/app/models/rol';
import { Usuario } from 'src/app/models/usuario';
import { CapacitadorService } from 'src/app/service/capacitador.service';
import { PersonaService } from 'src/app/service/persona.service';
import { RolService } from 'src/app/service/rol.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { LoadScript } from 'src/app/scripts/load-script';

@Component({
  selector: 'app-edit-data-user',
  templateUrl: './edit-data-user.component.html',
  styleUrls: ['./edit-data-user.component.css'],
})
export class EditDataUserComponent implements OnInit {
  public classPersona = new Persona();

  public classUsuario = new Usuario();

  public classCapacitador = new Capacitador();

  public idusulogin?: any;

  public usuLoginRol?: any;

  public esDocenteCapacitador = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personaService: PersonaService,
    private rolService: RolService,
    private usuarioService: UsuarioService,
    private capacitadorService: CapacitadorService,
    private toastrService: ToastrService,
    private scriptC: LoadScript
  ) {

    scriptC.Cargar(['ventanas']);

  }

  public persona = new Persona();

  ngOnInit(): void {
    this.idusulogin = localStorage.getItem('id_username');
    this.usuLoginRol = localStorage.getItem('rol');
    this.obtenerDatosUsusario(this.idusulogin);

    if (localStorage.getItem('emp') === 'EMPTY') {
      this.toastrService.info('', 'COMPLETE SU PERFIL DE USUARIO');
    }
  }



  public classCipyCapacitador = new Capacitador();
  public obtenerDatosUsusario(idUsusario: number) {
    this.usuarioService.getUsuarioById(idUsusario).subscribe((data) => {
      if (data != null) {
        this.classUsuario = data;
        this.persona = this.classUsuario.persona!;

        if (this.persona.fechaNacimiento) {
          this.persona.fechaNacimiento = new Date(
            this.persona?.fechaNacimiento
          ); //
        }

        this.persona.etnia =
          this.persona?.etnia!.charAt(0).toUpperCase() +
          this.persona?.etnia!.slice(1).toLowerCase();

        this.classPersona = { ...this.persona }; ///

        if (this.usuLoginRol === 'DocenteCapacitador') {
          this.capacitadorService
            .getCapacitadorByUsuarioIdUsuario(
              this.classUsuario.persona!.idPersona!
            )
            .subscribe((data) => {
              if (data != null) {
                this.classCipyCapacitador = data;
                this.classCapacitador = { ...this.classCipyCapacitador };
              }
            });
        }
      }
    });
  }

  //VISIVILIADA DEL MODAL
  visible?: boolean;

  public showModaL() {
    this.classPersona = { ...this.persona };
    this.classCapacitador = { ...this.classCipyCapacitador };
    console.log(this.classPersona);
    console.log(this.persona);
    this.visible = true;
  }

  reloadPage() {
    this.classPersona = { ...this.persona };
  }

  public editarUsuario() {
    if (this.usuLoginRol === 'DocenteCapacitador') {
      if (
        !this.classUsuario.username ||
        !this.classUsuario.password
      ) {
        this.toastrService.warning(
          'Uno o más campos vacíos',
          'Por favor complete todos los campos'
        );
        return;
      }
    } else {
      if (
        !this.classUsuario.username ||
        !this.classUsuario.password
      ) {
        this.toastrService.warning(
          'Uno o más campos vacíos',
          'Por favor complete todos los campos'
        );
        return;
      }
    }
    this.personaService
      .updatePersona(this.classPersona.idPersona!, this.classPersona)
      .subscribe(
        (data) => {
          if (data != null) {
            this.persona = { ...this.classPersona };

            //this.toastrService.success('Actualización exitosa', '¡Bien hecho!');

            this.usuarioService
              .updateUsuario(this.classUsuario.idUsuario!, this.classUsuario)
              .subscribe((data1) => {
                if (data1 != null) {
                  this.toastrService.success(
                    'Actualización exitosa de los datos',
                    '¡Bien hecho!'
                  );

                  this.persona = { ...this.classPersona };

                  if (this.usuLoginRol === 'DocenteCapacitador') {
                    this.capacitadorService
                      .updateCapacitador(
                        this.classCapacitador.idCapacitador!,
                        this.classCapacitador
                      )
                      .subscribe((data2) => {
                        if (data2 != null) {
                          this.persona = { ...this.classPersona };

                          this.toastrService.success(
                            'Actualización exitosa de Docente Capacitador',
                            '¡Bien hecho!'
                          );
                        }
                      });
                  } else {
                    setTimeout(() => {
                      localStorage.removeItem('emp')
                      localStorage.setItem('emp', String('CHECK'));
                      location.reload();
                    }, 1000);
                    return;
                  }

                  setTimeout(() => {
                    localStorage.removeItem('emp')
                    localStorage.setItem('emp', String('CHECK'));
                    location.reload();
                  }, 1000);
                }
              });

            //Implementacion de la carga
          }
        },
        (error) => {
          console.error(error);
          this.toastrService.error(
            'Error al actualizar los datos',
            'Por favor intenta más tarde'
          );
        }
      );
  }


  public editPersona() {
    if (this.usuLoginRol === 'DocenteCapacitador') {
      if (
        !this.classPersona.identificacion ||
        !this.classPersona.nombre1 ||
        !this.classPersona.nombre2 ||
        !this.classPersona.apellido1 ||
        !this.classPersona.apellido2 ||
        !this.classPersona.fechaNacimiento ||
        !this.classPersona.direccion ||
        !this.classPersona.telefono ||
        !this.classPersona.celular ||
        !this.classPersona.correo ||
        !this.classPersona.genero ||
        !this.classPersona.etnia ||
        !this.classPersona.nivelInstruccion ||
        !this.classCapacitador.tituloCapacitador ||
        !this.classCapacitador.tipoAbreviaturaTitulo
      ) {
        this.toastrService.warning(
          'Uno o más campos vacíos',
          'Por favor complete todos los campos'
        );
        return;
      }
    } else {
      if (
        !this.classPersona.identificacion ||
        !this.classPersona.nombre1 ||
        !this.classPersona.nombre2 ||
        !this.classPersona.apellido1 ||
        !this.classPersona.apellido2 ||
        !this.classPersona.fechaNacimiento ||
        !this.classPersona.direccion ||
        !this.classPersona.telefono ||
        !this.classPersona.celular ||
        !this.classPersona.correo ||
        !this.classPersona.genero ||
        !this.classPersona.etnia ||
        !this.classPersona.nivelInstruccion
      ) {
        this.toastrService.warning(
          'Uno o más campos vacíos',
          'Por favor complete todos los campos'
        );
        return;
      }
    }

    // Verificar si hay campos vacíos

    // Realizar actualización
    this.personaService
      .updatePersona(this.classPersona.idPersona!, this.classPersona)
      .subscribe(
        (data) => {
          if (data != null) {
            this.persona = { ...this.classPersona };

            //this.toastrService.success('Actualización exitosa', '¡Bien hecho!');

            this.usuarioService
              .updateUsuario(this.classUsuario.idUsuario!, this.classUsuario)
              .subscribe((data1) => {
                if (data1 != null) {
                  this.toastrService.success(
                    'Actualización exitosa de los datos',
                    '¡Bien hecho!'
                  );

                  this.persona = { ...this.classPersona };

                  if (this.usuLoginRol === 'DocenteCapacitador') {
                    this.capacitadorService
                      .updateCapacitador(
                        this.classCapacitador.idCapacitador!,
                        this.classCapacitador
                      )
                      .subscribe((data2) => {
                        if (data2 != null) {
                          this.persona = { ...this.classPersona };

                          this.toastrService.success(
                            'Actualización exitosa de Docente Capacitador',
                            '¡Bien hecho!'
                          );
                        }
                      });
                  } else {
                    setTimeout(() => {
                      localStorage.removeItem('emp')
                      localStorage.setItem('emp', String('CHECK'));
                      location.reload();
                    }, 1000);
                    return;
                  }

                  setTimeout(() => {
                    localStorage.removeItem('emp')
                    localStorage.setItem('emp', String('CHECK'));
                    location.reload();
                  }, 1000);
                }
              });

            //Implementacion de la carga
          }
        },
        (error) => {
          console.error(error);
          this.toastrService.error(
            'Error al actualizar los datos',
            'Por favor intenta más tarde'
          );
        }
      );
  }

  async subirFoto(event: any) {
    const file = event.target.files[0];
    const fileSize = file.size; // tamaño en bytes
    if (fileSize > 262144) {
      // alert('La foto es muy pesada');
      this.toastrService.error(
        '',
        'La foto es muy pesada.'
      );
      event.target.value = null;
    } else {
      try {
        this.classUsuario.fotoPerfil = await this.convertToBase64(file);
      } catch (error) {
        console.error(error);
      }
    }
  }

  //Conversion de la imagen en base 64
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

}
