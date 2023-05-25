import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Capacitador } from 'src/app/models/capacitador';
import { HojaVidaCapacitador } from 'src/app/models/hoja-vida-capacitador';
import { Persona } from 'src/app/models/persona';
import { CapacitadorService } from 'src/app/service/capacitador.service';
import { HojaVidaCapacitadorService } from 'src/app/service/hoja-vida-capacitador.service';

@Component({
  selector: 'app-disenio-hoja-vida',
  templateUrl: './disenio-hoja-vida.component.html',
  styleUrls: ['./disenio-hoja-vida.component.css']
})
export class DisenioHojaVidaComponent implements OnInit{
  
  // CAP ID POR COMPONENTE
  @Input() idCapacitadorGlobal2?: number;

  constructor(
    private actiRouter: ActivatedRoute,
    private hojaVidaService: HojaVidaCapacitadorService,
    private capcitadporService: CapacitadorService,
  ){
  }

  idCapacitadorGlobal?:number;
  ngOnInit(): void {
    this.actiRouter.params.subscribe((params) => {
      const idCaacitadorG = params['id'];
      this.idCapacitadorGlobal = idCaacitadorG;
      console.log("El id que llega ->" + this.idCapacitadorGlobal);
      this.obtenerDatosCapacitadorAndHojaVida();
    });
  }

  capacitador: Capacitador = new Capacitador();
  hojaVida: HojaVidaCapacitador = new HojaVidaCapacitador();
  public obtenerDatosCapacitadorAndHojaVida():void{

    if (this.idCapacitadorGlobal == null) {
      console.log("NO tiene id pero si por el modo admin -> " + this.idCapacitadorGlobal2);
      this.capcitadporService.getCapacitadorById(this.idCapacitadorGlobal2!).subscribe(
        data =>{
          this.capacitador = data;
          this.capacitador.tituloCapacitador;
          this.hojaVidaService.getHojaVidaCapacitadorByIdCapacitador(this.capacitador.idCapacitador!).subscribe(
            data2 =>{
              this.hojaVida = data2;
              const educacion = this.hojaVida.experienciaEscolar!.split('| ');
              this.listEducacion.push(...educacion);
              const laboral = this.hojaVida.experiencialLaboral!.split('| ');
              this.listLaboral.push(...laboral);
            }
          )
        }
      )
    } else {
      this.capcitadporService.getCapacitadorById(this.idCapacitadorGlobal!).subscribe(
        data =>{
          this.capacitador = data;
          this.capacitador.tituloCapacitador
          this.hojaVidaService.getHojaVidaCapacitadorByIdCapacitador(this.capacitador.idCapacitador!).subscribe(
            data2 =>{
              this.hojaVida = data2;
              const educacion = this.hojaVida.experienciaEscolar!.split('| ');
              this.listEducacion.push(...educacion);
              const laboral = this.hojaVida.experiencialLaboral!.split('| ');
              this.listLaboral.push(...laboral);
            }
          )
        }
      )
    }
  }


  // LISTAS
  listEducacion: String[] = [];

  listLaboral: String[] = [];

}
