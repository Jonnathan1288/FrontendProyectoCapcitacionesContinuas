import { Component, OnInit } from '@angular/core';
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
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.idusulogin = localStorage.getItem('id_username');
    this.usuLoginRol = localStorage.getItem('rol');

    this.usuarioService.getUsuarioById(this.idusulogin).subscribe((data) => {
      if (data != null) {
        this.classUsuario = data;
        this.classPersona = this.classUsuario.persona!;

        console.log(this.classUsuario);
        console.log(this.classPersona);

        if (this.classUsuario.persona?.fechaNacimiento) {
          this.classPersona.fechaNacimiento = new Date(
            this.classUsuario.persona?.fechaNacimiento
          );
        }

        // this.esDocenteCapacitador =
        //   this.classUsuario.roles?.nombreRol === 'DocenteCapacitador';

        if (this.usuLoginRol === 'DocenteCapacitador') {
          this.capacitadorService
            .getCapacitadorByUsuarioIdUsuario(
              this.classUsuario.persona!.idPersona!
            )
            .subscribe((data) => {
              if (data != null) {
                this.classCapacitador = data;
              }
            });
        }
      }
    });
  }

  //VISIVILIADA DEL MODAL
  visible?: boolean;

  public showModaL() {
    this.visible = true;
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
        !this.classCapacitador.tipoAbreviaturaTitulo ||
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

    // Verificar si hay campos vacíos

    // Realizar actualización
    this.personaService
      .updatePersona(this.classPersona.idPersona!, this.classPersona)
      .subscribe(
        (data) => {
          if (data != null) {
            this.classUsuario.persona = data;
            this.usuarioService
              .updateUsuario(this.classUsuario.idUsuario!, this.classUsuario)
              .subscribe((data1) => {
                if (data1 != null) {

                 // this.classUsuario = {...data1}
                  console.log({ user: data1 });
                  this.toastrService.success(
                    'Actualización exitosa',
                    '¡Bien hecho!'
                  );

                  if(this.usuLoginRol === 'DocenteCapacitador'){
                    this.capacitadorService
                    .updateCapacitador(
                      this.classCapacitador.idCapacitador!,
                      this.classCapacitador
                    )
                    .subscribe((data2) => {
                      if (data2 != null) {
                        console.log({ capacitador: data2 });
                      }
                    });
                  }else{


                    return;
                  }


                }
              });
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
      alert('La foto es muy pesada');
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
