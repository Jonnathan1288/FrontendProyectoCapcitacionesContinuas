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
    this.nivelComplejidad = '';
    this.visibleEstudinateIsta = true;
  }

  //BANDERA
  public estudianteISTAFind: boolean = false;
  public findEstudianteISTAFenix(e: any) {
    let letter = e.target.value;
    if (letter.length == 10) {
      this.getEstudianteISTAFindByIdentificasion(letter);
    } else {
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
        console.log(data)
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
        if (
          this.classUsuario?.password!.length >= 8 &&
          /[a-z]/.test(this.classUsuario?.password!) &&
          /[A-Z]/.test(this.classUsuario?.password!) &&
          /\d/.test(this.classUsuario?.password!) &&
          /[@$!%*?&]/.test(this.classUsuario?.password!)
        ) {
          //
          this.personaService
            .getPersonaByIdentificasion(
              this.classEstudianteFenix.identificacion
            )
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
                      this.classPersona.correo =
                        this.classEstudianteFenix.correo;
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
          //
        } else if (this.classUsuario?.password!.length >= 6) {
          this.toastrService.warning(
            'La cotraseña debe ser fuerte.',
            'PASSWORD MODERADA.'
          );
        } else {
          this.toastrService.error(
            'La seguridad de la contraseña no es aceptado por el sistema.',
            'PASSWORD DEVIL.'
          );
        }
      }
      //END---------------------------------------
    } else {
      this.validarDatosPersona();
    }
  }

  public validarDatosPersona() {
    // public savePersona(){
    if (
      !this.classPersona?.identificacion ||
      !this.classPersona?.nombre1 ||
      !this.classPersona?.nombre2 ||
      !this.classPersona?.apellido1 ||
      !this.classPersona?.apellido2 ||
      !this.classPersona?.telefono ||
      !this.classPersona?.celular ||
      !this.classPersona?.fechaNacimiento ||
      !this.classPersona?.correo ||
      !this.classPersona?.genero ||
      !this.classPersona?.etnia ||
      !this.classPersona?.nivelInstruccion ||
      !this.classUsuario?.username ||
      !this.classUsuario?.fotoPerfil ||
      !this.classUsuario?.password
    ) {
      this.toastrService.warning(
        'Llene todos los campos.',
        'Uno o más campos vacios.'
      );
    } else {
      if (this.classPersona?.identificacion.length < 10) {
        this.toastrService.error(
          'La identificación no es invalida, verifique la longitud y los parametros.',
          'IDENTIFICACIÓN INVALIDA.'
        );
        return;
      }

      if (
        this.classUsuario?.password.length >= 8 &&
        /[a-z]/.test(this.classUsuario?.password) &&
        /[A-Z]/.test(this.classUsuario?.password) &&
        /\d/.test(this.classUsuario?.password) &&
        /[@$!%*?&]/.test(this.classUsuario?.password)
      ) {
        this.comprobaridentificacion(); // paso de la validacion de la contraseña..
      } else if (this.classUsuario?.password.length >= 6) {
        this.toastrService.warning(
          'La cotraseña debe ser fuerte.',
          'PASSWORD MODERADA.'
        );
      } else {
        this.toastrService.error(
          'La seguridad de la contraseña no es aceptado por el sistema.',
          'PASSWORD DEVIL.'
        );
      }
    }
    // }
  }

  private successToast: any; // Variable para almacenar la referencia al toastr

  public estadoEmailVerfication?: String = '';

  public comprobaridentificacion() {
    this.showSuccessToast(); // Mostrar el toastr de éxito

    this.personaService
      .getPersonaByIdentificasion(this.classPersona?.identificacion!)
      .subscribe((data) => {
        if (data !== true) {
          this.usuarioService
            .getExistUsuarioByUsername(this.classUsuario?.username!)
            .subscribe((data1) => {
              if (data1 !== true) {
                //validamos el correo electronico del usuario
                this.personaService.getPersonaExistsByEmail(this.classPersona?.correo!).subscribe((data2)=>{
                  if(data2 !== true){
                    // this.clearSuccessToast(); // Ocultar el toastr de éxito
                    this.saveDataPersonUser();
                    // if(this.classPersona?.correo !== this.estadoEmailVerfication){
                    
                      // this.personaService.verifiqueValidateEmail(this.classPersona?.correo!).subscribe((data3)=>{
                      //   if(data3.status === 'valid'){
                      //     this.estadoEmailVerfication = '';
                      //     this.saveDataPersonUser();
                      //   }
                      //   if(data3.status === 'invalid'){
                      //     this.clearSuccessToast(); // Ocultar el toastr de éxito
                      //     this.toastrService.error('Por favor ingresa un correo electrónico válido.', 'Correo inválido.', {
                      //       timeOut: 1500
                      //     });
                      //     this.estadoEmailVerfication = this.classPersona?.correo!
                      //     return;
                      //   }

                      // },(err)=>{
                      //   this.clearSuccessToast(); // Ocultar el toastr de éxito
                      //   this.toastrService.warning('Fin del plan..', 'PLAN AGOTADO', {
                      //     timeOut: 500
                      //   });
                      //   //en el caso de que el plan de verificasion se agote.. se manda de una ejecutar el metodo de crear
                      //   this.saveDataPersonUser();
                      // })

                    // }else{
                    //   this.clearSuccessToast(); // Ocultar el toastr de éxito
                    //   this.toastrService.error('Por favor ingresa un correo electrónico válido..', 'Correo inválido.', {
                    //     timeOut: 1500
                    //   });
                    //   return;
                    // }
                      

                  }else{
                    // this.clearSuccessToast(); // Ocultar el toastr de éxito
                    this.clearSuccessToast(); // Ocultar el toastr de éxito
                    this.toastrService.error('Ingrese otro correo electrónico.', 'Correo existente.', {
                      timeOut: 1500
                    });
                  }
                })

                
              } else {
                this.clearSuccessToast(); // Ocultar el toastr de éxito
                this.toastrService.error(
                  'El nombre de usuario ya esta en el sistema.',
                  'Ingrese otro nombre de usuario.'
                );
              }
            });
        } else {
          this.clearSuccessToast(); // Ocultar el toastr de éxito
          this.toastrService.error(
            'La identificación ya esta en el sistema.',
            'Identificación existente.'
          );
        }
      });
  }

  public saveDataPersonUser(){
    //Guardar persona inicio
    this.personaService
    .savePersona(this.classPersona)
    .subscribe((data) => {
      if (data !== null) {
        this.classUsuario.estadoUsuarioActivo = true;
        this.classUsuario.idUsuario = 0;
        this.classUsuario.persona = data;
        this.classUsuario.roles = this.listRole;

        console.log("before")
        // console.log(this.classUsuario)
        //Guardar usuario
        this.usuarioService
          .saveUsuario(this.classUsuario)
          .subscribe((data1) => {
            if (data1 !== null) {
              console.log("after")
              // console.log(data1)
              this.clearSuccessToast(); // Ocultar el toastr de éxito
              this.toastrService.success('Registro exitoso.', '', {timeOut: 500} );
              this.classPersona = new Persona();
              this.classUsuario = new Usuario();
              this.router.navigate(['/login']);
            }
          });
      }
    });
    //fin
  }

  private showSuccessToast() {
    this.successToast = this.toastrService.success  ('Esperenos un momento mientras verificamos la información.', 'Validando datos', {
      timeOut: 30000, // Establecer timeOut a 0 para que el toastr no se cierre automáticamente
      progressBar: true,
      progressAnimation: 'increasing',
    });
  }
  
  private clearSuccessToast() {
    this.toastrService.clear(this.successToast.toastId); // Oculta el toastr utilizando el ID de referencia
  }

  //Almacenar en el objeto
  async subirFoto(event: any) {
    const file = event.target.files[0];
    const fileSize = file.size; // tamaño en bytes
    if (fileSize > 262144) {
      this.toastrService.error('La foto es muy pesada.', 'FOTO PESADA.');
      // alert('La foto es muy pesada');
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
    location.replace('/welcome');
  }

  nivelComplejidad?: string;
  nivelComplejidadClass?: string;

  calcularNivelComplejidad() {
    const contraseña = this.classUsuario.password!;

    // Calcula el nivel de complejidad basado en ciertos criterios
    if (
      contraseña.length >= 8 &&
      /[a-z]/.test(contraseña) &&
      /[A-Z]/.test(contraseña) &&
      /\d/.test(contraseña) &&
      /[@$!%*?&]/.test(contraseña)
    ) {
      this.nivelComplejidad = 'La contraseña es fuerte';
      this.nivelComplejidadClass = 'strong';
    } else if (contraseña.length >= 6) {
      this.nivelComplejidad = 'La contraseña es moderado';
      this.nivelComplejidadClass = 'moderate';
    } else {
      this.nivelComplejidad = 'La contraseña es débil';
      this.nivelComplejidadClass = 'weak';
    }
  }
}

