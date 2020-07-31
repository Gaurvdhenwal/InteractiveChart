import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ServerConncService } from './server-connc.service';
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} }
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [DataService , ServerConncService],
  bootstrap: [AppComponent]
})
export class AppModule { }
