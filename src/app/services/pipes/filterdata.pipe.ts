import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterdata'
})
export class FilterdataPipe implements PipeTransform {
// old code 
  // transform(value:any, searchText: any): any {
  //   if(value.length===0){
  //     return value;
  //   }
  //   else{
  //     return value.filter(function(search){
  //       return search.type_Of_Activity.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
  //     })
  //   }
  //   // search.type_Of_Activity.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || search.bank_Name.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || search.to_Whom_Meet.toLowerCase().indexOf(searchText.toLowerCase()) > -1  || search.bank_Branch_Name.toLowerCase().indexOf(searchText.toLowerCase()) > -1  || search.executive.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
  // }

  transform(value: any, searchText: any): any {
    if (searchText === undefined) return value;
    return value.filter(function (search) {
      return search.type_Of_Activity.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || search.bank_Name.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || search.to_Whom_Meet.toLowerCase().indexOf(searchText.toLowerCase()) > -1  || search.bank_Branch_Name.toLowerCase().indexOf(searchText.toLowerCase()) > -1  || search.executive.toLowerCase().indexOf(searchText.toLowerCase()) > -1  || search.zone.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || search.branch_Code.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || search.to_Whom_Meet_Number.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || search.userName.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || search.team_Leader.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    })
  }

}
