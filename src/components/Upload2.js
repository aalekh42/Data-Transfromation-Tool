import moment from 'moment';
import React, { useState,useEffect } from 'react';
import { JsonToTable } from "react-json-to-table";
import { useCSVReader } from 'react-papaparse';

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  } ,
  browseFile: {
    width: '20%',
  },
  acceptedFile: {
    border: '1px solid #ccc',
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: '80%',
  },
  remove: {
    borderRadius: 0,
    padding: '0 20px',
  },
  progressBarBackgroundColor: {
    backgroundColor: 'red',
  },
};
export default function Upload2() {
  const { CSVReader } = useCSVReader();
  const [hhData,setHhData]=useState('');
  const [ans,setAns]=useState('');
  const [days,setDays] =useState('');
  const [month,setMonths] = useState('');
  const [years,setYears]= useState('');
  const [mpans,setMpans]=useState('');

  useEffect(() => {
    convert(hhData);
    // var a = moment([2007, 10, 29]);
    // var b = moment([2007, 11, 28]);
    // console.log("AP=",a.diff(b, 'days'));
  }, [hhData])
  
  const convert=()=>{
    var temp=hhData && hhData.slice(1);
    var hhDataJson = temp && temp?.map(x => ({ 
        CurveCode: x[0],
        FromDateTime: x[1],
        Value:x[2]
      }));
    setAns(hhDataJson);
    let currentDate=moment().format('YYYY-MM-DD HH:mm:ss');
    console.log("Date=",currentDate);

    // //Getting Dates
    // let allDates= ans && ans?.map(elem=>moment(elem.FromDateTime, moment.defaultFormatUtc).calendar());
    // let singleDate= ans && allDates[0];
    // ans && console.log("Hello =",allDates);

    //Getting Year
    // let allYears= ans && ans?.map(elem=>moment(elem.FromDateTime, moment.defaultFormatUtc).year());
    // let singleYear= ans && allYears[0];
    // ans && console.log("Hello =",allYears);
    
    //Getting Days
    // let allDays= ans && ans?.map(elem=>moment(elem.FromDateTime, moment.defaultFormatUtc).format('ddd'));
    // let singleDays= ans && allDays[0];
    // ans && console.log("Hello =",allDays);

    //Get distinct year Only
    let allYears= ans && ans?.map(elem=>moment(elem.FromDateTime, moment.defaultFormatUtc).year());
    const distinctYears =ans && allYears.filter((value, index, self) => self.indexOf(value) === index)
    ans && console.log("years",distinctYears)
    
    //Getting Months and Year
    // let getMonths= ans && ans?.map(elem=>moment(elem.FromDateTime, moment.defaultFormatUtc).format('MMM YY'));
    // ans && console.log("Hello =",getMonths);
    // const getJan2021=ans && ans?.filter(x=>moment(x.FromDateTime,moment.defaultFormatUtc).format('MMM YY')==='Jan 21')

    // const sumOfJan =ans &&  getJan2021.reduce((accumulator, object) => {
    //   return (parseFloat(accumulator) + parseFloat(object.Value)).toFixed(3);
    // }, 0);
    // console.log("Jan sum",sumOfJan);
    // console.log("Output",getJan2021)

    //Getting per days
    // let perDay= ans && ans?.map(elem=>moment(elem.FromDateTime, moment.defaultFormatUtc).format('MMM YY'));
    // ans && console.log("Hello perDay=",perDay);



  }



  return (
    <>
    <CSVReader
      onUploadAccepted={(results) => {
        console.log('---------------------------');
        setHhData(results.data);
        //console.log(results);
        console.log('---------------------------');
        //console.log("HHData=",hhData,hhData.length);
        console.log("HHDATA_JSON",ans);

      }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
      }) => (
        <>
          <div style={styles.csvReader}>
            <button type='button' {...getRootProps()} style={styles.browseFile}>
              Browse file
            </button>
            <div style={styles.acceptedFile}>
              {acceptedFile && acceptedFile.name}
            </div>
            <button {...getRemoveFileProps()} style={styles.remove}>
              Remove
            </button>
          </div>
          <ProgressBar style={styles.progressBarBackgroundColor} />
        </>
      )}
    </CSVReader>
    {/* <JsonToTable json={hhData} /> *Getting wrong output */}
        <JsonToTable json={ans} />

    </>
  );
}