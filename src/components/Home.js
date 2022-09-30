import React, { useState, useEffect } from "react";
import { useCSVReader } from "react-papaparse";
import "../css/home.css";
import Spinner from "./Spinner";
import Viewtabs from "./Viewtabs";
const LazyViewtabs = React.lazy(()=>import("./Viewtabs"));

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
export default function Home() {
  const { CSVReader } = useCSVReader();
  const [hhData, setHhData] = useState("");
  const [ans, setAns] = useState("");

  useEffect(() => {
    convert(hhData);
  }, [hhData]);

  const convert = () => {
    var temp = hhData && hhData.slice(1);
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
              setHhData(results.data);
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
          <React.Suspense fallback={<Spinner />}>
            {ans && <LazyViewtabs ans={ans} />}
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
