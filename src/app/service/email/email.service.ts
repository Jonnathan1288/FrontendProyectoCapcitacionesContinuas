import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailCourseApproved } from 'src/app/util/model/email-course-approved';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  // public sendEmailApprovedCourse(courseApproved: EmailCourseApproved): Observable<boolean> {
  //   return this.http.post<boolean>(environment.apiuri + '/email/sendEmailAprprovedCourse', courseApproved);
  // }

  public sendEmailApprovedCourse(courseApproved: EmailCourseApproved): void {
    this.http.post<boolean>(environment.apiuri + '/email/sendEmailAprprovedCourse', courseApproved)
      .toPromise()
      .then(() => {
        console.log('E éxito');
      })
  }

}
