import { Component } from '@angular/core';
import { LoadScript } from 'src/app/scripts/load-script';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  public isLogginPresent: boolean = false;

  constructor(
    private scriptC: LoadScript,

    // private speech: SpeechRecognitionService
  ) {
    scriptC.Cargar(['header','winner']);
    // this.speech.record('es_ES').subscribe((e) => (this.title = e));
  }
  ngOnInit(): void {}
}
