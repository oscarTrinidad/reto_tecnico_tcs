import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { Store } from '@ngrx/store';
import { Observable, from } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StorageService } from 'src/services/storage.service';
import { User } from 'src/models/user.model';
// import { UserState } from 'src/states/user.state';
// import { selectUser } from 'src/selectors/user.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    // private store: Store<{ user: UserState }>, 
    private storage: StorageService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const validar = await this.storage.validarUsuario();
    if (validar) {
      return true;
    } else {
      this.storage.borrarStorage();
      this.router.navigateByUrl('/login');
      return false;
    }
  }

  // canActivate(): Observable<boolean> {
  //   return this.store.select(selectUser).pipe(
  //     take(1),
  //     map(user => {
  //       if (!user) {
  //         this.router.navigate(['/login']);
  //         return false;
  //       }
  //       return true;
  //     })
  //   );
  // }
}