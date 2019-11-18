
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Permissions} from './Permissions';


@Injectable({
  providedIn: 'root'
})
export class CanActivateTeam implements CanActivate  {
  constructor(private permission: Permissions,
              private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    if (this.permission.canActivate()) {
      return this.permission.canActivate();
    } else {
      this.router.navigateByUrl('/').then(r => console.log('fail to navigate'));
      return false;
    }
  }

}
