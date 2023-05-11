import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EstudianteFenix } from 'src/app/models/estudiante-fenix';
import { Persona } from 'src/app/models/persona';
import { Rol } from 'src/app/models/rol';
import { Usuario } from 'src/app/models/usuario';
import { EstudianteFenixService } from 'src/app/service/estudiante-fenix.service';
import { PersonaService } from 'src/app/service/persona.service';
import { RolService } from 'src/app/service/rol.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { ToastrService } from 'ngx-toastr';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-persona',
  templateUrl: './registrar-persona.component.html',
  styleUrls: ['./registrar-persona.component.css'],
})
export class registrarPersonaComponent implements OnInit {
  public classPersona = new Persona();

  public classRol = new Rol();

  public classUsuario = new Usuario();

  public listRole: Rol[] = [];

  public classEstudianteFenix = new EstudianteFenix();

  constructor(
    private router: Router,
    private personaService: PersonaService,
    private rolService: RolService,
    private usuarioService: UsuarioService,
    private estudianteService: EstudianteFenixService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerRolParticipante();
  }

  public visibleEstudinateIsta?: boolean = false;
  public modalViewEstudianteISTA() {
    this.classEstudianteFenix = new EstudianteFenix();
    this.estudianteISTAFind = false;
    this.classPersona = new Persona();
    this.classUsuario = new Usuario();
    this.visibleEstudinateIsta = true;
  }

  //BANDERA 
  public estudianteISTAFind: boolean = false;
  public findEstudianteISTAFenix(e: any) {
    let letter = e.target.value;
    if (letter.length == 10) {
      this.getEstudianteISTAFindByIdentificasion(letter);
    }else{
      this.classEstudianteFenix = new EstudianteFenix();
      this.estudianteISTAFind = false;
      this.classPersona = new Persona();
    }
  }

  public getEstudianteISTAFindByIdentificasion(identificasion: string) {
    this.estudianteService
      .getEstudianteFenixFindByIdentificasión(identificasion)
      .subscribe(
        (data) => {
          if (data != null) {
            this.toastrService.success(
              'Su información a sido encontrada.',
              'ESTUDIANTE ENCONTRADO.'
            );
            this.classEstudianteFenix = data;
            this.estudianteISTAFind = true;
          }
        },
        (err) => {
          this.toastrService.error(
            'Lamentamos su infomración no fue encontrada.',
            'ESTUDIANTE NO ENCONTRADO.'
          );
        }
      );
  }

  public obtenerRolParticipante() {
    this.rolService.getRolById(3).subscribe((data) => {
      if (data != null) {
        this.classRol = data;
        this.listRole.push(this.classRol);
      }
    });
  }

  public savePersona() {
    if (this.classEstudianteFenix.identificacion) {
      if (!this.classUsuario.username || !this.classUsuario.username) {
        this.toastrService.error(
          'Debe ingresar usuario y contraseña',
          'CREDENCIALES VACIAS.'
        );
      } else {

        this.personaService
          .getPersonaByIdentificasion(this.classEstudianteFenix.identificacion)
          .subscribe((data) => {
            if (data !== true) {
              this.usuarioService
                .getExistUsuarioByUsername(this.classUsuario?.username!)
                .subscribe((data1) => {
                  if (data1 !== true) {
                    this.classPersona.identificacion =
                      this.classEstudianteFenix.identificacion;
                    this.classPersona.nombre1 =
                      this.classEstudianteFenix.nombre1;
                    this.classPersona.nombre2 =
                      this.classEstudianteFenix.nombre2;
                    this.classPersona.apellido1 =
                      this.classEstudianteFenix.apellido1;
                    this.classPersona.apellido2 =
                      this.classEstudianteFenix.apellido2;
                    this.classPersona.fechaNacimiento =
                      this.classEstudianteFenix.fechaNacimiento;
                    this.classPersona.correo = this.classEstudianteFenix.correo;
                    this.classPersona.direccion =
                      this.classEstudianteFenix.direccion;
                    this.classPersona.celular =
                      this.classEstudianteFenix.celular;
                    this.classPersona.telefono =
                      this.classEstudianteFenix.telefono;
                    this.classPersona.genero =
                      this.classEstudianteFenix.genero?.charAt(0) || '';
                    this.classPersona.etnia = this.classEstudianteFenix.etnia;

                    //PROCESO DE ENVIO DE LA INFORMACIÓN
                    this.personaService
                      .savePersona(this.classPersona)
                      .subscribe((data) => {
                        if (data != null) {
                          this.classUsuario.idUsuario = 0;
                          this.classUsuario.estadoUsuarioActivo = true;
                          this.classUsuario.persona = data;
                          this.classUsuario.roles = this.listRole;
                          console.log(this.classUsuario);
                          this.usuarioService
                            .saveUsuario(this.classUsuario)
                            .subscribe((data1) => {
                              if (data1 != null) {
                                console.log({ user: data1 });
                                this.toastrService.success(
                                  'Información guardada en el sistema.',
                                  'REGISTRO SATISFACTORIO.'
                                );
                                setTimeout(() => {
                                  window.location.reload();
                                  location.replace('/login');
                                }, 1500);
                              }
                            });
                        }
                      });
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
      //END---------------------------------------
    } else {
      this.validarDatosPersona();
      // this.personaService.savePersona(this.classPersona).subscribe((data) => {
      //   if (data != null) {
      //     this.classUsuario.idUsuario = 0;
      //     this.classUsuario.estadoUsuarioActivo = true;
      //     // this.classUsuario.rol = this.classRol;
      //     this.classUsuario.persona = data;
      //     this.classUsuario.roles = this.listRole;
      //     console.log(this.classUsuario);
      //     this.usuarioService
      //       .saveUsuario(this.classUsuario)
      //       .subscribe((data1) => {
      //         if (data1 != null) {
      //           console.log({ user: data1 });
      //           alert('succesful');
      //         }
      //       });
      //   }
      // });
    }
  }



  public validarDatosPersona(){
    // public savePersona(){
      if (!this.classPersona?.identificacion || !this.classPersona?.nombre1 || !this.classPersona?.nombre2 ||
        !this.classPersona?.apellido1 || !this.classPersona?.apellido2 ||
        !this.classPersona?.telefono || !this.classPersona?.celular ||
        !this.classPersona?.fechaNacimiento || !this.classPersona?.correo ||
        !this.classUsuario?.username || !this.classUsuario?.password) {
  
          this.toastrService.warning(
            'Llene todos los campos.',
            'Uno o más campos vacios.'
          );
      } else {
        if (this.classUsuario?.password?.length !> 8) {
          this.comprobaridentificacion();
        } else 
          {
            this.toastrService.warning(
            'Contrasenia  Invalida.',
            'La contrasenia debe tener minimo 8 caracteres.'
          );
        }
      }
    // }
  }


  public comprobaridentificacion (){
    this.personaService
    .getPersonaByIdentificasion(this.classPersona?.identificacion!)
    .subscribe((data)=> {
      if (data !== true) {
        this.usuarioService
        .getExistUsuarioByUsername(this.classUsuario?.username!)
        .subscribe((data1)=>{
          if (data1 !== true ) {
            //Servicio
            //Guardar persona
            this.personaService
            .savePersona(this.classPersona)
            .subscribe((data)=>{
              if (data !== null) {
                this.classUsuario.estadoUsuarioActivo=true;
                this.classUsuario.idUsuario = 0;
                this.classUsuario.persona = data;
                this.classUsuario.roles = this.listRole;
                //Guardar usuario
                this.usuarioService
                .saveUsuario(this.classUsuario)
                .subscribe((data1) => {
                  if (data1 !== null) {
                    this.toastrService.success(
                      'Registro exitoso.'
                    );
                    this.classPersona = new Persona();
                    this.classUsuario = new Usuario();
                  }
                });
              }
            });
          }else{
            this.toastrService.error(
              'El nombre de usuario ya esta en el siistema.',
              'Ingrese otro nombre de usuario.'
            );
          }
        });
      }else{
        this.toastrService.error(
          'La identificasión ya esta en el sistema.',
          'Identificasión existente'
        );
      }
    });
  }



  //Almacenar en el objeto
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


  //LOCATION RELOAD
  reloadPage() {
    location.reload();
  }
}
