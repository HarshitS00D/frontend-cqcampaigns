import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Chart, LineAdvance } from "bizcharts";

import { getUserAnalytics } from "../../actions/analyticsActions";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Analytics = () => {
  const dispatch = useDispatch();
  const userAnalyticsData = useSelector((state) => state.analytics) || [];

  useEffect(() => {
    dispatch(getUserAnalytics("month"));
  }, [dispatch]);

  return (
    <Chart
      padding={[10, 20, 50, 40]}
      autoFit
      height={270}
      data={getChartdata(userAnalyticsData)}
    >
      <LineAdvance shape="straight" point position="x*y" color="type" />
    </Chart>
  );
};

function getChartdata(userAnalyticsData) {
  const data = [];
  const visited = months.map(() => false);

  userAnalyticsData.forEach(({ _id: { monthNo } }) => {
    visited[monthNo - 1] = true;
  });
  let i = 0;
  userAnalyticsData.forEach(
    ({ _id: { monthNo }, sent, delivered, bounced }) => {
      data.push({ type: "sent", y: sent, x: months[monthNo - 1] });
      data.push({ type: "delivered", y: delivered, x: months[monthNo - 1] });
      data.push({ type: "bounced", y: bounced, x: months[monthNo - 1] });
      if (monthNo < 12)
        for (i = monthNo; i < months.length; i++) {
          if (visited[i]) break;
          data.push({ type: "sent", y: 0, x: months[i] });
          data.push({ type: "delivered", y: 0, x: months[i] });
          data.push({ type: "bounced", y: 0, x: months[i] });
          visited[i] = true;
        }
    }
  );
  for (; i < months.length; i++) {
    if (visited[i]) break;
    data.push({ type: "sent", y: 0, x: months[i] });
    data.push({ type: "delivered", y: 0, x: months[i] });
    data.push({ type: "bounced", y: 0, x: months[i] });
    visited[i] = true;
  }
  console.log(data);
  return data;
}

export default Analytics;
