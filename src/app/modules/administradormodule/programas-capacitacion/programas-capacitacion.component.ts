import { Component, OnInit } from '@angular/core';
import { PeriodoPrograma } from 'src/app/models/periodo-programa';
import { Programas } from 'src/app/models/programa';
import { PeriodoProgramaService } from 'src/app/service/periodo-programa.service';
import { ProgramasService } from 'src/app/service/programas.service';

@Component({
  selector: 'app-programas-capacitacion',
  templateUrl: './programas-capacitacion.component.html',
  styleUrls: ['./programas-capacitacion.component.css'],
})
export class ProgramasCapacitacionComponent implements OnInit {
  //Declaracion de las listas para tener el registro de los programas
  // public listaDeProgramas: PeriodoPrograma[] =[];
  public listaProgramas: Programas[] = [];

  //Declaracion de las clases que vamos a usar
  public classPeriodoPrograma = new PeriodoPrograma();
  public classPrograma = new Programas();

  constructor(
    private periodoProgramaService: PeriodoProgramaService,
    private programaService: ProgramasService
  ) {}
  ngOnInit(): void {
    this.getTodosLosProgramasPorAdministrador();
  }

  public createPrograma() {
    if (this.classPeriodoPrograma.idPeriodoPrograma) {
      this.periodoProgramaService.updatePeriodoPrograma(this.classPeriodoPrograma.idPeriodoPrograma, this.classPeriodoPrograma).subscribe((data)=>{
        if(data != null){
          this.programaService.updatePrograma(this.classPrograma.idPrograma!, this.classPrograma).subscribe((data)=>{
            if(data != null){
              alert("datos actualizados")
              this.getTodosLosProgramasPorAdministrador();
              this.visible=false;
              this.classPeriodoPrograma = new PeriodoPrograma();
              this.classPrograma = new Programas();
              
            }
          })
        }
      })
    } else {
      this.classPeriodoPrograma.estadoPeriodoPrograma = true;
      this.periodoProgramaService
        .savePeriodoPrograma(this.classPeriodoPrograma)
        .subscribe((data) => {
          if (data != null) {
            this.classPrograma.periodoPrograma = data;
            this.classPrograma.estadoProgramaActivo = true;
            this.programaService
              .savePrograma(this.classPrograma)
              .subscribe((data) => {
                if (data != null) {
                  this.getTodosLosProgramasPorAdministrador();
                  alert('correco en laceacion de la curso');
                }
              });
          }
        });
        this.classPeriodoPrograma = new PeriodoPrograma();
        this.classPrograma = new Programas();
    }
  }

  public getTodosLosProgramasPorAdministrador() {
    this.programaService.listPrograma().subscribe((data) => {
      if (data != null) {
        this.listaProgramas = data.filter(
          (programa: any) => programa.estadoProgramaActivo === true
        );
      }
    });
  }

  //Lo que vamos hacer es el eliminado logico
  public updateProgramasEliminadoLogico(programa: Programas) {
    programa.estadoProgramaActivo = false;
    this.programaService
      .updatePrograma(programa.idPrograma!, programa)
      .subscribe((data) => {
        if (data != null) {
          this.getTodosLosProgramasPorAdministrador();
        }
      });
  }

  //Vamos a actualizar

  public cargarDatos(programa: Programas) {
    this.classPrograma = { ...programa };
    this.classPeriodoPrograma = this.classPrograma.periodoPrograma!;

    if (this.classPeriodoPrograma.fechaInicioPeriodoPrograma) {
      this.classPeriodoPrograma.fechaInicioPeriodoPrograma = new Date(
        this.classPeriodoPrograma.fechaInicioPeriodoPrograma
      );
    }

    if (this.classPeriodoPrograma.fechaFinPeriodoPrograma) {
      this.classPeriodoPrograma.fechaFinPeriodoPrograma = new Date(
        this.classPeriodoPrograma.fechaFinPeriodoPrograma
      );
    }
    this.visible = true;
  }

  //vISIVILIADA DEL MODAL
  visible?: boolean;

  public showModaL() {
    this.classPeriodoPrograma = new PeriodoPrograma();
    this.classPrograma = new Programas();
    this.visible = true;
  }
}
