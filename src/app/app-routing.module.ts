import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ValidateTokenGuard } from './guards/validate-token.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( (m) => m.AuthModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => 
      import('./protected/protected.module').then( (m) => m.ProtectedModule),
    canActivate: [ValidateTokenGuard],
    canLoad: [ValidateTokenGuard],
  },
  {
    path: '**',
    redirectTo: 'auth',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
