import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/util/service/security.service';

@Component({
  selector: 'app-comunidad-institucional',
  templateUrl: './comunidad-institucional.component.html',
  styleUrls: ['./comunidad-institucional.component.css']
})
export class ComunidadInstitucionalComponent implements OnInit {

  constructor(private securityService: SecurityService) { }

  ngOnInit(): void {
    const rol = 'ADMINISTARDOR';
    const idUsuario = '1';

    // Encriptar
    const rolEncriptado = this.securityService.encrypt(rol);
    const idUsuarioEncriptado = this.securityService.encrypt(idUsuario);

    console.log('Rol encriptado:', rolEncriptado);
    console.log('ID de usuario encriptado:', idUsuarioEncriptado);

    // Desencriptar
    const rolDesencriptado = this.securityService.decrypt(rolEncriptado);
    const idUsuarioDesencriptado = this.securityService.decrypt(idUsuarioEncriptado);

    console.log('Rol desencriptado:', rolDesencriptado);
    console.log('ID de usuario desencriptado:', idUsuarioDesencriptado);

    // Hashear
    const rolHash = this.securityService.generateHash(rol);
    const idUsuarioHash = this.securityService.generateHash(idUsuario);

    console.log('Rol hasheado:', rolHash);
    console.log('ID de usuario hasheado:', idUsuarioHash);

    // Verificar integridad
    const isRolIntegro = this.securityService.verifyHash(rol, rolHash);
    const isIdUsuarioIntegro = this.securityService.verifyHash(idUsuario, idUsuarioHash);

    console.log('Integridad del rol:', isRolIntegro);
    console.log('Integridad del ID de usuario:', isIdUsuarioIntegro);
  }
}
