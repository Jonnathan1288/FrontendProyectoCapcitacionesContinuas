import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { Programa } from '../models/programa';

@Injectable({
  providedIn: 'root'
})
export class ProgramasService {

  constructor(private http: HttpClient) { }
  
  public listPrograma():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/programa/listar');
  }

  public getProgramaById(idPrograma: number):Observable<Programa>{
    return this.http.get<Programa>(environment.apiuri+'/programa/findbyId/'+idPrograma);
  }

  public savePrograma(programa: Programa):Observable<Programa>{
    return this.http.post<Programa>(environment.apiuri+'/programa/crear', programa);
  }

  public updatePrograma(idPrograma:number, programa: Programa):Observable<Programa>{
    return this.http.put<Programa>(environment.apiuri+'/programa/actualizar/'+idPrograma, programa);
  }
}
