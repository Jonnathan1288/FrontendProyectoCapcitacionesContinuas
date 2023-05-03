import { Component, OnInit } from '@angular/core';
import { ProgramasService } from 'src/app/service/programas.service';
import { Programas } from 'src/app/models/programa';



@Component({
  selector: 'app-programas',
  templateUrl: './programas.component.html',
  styleUrls: ['./programas.component.css']
})
export class ProgramasComponent implements OnInit {

  public programaslist:Programas[] = [];

  programa = new Programas();
  constructor(private ProgramasService: ProgramasService){}
  ngOnInit(): void{
    this.listprog();
  }

   //Para listar los programas..
   public listprog(){
    this.ProgramasService.listPrograma()
    .subscribe((data)=>{
      this.programaslist=data;
      console.log(data)
    });
  }


  Guardar(programa:Programas){
    this.ProgramasService.savePrograma(programa).subscribe((data)=>{
      alert("Se agrego con exito");
      this.listprog();
      
    })
  }
}
