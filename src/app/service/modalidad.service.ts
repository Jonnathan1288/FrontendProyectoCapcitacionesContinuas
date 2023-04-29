import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { ModalidadCurso } from '../models/modalidad-curso';

@Injectable({
  providedIn: 'root'
})
export class ModalidadService {

  constructor(private http: HttpClient) { }

  public listModalidadCurso():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/modalidadCurso/list');
  }

  public getModalidadCursoById(idModalidad: number):Observable<ModalidadCurso>{
    return this.http.get<ModalidadCurso>(environment.apiuri+'/modalidadCurso/findbyId/'+idModalidad);
  }

  public saveModalidadCurso(modalidadCurso: ModalidadCurso):Observable<ModalidadCurso>{
    return this.http.post<ModalidadCurso>(environment.apiuri+'/modalidadCurso/save', modalidadCurso);
  }

  public updateModalidadCurso(idModalidadCurso:number, modalidadCurso: ModalidadCurso):Observable<ModalidadCurso>{
    return this.http.put<ModalidadCurso>(environment.apiuri+'/modalidadCurso/actualizar/'+idModalidadCurso, modalidadCurso);
  }

}
