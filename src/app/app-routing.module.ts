import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth/guards/auth-guard.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'dashboard',
        canActivate: [AuthGuardService],
        loadChildren: () =>
            import('./dashboard/dashboard.module').then(
                (m) => m.DashboardModule
            ),
    },
    {
        path: 'users',
        canActivate: [AuthGuardService],
        loadChildren: () =>
            import('./users/users.module').then((m) => m.UsersModule),
    },
    {
        path: 'roles',
        canActivate: [AuthGuardService],
        loadChildren: () =>
            import('./roles/roles.module').then((m) => m.RolesModule),
    },
    {
        path: 'drugs',
        canActivate: [AuthGuardService],
        loadChildren: () =>
            import('./drugs/drugs.module').then((m) => m.DrugsModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
