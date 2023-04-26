import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Area } from 'src/app/models/area';
import { Especialidad } from 'src/app/models/especialidad';
import { AreaService } from 'src/app/service/area.service';
import { EspecialidadService } from 'src/app/service/especialidad.service';
@Component({
  selector: 'app-course-register',
  templateUrl: './course-register.component.html',
  styleUrls: ['./course-register.component.css', './course-register.component.scss']
})
export class CourseRegisterComponent {
  public listAreaE: Area[] = [];
  public listEspeciali: Especialidad[] = [];
  constructor(private primengConfig: PrimeNGConfig, private areaService: AreaService, private especialidadService: EspecialidadService) {}

  ngOnInit() {
  this.listArea();
  }

  //Para listar todas las areas..
  public listArea(){
    this.areaService.listArea().subscribe((data)=>{
     this.listAreaE = data;
      console.log(this.listAreaE)
    })
  }

  //Para listar todas las especialidades..
  public listEspecialidad(){
    this.especialidadService.listEspecialidad().subscribe((data)=>{
     this.listEspeciali = data;
      console.log(this.listAreaE)
    })
  }

}
