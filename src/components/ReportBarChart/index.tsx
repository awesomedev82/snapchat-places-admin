import Chart, { ChartElement } from "../../base-components/Chart";
import { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "../../utils/colors";
import { selectColorScheme } from "../../stores/colorSchemeSlice";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { useAppSelector } from "../../stores/hooks";
import { useMemo, useEffect, useRef } from "react";

interface MainProps extends React.ComponentPropsWithoutRef<"canvas"> {
  width: number;
  height: number;
}

function Main(props: MainProps) {
  const reportBarChartRef = useRef<ChartElement | null>();
  const colorScheme = useAppSelector(selectColorScheme);
  const darkMode = useAppSelector(selectDarkMode);

  // Fake visitor data
  const reportBarChartData = new Array(25).fill(0).map((data, key) => {
    if (key % 3 == 0 || key % 5 == 0) {
      return Math.ceil(Math.random() * (0 - 20) + 20);
    } else {
      return Math.ceil(Math.random() * (0 - 7) + 7);
    }
  });

  // Fake visitor bar color
  const reportBarChartColor = useMemo(() => {
    return reportBarChartData.map((data) => {
      if (data >= 8 && data <= 14) {
        return colorScheme ? getColor("primary", 0.3) : "";
      } else if (data >= 15) {
        return colorScheme ? getColor("primary", 0.3) : "";
      }

      return colorScheme ? getColor("primary", 0.3) : "";
    });
  }, [colorScheme, darkMode]);

  const reportBarChartBorderColor = useMemo(() => {
    return reportBarChartData.map((data) => {
      if (data >= 8 && data <= 14) {
        return colorScheme ? getColor("primary", 0.7) : "";
      } else if (data >= 15) {
        return colorScheme ? getColor("primary", 0.7) : "";
      }

      return colorScheme ? getColor("primary", 0.7) : "";
    });
  }, [colorScheme, darkMode]);

  const data: ChartData = useMemo(() => {
    return {
      labels: reportBarChartData,
      datasets: [
        {
          categoryPercentage: 0.8,
          barPercentage: 1,
          borderRadius: 1.5,
          data: reportBarChartData,
          borderWidth: 1,
          borderColor: colorScheme ? getColor("primary", 0.7) : "",
          backgroundColor: colorScheme ? getColor("primary", 0.3) : "",
        },
      ],
    };
  }, [colorScheme, darkMode]);

  const options: ChartOptions = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            display: false,
            beginAtZero: true,
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
      },
    };
  }, [colorScheme, darkMode]);

  useEffect(() => {
    setInterval(() => {
      if (reportBarChartRef.current) {
        const chartInstance = reportBarChartRef.current.instance;
        const chartConfig = chartInstance.config;

        // Swap visitor data
        const newData = chartConfig.data.datasets[0].data[0];
        chartConfig.data.datasets[0].data.shift();
        chartConfig.data.datasets[0].data.push(newData);
        chartInstance.update();

        // Swap visitor bar color
        if (Array.isArray(chartConfig.data.datasets[0].backgroundColor)) {
          const newColor = chartConfig.data.datasets[0].backgroundColor[0];
          chartConfig.data.datasets[0].backgroundColor.shift();
          chartConfig.data.datasets[0].backgroundColor.push(newColor);
        }
        chartInstance.update();
      }
    }, 1500);
  }, [reportBarChartRef.current]);

  return (
    <Chart
      type="bar"
      width={props.width}
      height={props.height}
      data={data}
      options={options}
      className={props.className}
      getRef={(el) => {
        reportBarChartRef.current = el;
      }}
    />
  );
}

Main.defaultProps = {
  width: "auto",
  height: "auto",
  className: "",
};

export default Main;
