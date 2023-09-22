import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { CourseFilter } from 'src/app/models/references/course-filter';

@Injectable({
  providedIn: 'root'
})
export class ReduceDataService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getFinallyCourses(): Observable<CourseFilter[]> {
    return this.http.get<CourseFilter[]>(environment.apiuri + '/course/findAll/course/finally', { headers: this.storageService.returnToken() });
  }

}
