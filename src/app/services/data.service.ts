import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  filterData = [
    { id: 1, date: "2022-01-02", name: "ram" },
    { id: 12, date: "2022-01-02", name: "ram3" },
    { id: 2, date: "2022-01-03", name: "ram4" },
    { id: 3, date: "2022-01-04", name: "shyam" },
    { id: 4, date: "2022-01-05", name: "mohit" },
    { id: 5, date: "2022-01-06", name: "sohit" },
    { id: 11, date: "2022-01-06", name: "sohit2" },
    { id: 6, date: "2022-01-07", name: "sumit" },
    { id: 7, date: "2022-01-08", name: "amit" },
    { id: 8, date: "2022-01-01", name: "rahul" },
    { id: 9, date: "2022-01-09", name: "bhola" },
    { id: 10, date: "2022-01-10", name: "aman" },
  ]

  LeaderData = [
    { id: 1, name: "ram", entry: 50, leader: "Anil Kumar" },
    { id: 2, name: "mohan", entry: 20, leader: "Anil Kumar" },
    { id: 3, name: "sohan", entry: 10, leader: "Anil Kumar" },
    { id: 4, name: "amit", entry: 50, leader: "Anil Kumar" },
    { id: 5, name: "ankit", entry: 30, leader: "Anil Kumar" },
    { id: 6, name: "raju", entry: 500, leader: "Anil Kumar" },
    { id: 7, name: "raja", entry: 50, leader: "Anil Kumar" },
    { id: 8, name: "manoj", entry: 60, leader: "Anil Kumar" },
    { id: 9, name: "soumya", entry: 70, leader: "Anil Kumar" },
  ]

}
