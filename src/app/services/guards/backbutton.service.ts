import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackbuttonService {
  disableButtonSubject = new BehaviorSubject<boolean>(false);
  disableButton$ = this.disableButtonSubject.asObservable();

  constructor() { }
}
