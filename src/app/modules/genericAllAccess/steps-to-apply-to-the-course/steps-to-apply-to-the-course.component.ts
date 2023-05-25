import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-steps-to-apply-to-the-course',
  templateUrl: './steps-to-apply-to-the-course.component.html',
  styleUrls: ['./steps-to-apply-to-the-course.component.css'],
})
export class StepsToApplyToTheCourseComponent {
  imageUrl: SafeResourceUrl;
  imageUrl2: SafeResourceUrl;
  imageUrl3: SafeResourceUrl;
  imageUrl4: SafeResourceUrl;
  imageUrl5: SafeResourceUrl;
  imageUrl6: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) {
    const imagePath = 'assets/img/steps/paso1.png'; // Ruta de la imagen
    this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);

    const imagePath2 = 'assets/img/steps/paso2.png'; // Ruta de la imagen
    this.imageUrl2 = this.sanitizer.bypassSecurityTrustResourceUrl(imagePath2);

    const imagePath3 = 'assets/img/steps/paso3.png'; // Ruta de la imagen
    this.imageUrl3 = this.sanitizer.bypassSecurityTrustResourceUrl(imagePath3);

    const imagePath4 = 'assets/img/steps/paso4.png'; // Ruta de la imagen
    this.imageUrl4 = this.sanitizer.bypassSecurityTrustResourceUrl(imagePath4);

    const imagePath5 = 'assets/img/steps/paso5.png'; // Ruta de la imagen
    this.imageUrl5 = this.sanitizer.bypassSecurityTrustResourceUrl(imagePath5);

    const imagePath6 = 'assets/img/steps/paso6.png'; // Ruta de la imagen
    this.imageUrl6 = this.sanitizer.bypassSecurityTrustResourceUrl(imagePath6);
  }
}
