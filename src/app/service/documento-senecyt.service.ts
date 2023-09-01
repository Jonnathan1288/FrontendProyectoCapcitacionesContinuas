import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { DocumentoSenecyt } from '../models/documento-senecyt';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentoSenecytService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listDocumentoSenecyt(): Observable<DocumentoSenecyt[]> {
    return this.http.get<DocumentoSenecyt[]>(environment.apiuri + '/documentosenecyt/list');
  }

  public getDocumentoSenecytById(idDocumentoSenecyt: number): Observable<DocumentoSenecyt> {
    return this.http.get<DocumentoSenecyt>(environment.apiuri + '/documentosenecyt/findbyId/' + idDocumentoSenecyt);
  }

  public saveDocumentoSenecyt(documentoSenecyt: DocumentoSenecyt): Observable<DocumentoSenecyt> {
    return this.http.post<DocumentoSenecyt>(environment.apiuri + '/documentosenecyt/save', documentoSenecyt);
  }

  public updateDocumentoSenecyt(idDocumentoSenecyt: number, documentoSenecyt: DocumentoSenecyt): Observable<DocumentoSenecyt> {
    return this.http.put<DocumentoSenecyt>(environment.apiuri + '/documentosenecyt/update/' + idDocumentoSenecyt, documentoSenecyt);
  }


}
