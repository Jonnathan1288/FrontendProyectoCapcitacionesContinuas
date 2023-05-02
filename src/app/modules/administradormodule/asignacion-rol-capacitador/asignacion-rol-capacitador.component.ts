import { Component, OnInit } from '@angular/core';
import { DocenteFenix } from 'src/app/models/docente-fenix';
import { Persona } from 'src/app/models/persona';
import { Rol } from 'src/app/models/rol';
import { Usuario } from 'src/app/models/usuario';
import { DocenteFenixService } from 'src/app/service/docente-fenix.service';
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

  public listClassUsuario: Usuario[] = [];

  public classDocenteFenix = new DocenteFenix();

  constructor(
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private docenteFenixService: DocenteFenixService
  ) {}
  ngOnInit(): void {}

  //Todos con roles de docente capacitador
  public getodosUsuariocConRolDocenteCapacitador(identificasion: string) {
    this.docenteFenixService
      .getDocenteFenixFindByIdentificasión(identificasion)
      .subscribe((data) => {
        if (data != null) {
          this.classDocenteFenix = data;
        }
      });
  }

  public saveDocenteDocenteCapacitadorRol() {
    if(this.classDocenteFenix.identificacion){
      this.classPersona.identificacion = this.classDocenteFenix.identificacion
    }else{

    }
  }

  //vISIVILIADA DEL MODAL
  visible?: boolean;

  public showModaL() {
    //this.classPeriodoPrograma = new PeriodoPrograma();
    //this.classPrograma = new Programas();
    this.visible = true;
  }
}
