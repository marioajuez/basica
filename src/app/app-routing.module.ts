import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [

  {
    path:'',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'prueba',
    loadChildren: () => import('./prueba/prueba.module').then(m => m.PruebaModule),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(
    
      routes,{useHash: true}
      // { initialNavigation : false }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { 

  constructor(router: Router) {
    // router.navigateByUrl("/login");
  }
}
