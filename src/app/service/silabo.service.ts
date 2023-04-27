import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Silabo } from '../models/silabo';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class SilaboService {

  constructor(private http: HttpClient) { }

  public listListaNecesidadCurso():Observable<Silabo[]>{
    return this.http.get<Silabo[]>(environment.apiuri+'/silabo/list');
  }

  public saveListaNecesidadCurso(silabo: Silabo):Observable<Silabo>{
    return this.http.post<Silabo>(environment.apiuri+'/silabo/save', silabo);
  }

  public getCursoById(id_curso: number):Observable<Silabo>{
    return this.http.get<Silabo>(environment.apiuri+'/silabo/findbyId/'+id_curso);
  }
  
}
