import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { CourseFilter } from 'src/app/models/references/course-filter';
import { CodeExel } from 'src/app/interface/code-exel';

@Injectable({
  providedIn: 'root'
})
export class ReduceDataService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getFinallyCourses(): Observable<CourseFilter[]> {
    return this.http.get<CourseFilter[]>(environment.apiuri + '/course/findAll/course/finally', { headers: this.storageService.returnToken() });
  }

  // PARA LOS DOCUMENTOS DE EXEL..
  public getFinByAllUserAdminLoggin(idUser: number): Observable<CodeExel[]> {
    return this.http.get<CodeExel[]>(environment.apiuri + '/codeExcel/findbyUserId/' + idUser, { headers: this.storageService.returnToken() });
  }

  public saveCodesExelDocument(data: CodeExel): Observable<CodeExel> {
    return this.http.post<CodeExel>(environment.apiuri + '/codeExcel/save', data, { headers: this.storageService.returnToken() });
  }

}
