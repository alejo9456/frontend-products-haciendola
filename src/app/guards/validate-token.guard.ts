import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ValidateTokenGuard implements CanActivate, CanLoad {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(): Observable<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.validateToken().pipe(
            tap(valid => {
                if (!valid) {
                    this.router.navigateByUrl('/auth');
                }
            })
        );
    }

    canLoad(): Observable<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.validateToken().pipe(
            tap(valid => {
                if (!valid) {
                    this.router.navigateByUrl('/auth');
                }
            })
        );
    }
}
