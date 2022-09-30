export function days_of_a_year(year) 
{
   
  return isLeapYear(year) ? 366 : 365;
}

export function isLeapYear(year) {
     return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

export const getWeekNum=(d)=>{
    var dated =new Date(d);
    var weekOfMonth =(0 |dated.getDate()/7)+1;
    return weekOfMonth
}