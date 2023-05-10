import { Component, OnInit } from '@angular/core';
import { LoadScript } from 'src/app/scripts/load-script';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  constructor(
    private scriptC: LoadScript,
    // private speech: SpeechRecognitionService
  ) {
    scriptC.Cargar(['header']);
    // this.speech.record('es_ES').subscribe((e) => (this.title = e));
  }
  ngOnInit(): void {}
}
