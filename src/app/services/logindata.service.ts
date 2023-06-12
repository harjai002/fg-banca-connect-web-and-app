import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogindataService {

  constructor() { }

  loginData = [
    { id: 1, name: "Manoj", userName: "manoj", password: "manoj", tl: "anil", auth: 3 },
    { id: 2, name: "soumya", userName: "soumya", password: "soumya", tl: "anil", auth: 3 },

    { id: 3, name: "Raja", userName: "raja", password: "raja", tl: "anand", auth: 3 },
    { id: 4, name: "Jalpesh", userName: "jalpesh", password: "jalpesh", tl: "anand", auth: 3 },

    { id: 5, name: "Anil", userName: "anil", password: "anil", tl: "manu", auth: 2 },
    { id: 6, name: "Anand", userName: "anand", password: "anand", tl: "girish", auth: 2 },

    { id: 7, name: "Manuraj", userName: "manuraj", password: "manuraj", auth: 1 },
    { id: 8, name: "Manuraj", userName: "girish", password: "girish", auth: 1 },

    { id: 9, name: "vikram", userName: "head", password: "head", auth: 5 }
  ]

}
