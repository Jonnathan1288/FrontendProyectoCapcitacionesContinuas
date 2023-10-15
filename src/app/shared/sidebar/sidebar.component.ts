import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadScript } from 'src/app/scripts/load-script';
import { StorageService } from 'src/app/service/storage.service';
import { BadgeColor } from 'src/app/util/enums';
import { FOLDER_IMAGE_USER, getFile } from 'src/app/util/folder-upload';

import { LocalStorageKeys, clearLocalStorage, getAttributeStorage, getRole } from 'src/app/util/local-storage-manager';
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

  public nameUserLoggin: any = '';

  public urlPhoto: any = '';

  constructor(
    private _CargarScript: LoadScript,
    private router: Router,
    private sidebarService: SidebarService
  ) {

  }

  ngOnInit() {
    this.listSidebar = this.sidebarService.dataMenu.filter((menuItem) => {
      return !menuItem.rols || menuItem.rols.includes(getRole(LocalStorageKeys.ROL));
    });

    this.rolLoggin = getRole(LocalStorageKeys.ROL)!;


    this.nameUserLoggin = getAttributeStorage(LocalStorageKeys.USER_NAME);
    this.urlPhoto = getAttributeStorage(LocalStorageKeys.URL_PHOTO);

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

  //Other enum----------------------------------------------------------------
  getBadgeStyle(item: any): string {
    return this.getBadgeColor(item.submenu.length);
  }

  private getBadgeColor(submenuLength: number): string {
    const badgeColors = [
      BadgeColor.Warning,
      BadgeColor.Primary,
      BadgeColor.AnotherColor,
    ];

    const colorIndex = submenuLength % badgeColors.length;
    return badgeColors[colorIndex];
  }

  //GET PROFILE PHOTO NEW METHOD
  public getUriFile(fileName: string): string {
    return getFile(fileName, FOLDER_IMAGE_USER);
  }

}
