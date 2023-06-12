import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './services/data.service';
import { AuthService } from './services/auth.service';
import { CommonService } from './services/common.service';
import { LoginComponent } from './auth/login/login.component';
import { NetworkErrComponent } from './network-err/network-err.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { FilterdataPipe } from './services/pipes/filterdata.pipe';
import { DsrActivityComponent } from './dsrActivity/dsrActivity.component';

import { DashboardComponent } from './dashboard/dashboard.component';

import { SearchComponent } from './services/components/search/search.component';
import { TeamsActivityComponent } from './teams-activity/teams-activity.component';
import { ReportComponent } from './report/report.component';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { NetworkCheckService } from './services/network-check.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { TeamdemoComponent } from './teamdemo/teamdemo.component';
import { IonicSelectableModule } from 'ionic-selectable';
import { DropdownComponent } from './services/components/dropdown/dropdown.component';
import { TeamsDashboardComponent } from './teams-dashboard/teams-dashboard.component';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { TokenInterceptorService } from './services/interceptor/token-interceptor.service';
import { CookieModule } from 'ngx-cookie';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {CustomPopupComponent} from './services/custom-popup/custom-popup.component';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FilterdataPipe,
    DsrActivityComponent,
    DashboardComponent,
    TeamsActivityComponent,
    ReportComponent,
    NetworkErrComponent,
    TeamdemoComponent,
    DropdownComponent,
    TeamsDashboardComponent,
    CustomPopupComponent
  ],
  imports: [IonicSelectableModule,
    FormsModule,
    ReactiveFormsModule,
    CookieModule.withOptions(),
    HttpClientModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule,
     ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: environment.production,
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  // registrationStrategy: 'registerWhenStable:30000'
  registrationStrategy: 'registerImmediately'
})],
  providers: [
    AppVersion,
    DataService,
    AuthService,
    CommonService,
    SplashScreen,
    File,
    FileTransfer,
    AndroidPermissions,
    StatusBar,
    NetworkCheckService,
    InAppBrowser,
    Network, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
