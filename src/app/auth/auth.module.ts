import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalLayoutComponent } from './components/principal-layout/principal-layout.component';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material/angular-material.module';



@NgModule({
  declarations: [
    LoginComponent,
    PrincipalLayoutComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
