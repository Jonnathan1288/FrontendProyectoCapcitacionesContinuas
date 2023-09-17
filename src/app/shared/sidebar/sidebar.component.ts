import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadScript } from 'src/app/scripts/load-script';
import { StorageService } from 'src/app/service/storage.service';

import { LocalStorageKeys, clearLocalStorage, getRole, getUserData } from 'src/app/util/local-storage-manager';
import { SharedService } from 'src/app/util/service/shared.service';
import { SidebarService } from 'src/app/util/service/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  //User
  // public userLoggin: string = '';
  //Rol
  public rolLoggin: string = '';

  public listSidebar: any[] = [];

  public nameUserLoggin: string = '';
  public imageUserLoggin: string = '';


  constructor(
    private _CargarScript: LoadScript,
    private router: Router,
    private storageService: StorageService,
    private sharedService: SharedService,
    private sidebarService: SidebarService
  ) {

  }

  ngOnInit() {
    this.listSidebar = this.sidebarService.dataMenu.filter((menuItem) => {
      return !menuItem.rols || menuItem.rols.includes(getRole(LocalStorageKeys.ROL));
    });

    this.rolLoggin = localStorage.getItem("rol")!;

    const userData = getUserData(LocalStorageKeys.USER_DATA);

    this.nameUserLoggin = userData.username;
    this.imageUserLoggin = userData.foto;
  }


  isCurrentRoute(route: string): boolean {
    return this.router.isActive(route, true);
  }


  // LOGOUT
  public logOut() {
    this.router.navigate(['/home']).then(() => {
      clearLocalStorage()
      window.location.reload();
    });
  }


  // Formatear imagen
  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }



  public dayExact(day: string): string {
    const DIAS_EXACT: Record<string, string> = { '1': 'warning', '2': 'success' }
    return DIAS_EXACT[day] || 'primary';
  }
}
