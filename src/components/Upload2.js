import moment from "moment";
import React, { useState, useEffect } from "react";
import { JsonToTable } from "react-json-to-table";
import { useCSVReader } from "react-papaparse";
import Upload3 from "./Upload3";

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  browseFile: {
    width: "20%",
  },
  acceptedFile: {
    border: "1px solid #ccc",
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: "80%",
  },
  remove: {
    borderRadius: 0,
    padding: "0 20px",
  },
  progressBarBackgroundColor: {
    backgroundColor: "red",
  },
};
export default function Upload2() {
  const { CSVReader } = useCSVReader();
  const [hhData, setHhData] = useState("");
  const [ans, setAns] = useState("");
  const [sortedData, setSortedData] = useState("");
  const [days, setDays] = useState("");
  const [months, setMonths] = useState("");
  const [years, setYears] = useState("");
  const [mpans, setMpans] = useState("");

  useEffect(() => {
    convert(hhData);
  }, [hhData]);

  const convert = () => {
    var temp = hhData && hhData.slice(1);
    var hhDataJson =
      temp &&
      temp?.map((x) => ({
        CurveCode: x[0],
        FromDateTime: x[1],
        value: x[2],
      }));
    setAns(hhDataJson);

    //Sorting
    let aggregatedData =
      ans &&
      ans?.sort(function (a, b) {
        return new Date(a.FromDateTime) - new Date(b.FromDateTime);
      });
    ans && console.log("Hello perDay=", aggregatedData);
    setSortedData(aggregatedData);

    // let currentDate=moment().format('YYYY-MM-DD HH:mm:ss');
    // console.log("Date=",currentDate);

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
    let allYears =
      ans &&
      ans?.map((elem) =>
        moment(elem.FromDateTime, moment.defaultFormatUtc).year()
      );
    const distinctYears =
      ans &&
      allYears.filter((value, index, self) => self.indexOf(value) === index);
    ans && console.log("years", distinctYears);

    //Getting Months and Year
    let getMonths =
      ans &&
      ans?.map((elem) =>
        moment(elem.FromDateTime, moment.defaultFormatUtc).format("MMM YY")
      );
    ans && console.log("Hello =", getMonths);
  };

  return (
    <>
      <CSVReader
        onUploadAccepted={(results) => {
          console.log("---------------------------");
          setHhData(results.data);
          //console.log(results);
          console.log("---------------------------");
          //console.log("HHData=",hhData,hhData.length);
          console.log("HHDATA_JSON", ans);
        }}
      >
        {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
          <>
            <div style={styles.csvReader}>
              <button
                type="button"
                {...getRootProps()}
                style={styles.browseFile}
              >
                Browse file
              </button>
              <div style={styles.acceptedFile}>
                {acceptedFile && acceptedFile.name}
              </div>
              <button
                {...getRemoveFileProps()}
                style={styles.remove}
                onClick={() => setAns("")}
              >
                Remove
              </button>
            </div>
            <ProgressBar style={styles.progressBarBackgroundColor} />
          </>
        )}
      </CSVReader>
      {/* <JsonToTable json={hhData} /> *Getting wrong output */}
      {/* <JsonToTable json={sortedData} /> */}
      <Upload3 ans={ans} />
    </>
  );
}
