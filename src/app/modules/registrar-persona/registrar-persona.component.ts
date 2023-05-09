import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Persona } from 'src/app/models/persona';
import { Rol } from 'src/app/models/rol';
import { Usuario } from 'src/app/models/usuario';
import { PersonaService } from 'src/app/service/persona.service';
import { RolService } from 'src/app/service/rol.service';
import { UsuarioService } from 'src/app/service/usuario.service';
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

  constructor(
    private router: Router,
    private personaService: PersonaService,
    private rolService: RolService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.obtenerRolParticipante();
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
    this.personaService.savePersona(this.classPersona).subscribe((data) => {
      if (data != null) {
        this.classUsuario.idUsuario = 0;
        this.classUsuario.estadoUsuarioActivo = true;
        // this.classUsuario.rol = this.classRol;
        this.classUsuario.persona = data;
        this.classUsuario.roles = this.listRole;
        console.log(this.classUsuario);
        this.usuarioService
          .saveUsuario(this.classUsuario)
          .subscribe((data1) => {
            if (data1 != null) {
              console.log({ user: data1 });
              alert('succesful');
            }
          });
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
}
