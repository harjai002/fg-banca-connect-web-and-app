import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DsrActivityComponent } from './dsrActivity/dsrActivity.component';
import { HomeComponent } from './home/home.component';
import { NetworkErrComponent } from './network-err/network-err.component';
import { ReportComponent } from './report/report.component';
import { AuthGuard } from './services/guards/auth.guard';
import { TeamdemoComponent } from './teamdemo/teamdemo.component';
import { TeamsActivityComponent } from './teams-activity/teams-activity.component';
import { TeamsDashboardComponent } from './teams-dashboard/teams-dashboard.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent ,canActivate: [AuthGuard] },
  { path: 'dsrActivity', component: DsrActivityComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'networkerr', component: NetworkErrComponent },
  { path: 'teamsActivity', component: TeamsActivityComponent },
  { path: 'teamsDemo:id', component: TeamdemoComponent },
  { path: 'teamDashboard:id?', component: TeamsDashboardComponent },
  { path: 'report', component: ReportComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,  {
       useHash: true,
       preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
