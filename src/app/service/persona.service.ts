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
    return this.http.get<Persona[]>(environment.apiuri+'/persona/listar');
  }

  public getPersonaById(idPersona: number):Observable<Persona>{
    return this.http.get<Persona>(environment.apiuri+'/persona/findbyId/'+idPersona);
  }

  public updatePersona(idPersona:number, Persona: Persona):Observable<Persona>{
    return this.http.put<Persona>(environment.apiuri+'/persona/actualizar/'+idPersona, Persona);
  }

  //PARA PETICIONES PUBLICAS DE VALIDACIONES--------------------------------------------------------------------------
  
  public savePersona(persona: Persona):Observable<Persona>{
    return this.http.post<Persona>(environment.apiUriSecurity+'/persona/crear', persona);
  }

  public getPersonaByIdentificasion(identificasion: String):Observable<boolean>{
    return this.http.get<boolean>(environment.apiUriSecurity+'/persona/existsbyIdentifcasion/'+identificasion);
  }

  public getPersonaExistsByEmail(email: String):Observable<boolean>{
    return this.http.get<boolean>(environment.apiUriSecurity+'/persona/existsByPersonaCorreo/'+email);
  }

  public verifiqueValidateEmail(email: String):Observable<any>{
    return this.http.get<any>(environment.apiUriSecurity+'/validate-email/'+email);
  }

}
