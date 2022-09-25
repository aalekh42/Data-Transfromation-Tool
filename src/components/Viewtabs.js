import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AggregatedTable from "./Aggregated/AggregatedTable";
import "../css/home.css";
import moment from "moment";
import MonthlyTable from "./Monthly/MonthlyTable";
import Filter from "./Filter";

export default function Viewtabs({ ans }) {
  let data = {};
  let category = [];
  const [items, setItems] = React.useState(data);
  const [categoryItems, setCategoryItems] = React.useState("");

  const [value, setValue] = React.useState("1");

  React.useEffect(() => {
    getCategories();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const mapper = (single) => {
    let date = moment(single.FromDateTime).format("YYYY-MM-DD");
    let month = moment(single.FromDateTime).format("MMM");
    let year = moment(single.FromDateTime).format("YYYY");
    let value = parseFloat(single.value);
    let time = moment(single.FromDateTime, moment.defaultFormat).format(
      "YYYY-MM-DD HH:mm"
    );
    var d = moment(`${time}`);
    var peakStart = moment(`${date} 07:00`);
    var peakEnd = moment(`${date} 19:00`);

    var duosStart = moment(`${date} 16:00`);
    var duosEnd = moment(`${date} 19:00`);

    var peakCondition1 =
      0 <= d.diff(peakStart, "hours") && d.diff(peakStart, "hours") <= 12; //should be true (only true if result is between 0-12)
    var peakCondition2 =
      0 <= peakEnd.diff(d, "hours") && peakEnd.diff(d, "hours") <= 12;
    var weekday = moment(date).isoWeekday() <= 5;
    var peakVol = peakCondition1 && peakCondition2 && weekday ? value : 0;

    var duosCondition1 =
      0 <= d.diff(duosStart, "hours") && d.diff(duosStart, "hours") <= 3; //should be true (only true if result is between 0-3)
    var duosCondition2 =
      0 <= duosEnd.diff(d, "hours") && duosEnd.diff(d, "hours") <= 3;
    var duosVol = duosCondition1 && duosCondition2 && weekday ? value : 0;
    var weekendVol = !weekday ? value : 0;
    var offPeak = !peakCondition1 && !peakCondition2 && weekday ? value : 0;
    var offPeakVol = weekendVol + offPeak;
    let daysInMonth = moment(date).daysInMonth();

    return {
      CurveCode: single.CurveCode,
      FromDateTime: date,
      years: year,
      Month: month,
      TotalVol: value,
      peakVol: peakVol,
      duosVol: duosVol,
      weekendVol: weekendVol,
      offPeakVol: offPeakVol,
      daysInMonth: daysInMonth,
      MonthYear: month + year,
    };
  };

  const getDays = (group, current) => {
    let i = group.findIndex(
      //(single) => single.FromDateTime === current.FromDateTime

      (single) =>
        single.FromDateTime === current.FromDateTime &&
        single.CurveCode === current.CurveCode
    );
    if (i === -1) {
      return [...group, current];
    }
    group[i].TotalVol = parseInt(group[i].TotalVol + current.TotalVol);
    group[i].peakVol = parseInt(group[i].peakVol + current.peakVol);
    group[i].duosVol = parseInt(group[i].duosVol + current.duosVol);
    group[i].offPeakVol = parseInt(group[i].offPeakVol + current.offPeakVol);
    //Can include weekends,offPeak value as well
    return group;
  };

  const getMonths = (group, current) => {
    let i = group.findIndex(
      //(single) => single.MonthYear === current.MonthYear
      (single) =>
        single.MonthYear === current.MonthYear &&
        single.CurveCode === current.CurveCode
    );
    if (i === -1) {
      return [...group, current];
    }
    group[i].TotalVol = parseInt(group[i].TotalVol + current.TotalVol); //returns totalVolume
    group[i].peakVol = parseInt(group[i].peakVol + current.peakVol); //returns peakVol
    group[i].duosVol = parseInt(group[i].duosVol + current.duosVol); //returns duosVol
    group[i].weekendVol = parseInt(group[i].weekendVol + current.weekendVol); //returns weekendVol
    group[i].offPeakVol = parseInt(group[i].offPeakVol + current.offPeakVol); //returns offPeakVol

    return group;
  };

  const getAnnual = (group, current) => {
    let i = group.findIndex((single) => single.years === current.years);
    if (i === -1) {
      return [...group, current];
    }
    group[i].yearlyDays = parseInt(group[i].daysInMonth + current.daysInMonth); //returns totalVolume

    return group.yearlyDays;
  };

  const perDayData =
    ans &&
    ans
      ?.map(mapper)
      .filter((e) => e.CurveCode !== undefined)
      .reduce(getDays, []);
  perDayData.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a.FromDateTime) - new Date(b.FromDateTime);
  });
  const perDayCopy = ans && JSON.parse(JSON.stringify(perDayData));
  const monthlyView = ans && perDayCopy.reduce(getMonths, []);
  const peakKwh = ans && monthlyView?.map((x) => x.peakVol);
  const maxKwh = Math.max(...peakKwh);
  ans &&
    monthlyView?.map((elem, index) => {
      elem.MonthlyBase = (elem.TotalVol / elem.daysInMonth).toFixed(2);
      elem.Monthly_MW = (elem.TotalVol / 1000 / elem.daysInMonth / 24).toFixed(
        4
      );
      elem.maxKwh = maxKwh;
    });
  data.monthly = monthlyView;
  data.daily = perDayData;

  const getCategories = () => {
    const categories = data.monthly.map((elem) => {
      return elem.CurveCode;
    });
    var uniqueCategories = categories.filter(
      (item, i, ar) => ar.indexOf(item) === i
    );
    category =
      uniqueCategories &&
      uniqueCategories.map((elem) => ({ name: elem, isChecked: true }));
    setCategoryItems(category);
  };

  const filterItems = (e) => {
    const { name, checked } = e.target;
    if (name === "all select") {
      let temp = categoryItems.map((elem) => {
        return {
          ...elem,
          isChecked: checked,
        };
      });
      setCategoryItems(temp);
      setItems(data);
      return;
    } else {
      let temp = categoryItems?.map((elem) =>
        elem.name === name ? { ...elem, isChecked: checked } : elem
      );
      const res1 = data.monthly.filter((page1) =>
        temp.some(
          (page2) => page1.CurveCode === page2.name && page2.isChecked === true
        )
      );
      setCategoryItems(temp);
      setItems({ ...items,monthly:res1 });
    }
    console.log(`The ${name} selected is ${checked}`);
  };
  console.log("%c render viewtabs (parent)",'background: #222; color: #bada55');
  return (
    <>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab className="tab-name" label="Aggregated" value="1" />
              <Tab className="tab-name" label="Monthly" value="2" />
              <Tab className="tab-name" label="Weekly" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div className="row">
              <div className="col-3">
                <Filter
                  filterItems={filterItems}
                  categoryItems={categoryItems}
                />
              </div>
              <div
                className="col-9 upload-block"
                style={{ marginLeft: "-30px" }}
              >
                <AggregatedTable
                  monthlyView={items.monthly}
                  categoryItems={categoryItems}
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel value="2">
            <MonthlyTable perDayData={perDayData} category={categoryItems} />
          </TabPanel>
          <TabPanel value="3">
            <div>Weekly View</div>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
