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

  public listSilaboo():Observable<Silabo[]>{
    return this.http.get<Silabo[]>(environment.apiuri+'/silabo/listar');
  }

  public saveSilabo(silabo: Silabo):Observable<Silabo>{
    return this.http.post<Silabo>(environment.apiuri+'/silabo/crear', silabo);
  }

  public getSilaboById(id_curso: number):Observable<Silabo>{
    return this.http.get<Silabo>(environment.apiuri+'/silabo/findbyId/'+id_curso);
  }
  
  public getSilaboByIdPorCurso(id_curso: number):Observable<Silabo>{
    return this.http.get<Silabo>(environment.apiuri+'/silabo/findbyIdCursoPorSilabo/'+id_curso);
  }
  
  public getsilabooValidacion(idCurso:number){
    return this.http.get<boolean>(environment.apiuri+'/silabo/findbyIdCurso/'+idCurso);
  }
}
