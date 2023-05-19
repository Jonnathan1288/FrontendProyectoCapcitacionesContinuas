import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Persona } from '../models/persona';
import { environment } from 'src/environment/enviroment';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getListaPersonas():Observable<Persona[]>{
    return this.http.get<Persona[]>(environment.apiuri+'/persona/listar', { headers: this.storageService.returnToken()});
  }

  public savePersona(persona: Persona):Observable<Persona>{
    return this.http.post<Persona>(environment.apiuri+'/persona/crear', persona, { headers: this.storageService.returnToken()});
  }

  public getPersonaById(idPersona: number):Observable<Persona>{
    return this.http.get<Persona>(environment.apiuri+'/persona/findbyId/'+idPersona, { headers: this.storageService.returnToken()});
  }

  public getPersonaByIdentificasion(identificasion: String):Observable<boolean>{
    return this.http.get<boolean>(environment.apiuri+'/persona/existsbyIdentifcasion/'+identificasion, { headers: this.storageService.returnToken()});
  }

  public updatePersona(idPersona:number, Persona: Persona):Observable<Persona>{
    return this.http.put<Persona>(environment.apiuri+'/persona/actualizar/'+idPersona, Persona, { headers: this.storageService.returnToken()});
  }

}
