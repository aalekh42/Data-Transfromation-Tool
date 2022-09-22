import React, { useState, useEffect } from "react";
import { useCSVReader } from "react-papaparse";
import { connect } from "react-redux";
import '../css/home.css';
import { setHhData } from "../redux";

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
function Demo({hhData,setHhData}) {
  const { CSVReader } = useCSVReader();
  const [data, setData] = useState('');
  const [ans, setAns] = useState("");

  useEffect(() => {
    convert(data);
  }, [data]);

  const convert = () => {
    var temp = data && data.slice(1);
    var hhDataJson =
      temp &&
      temp?.map((x) => {
        if (x.length === 3) {
          return {
            CurveCode: x[0],
            FromDateTime: x[1],
            value: x[2],
          };
        } else {
          return {
            CurveCode: x[1],
            FromDateTime: x[2],
            value: x[3],
          };
        }
      });
    setAns(hhDataJson);
    setHhData(hhDataJson)

  };

  return (
    <div className="home-container fluid-container">
      <div className="row">
        <div className="col-12 home-heading">
          <h2>DATA TRANSFORMATION TOOL</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-12 upload-block">
          <CSVReader
            onUploadAccepted={(results) => {
              console.log("---------------------------");
              setData(results.data);
              //console.log(results);
              console.log("---------------------------");
              console.log("HHDATA_JSON", ans);
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
        </div>
      </div>

      <div className="row">
        <div className="col-12 upload-block">
          {/* {hhData} */}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps=(state)=>{
    return{
        hhData:state.common.hhData
    }
}

const mapDispatchToProps=(dispatch)=>{
    return{
        setHhData:(data)=>dispatch(setHhData(data))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Demo);