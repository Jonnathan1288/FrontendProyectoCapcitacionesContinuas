import { Component, OnInit } from '@angular/core';
import { PeriodoPrograma } from 'src/app/models/periodo-programa';
import { Programas } from 'src/app/models/programa';
import { PeriodoProgramaService } from 'src/app/service/periodo-programa.service';
import { ProgramasService } from 'src/app/service/programas.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-programas-capacitacion',
  templateUrl: './programas-capacitacion.component.html',
  styleUrls: ['./programas-capacitacion.component.css'],
})
export class ProgramasCapacitacionComponent implements OnInit {
 
  // Declaración de las listas para tener el registro de los programas
  // public listaDeProgramas: PeriodoPrograma[] =[];
  public listaProgramas: Programas[] = [];

  // Declaración de las clases que vamos a usar
  public classPeriodoPrograma = new PeriodoPrograma();
  public classPrograma = new Programas();

  constructor(
    private periodoProgramaService: PeriodoProgramaService,
    private programaService: ProgramasService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getTodosLosProgramasPorAdministrador();
  }

  public validarDatosProgramaCapacitacionContinua() {
    if (
      !this.classPeriodoPrograma.nombrePeriodoPrograma ||
      !this.classPeriodoPrograma.nombrePeriodoPrograma ||
      !this.classPrograma.nombrePrograma ||
      !this.classPrograma.descripcionPrograma
    ) {
      this.toastrService.error(
        'Verifique los campos que no estén vacíos.',
        'CAMPOS VACÍOS.',
        {
          timeOut: 1300,
        }
      );
    } else {
      this.createPrograma();
    }
  }

  hideDialog() {
    this.visible = false;
    this.submitted = false;
  }

  public createPrograma() {
    if (this.classPeriodoPrograma.idPeriodoPrograma) {
      this.periodoProgramaService
        .updatePeriodoPrograma(
          this.classPeriodoPrograma.idPeriodoPrograma,
          this.classPeriodoPrograma
        )
        .subscribe((data) => {
          if (data != null) {
            this.programaService
              .updatePrograma(
                this.classPrograma.idPrograma!,
                this.classPrograma
              )
              .subscribe((data) => {
                if (data != null) {
                  this.toastrService.success(
                    'Se ha actualizado correctamente el programa de capacitación.',
                    'ACTUALIZACIÓN EXITOSA.',
                    {
                      timeOut: 1500,
                    }
                  );
                  this.getTodosLosProgramasPorAdministrador();
                  this.classPeriodoPrograma = new PeriodoPrograma();
                  this.classPrograma = new Programas();
                  this.visible = false;
                }
              });
          }
        });
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
                  this.classPeriodoPrograma = new PeriodoPrograma();
                  this.classPrograma = new Programas();
                  this.toastrService.success(
                    'Se ha creado correctamente el programa de capacitación.',
                    'CREACIÓN EXITOSA.',
                    {
                      timeOut: 1500,
                    }
                  );
                  this.visible = false;
                }
              });
          }
        });
    }
  }

  public getTodosLosProgramasPorAdministrador() {
    this.programaService.listPrograma().subscribe((data) => {
      if (data != null) {
        this.listaProgramas = data;
      }
    });
  }

  //Lo que vamos hacer es el eliminado lógico.
  public updateProgramasEliminadoLogico(programa: Programas) {
    // programa.estadoProgramaActivo = true;
    programa.estadoProgramaActivo = !programa.estadoProgramaActivo; // Alternar el estado activo/desactivado
    this.programaService
      .updatePrograma(programa.idPrograma!, programa)
      .subscribe((data) => {
        if (data != null) {
          this.getTodosLosProgramasPorAdministrador();
          if (programa.estadoProgramaActivo) {
            this.toastrService.success(
              'El programa ya esta público',
              'Activación Exitosa'
            );
          } else {
            this.toastrService.warning(
              'El programa a sido  acultado',
              'Desactivación Exitosa'
            );
          }
        }
      });
  }

  //Vamos a actualizar

  public cargarDatos(programa: Programas) {
    this.classPrograma = { ...programa };
    this.classPeriodoPrograma = this.classPrograma.periodoPrograma!;
    this.visible = true;
  }


  visible?: boolean;
  submitted: boolean = false;

  public showModaL() {
    this.visible = true;
  }


}
