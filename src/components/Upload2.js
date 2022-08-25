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

  useEffect(() => {
    convert(hhData)
  }, [hhData])
  
  // const convert=()=>{
  //   var temp=hhData && hhData.slice(1);
  //   var hhDataJson = temp && temp?.map(x => ({ 
  //       CurveCode: x[0],
  //       FromDateTime: x[1],
  //       Value:x[2]
  //     }));
  //   setAns(hhDataJson);
  // }

  const convert=()=>{
    var temp=hhData && hhData.slice(1);
    var hhDataJson = temp && temp?.map(x => ({ 
        CurveCode: x[0],
        FromDateTime: x[1],
        Value:x[2]
      }));
    setAns(hhDataJson);
    //console.log("Ans=",ans[0].FromDateTime)
    // temp.map((element, index) => {
    //   if (element % 2 === 0) {
    //     return <h2 key={index}>{element}</h2>;
    //   }
    //   return <h2 key={index}>X</h2>;
    // })
  }


  return (
    <>
    <CSVReader
      onUploadAccepted={(results) => {
        console.log('---------------------------');
        setHhData(results.data);
        console.log(results);
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