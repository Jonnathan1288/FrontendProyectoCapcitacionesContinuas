import { Component, OnInit } from '@angular/core';

import { FieldsetModule } from 'primeng/fieldset';
import { LoadScript } from 'src/app/scripts/load-script';

@Component({
  selector: 'app-curricular',
  templateUrl: './curricular-diseño.component.html',
  styleUrls: ['./curricular-diseño.component.css']
})
export class CurricularDiseñoComponent implements OnInit {
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  constructor(
    private _CargarScript: LoadScript,

  ) {
    _CargarScript.Cargar(["curricular-diseño-register"]);
  }
  items = [
    { label: 'Item 1', value: 'item1' },
    { label: 'Item 2', value: 'item2' },
    { label: 'Item 3', value: 'item3' }
  ];
  selectedItem: any;
  

}
