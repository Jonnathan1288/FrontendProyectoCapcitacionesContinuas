import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Silabo } from '../models/silabo';
import { environment } from 'src/environment/enviroment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SilaboService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listSilaboo():Observable<Silabo[]>{
    return this.http.get<Silabo[]>(environment.apiuri+'/silabo/listar', { headers: this.storageService.returnToken()});
  }

  public saveSilabo(silabo: Silabo):Observable<Silabo>{
    return this.http.post<Silabo>(environment.apiuri+'/silabo/crear', silabo, { headers: this.storageService.returnToken()});
  }

  public getSilaboById(id_curso: number):Observable<Silabo>{
    return this.http.get<Silabo>(environment.apiuri+'/silabo/findbyId/'+id_curso, { headers: this.storageService.returnToken()});
  }
  
  public getSilaboByIdPorCurso(id_curso: number):Observable<Silabo>{
    return this.http.get<Silabo>(environment.apiuri+'/silabo/findbyIdCursoPorSilabo/'+id_curso, { headers: this.storageService.returnToken()});
  }
  
  public getsilabooValidacion(idCurso:number){
    return this.http.get<boolean>(environment.apiuri+'/silabo/findbyIdCurso/'+idCurso, { headers: this.storageService.returnToken()});
  }
}
