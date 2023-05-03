import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { RegistroFotograficoCurso } from 'src/app/models/registro-fotografico-curso';
import { CursoService } from 'src/app/service/curso.service';
import { RegistroFotograficoCursoService } from 'src/app/service/registro-fotografico-curso.service';

@Component({
  selector: 'app-registro-fotografico-evidencias',
  templateUrl: './registro-fotografico-evidencias.component.html',
  styleUrls: ['./registro-fotografico-evidencias.component.css'],
})
export class RegistroFotograficoEvidenciasComponent implements OnInit {

  //entidad de registro fotografico
  public registroFotografico = new RegistroFotograficoCurso();

  public curso= new Curso();

  //idCurso para el cual nos servira para hacer el guardado de la informacion.
  public idCursoRouter?: number;

  constructor(private registroFotograficoService: RegistroFotograficoCursoService, private actiRouter: ActivatedRoute, private cursoService: CursoService) {}
  ngOnInit(): void {
    this.actiRouter.params.subscribe((params) => {
      const id_curso = params['id'];
      this.obtenerCursoPorId(id_curso);
    });
  }

  //Método para traer el curso por la id que ingresa
  public obtenerCursoPorId(idCurso: number){
    this.cursoService.getCursoById(idCurso).subscribe((data)=>{
      if(data != null){
        this.curso = data;
      }
    })
  }


  public saveEvidenciasRegistrofotografico(){

    this.registroFotografico.curso = this.curso;
    this.registroFotograficoService.saveRegistroFotograficoCurso(this.registroFotografico).subscribe((data)=>{
      if(data != null){
        alert('fuccesful')
      }
    })
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
        this.registroFotografico.foto = await this.convertToBase64(file);
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
