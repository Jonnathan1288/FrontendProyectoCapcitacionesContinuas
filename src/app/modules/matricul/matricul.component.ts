import { Component } from '@angular/core';
import { Curso } from 'src/app/models/curso';
import { Inscrito} from 'src/app/models/inscrito';
import { Usuario } from 'src/app/models/usuario';
import { inscritosService } from 'src/app/service/inscritos.service';

@Component({
  selector: 'app-matricul',
  templateUrl: './matricul.component.html',
  styleUrls: ['./matricul.component.css']
})
export class MatriculComponent {
  
  estadoInscritoActivo: boolean=true;
  estadoInscrito: boolean=true;
  fechaInscrito:Date=new Date();
  curso: Curso = new Curso();
  usuario: Usuario = new Usuario();
  constructor(private inscritosService: inscritosService) {}


  onSaveMatricula() {
    const matricula=new Inscrito() 
      matricula.estadoInscritoActivo = this.estadoInscritoActivo;
      matricula.estadoInscrito = this.estadoInscrito;
      matricula.fechaInscrito = this.fechaInscrito;

      if (matricula.curso && matricula.usuario) {
        const idCurso = matricula.curso.idCurso;
        const idUsuario = matricula.usuario.idUsuario;
        console.log(`ID del curso: ${idCurso}, ID del usuario: ${idUsuario}`);
      } else {
        console.error('El objeto "curso" o "usuario" es nulo o indefinido');
      }
     
    this.inscritosService.savematricula(matricula).subscribe(
      response => {
        console.log('La matrícula se guardó exitosamente:', response);
      },
      error => {
        console.error('Ocurrió un error al guardar la matrícula:', error);
      }
    );
  }







}
