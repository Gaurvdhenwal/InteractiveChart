import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ServerConncService {

  constructor(private socket: Socket) { }

  getMessage() {
    return this.socket
             .fromEvent("refreshComment")
             .pipe(map((data:any) => data.msg));
 
        
}
}
