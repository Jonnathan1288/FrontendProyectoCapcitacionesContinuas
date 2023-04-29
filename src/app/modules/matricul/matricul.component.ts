import { Component } from '@angular/core';
import { Curso } from 'src/app/models/curso';
import { DetalleFichaMatricula } from 'src/app/models/detalle-ficha-matricula';
import { FichaMatricula } from 'src/app/models/fichaMatricula';
import { Inscrito} from 'src/app/models/inscrito';
import { Usuario } from 'src/app/models/usuario';
import { DetalleFichaService } from 'src/app/service/detalle-ficha.service';
import { FichaMatriculaService } from 'src/app/service/ficha-matricula.service';
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
  inscrito: Inscrito={};
  fichaMatricula: FichaMatricula = {};
  respuestaPregunta1:string='';
  respuestaPregunta2:string='';
  respuestaPregunta3:string='';
  respuestaPregunta4:string='';
  respuestaPregunta5:string='';
  respuestaPregunta6:string='';
  respuestaPregunta7:string='';
  respuestaPregunta8:string='';
  respuestaPregunta9:string='';



  constructor(private inscritosService: inscritosService,private fichaMatriculaService: FichaMatriculaService, private detalleFichaService: DetalleFichaService) {}


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

 
  guardarfichaMa() {
    this.fichaMatriculaService
      .savefichamatricula(this.fichaMatricula, this.inscrito)
      .subscribe((fichaMatricula) => {
        console.log('Ficha de matrícula guardada:', fichaMatricula);
      });
  }


  guardarDetalleFichaMatricula(): void {
    const detalleFichaMatricula: DetalleFichaMatricula = {
      pregunta1: this.respuestaPregunta1,
      pregunta2: this.respuestaPregunta2,
      pregunta3: this.respuestaPregunta3,
      pregunta4: this.respuestaPregunta4,
      pregunta5: this.respuestaPregunta5,
      pregunta6: this.respuestaPregunta6,
      pregunta7: this.respuestaPregunta7,
      pregunta8: this.respuestaPregunta8,
      pregunta9: this.respuestaPregunta9,
      fichaMatricula: this.fichaMatricula // Asignamos la ficha matrícula relacionada
    };
  
    this.detalleFichaService.guardarDetalleFichaMatricula(detalleFichaMatricula)
      .subscribe(respuesta => {
        console.log(respuesta);
        // Hacer algo en caso de éxito
      }, error => {
        console.error(error);
        // Hacer algo en caso de error
      });
  }





  







}
