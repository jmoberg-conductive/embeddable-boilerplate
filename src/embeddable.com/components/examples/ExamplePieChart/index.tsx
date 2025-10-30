/*
 * This component displays a pie chart using Chart.js and now respects your custom theme colors!
 */
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Spinner from '../Spinner';
import Error from '../Error';
import { Pie } from 'react-chartjs-2';
import { Dimension, Measure, Dataset } from '@embeddable.com/core';
import { DataResponse } from '@embeddable.com/core';
import { useTheme } from '@embeddable.com/react';
import { Theme } from '@embeddable.com/vanilla-components';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const chartOptions = (showLegend) => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '45%',
  plugins: {
    legend: {
      display: showLegend,
    },
  },
});

const chartData = (labels, counts, colors) => {
  return {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: colors,
        borderColor: '#fff',
        borderWeight: 5,
      },
    ],
  };
};

type Props = {
  ds: Dataset;
  slice: Dimension;
  metric: Measure;
  results: DataResponse;
  showLegend: boolean;
};

export default (props: Props) => {
  const { slice, metric, showLegend, results } = props;
  const { isLoading, data, error } = results;

  // Get theme colors - this will use your pwtheme colors!
  const theme = useTheme() as Theme;
  const colors = theme?.charts?.pie?.colors || theme?.charts?.colors || [];

  if (isLoading) {
    return <Spinner/>;
  }
  if (error) {
    return <Error msg={error}/>;
  }

  // Chart.js pie expects labels like so: ['US', 'UK', 'Germany']
  const labels = data?.map((d) => d[slice.name]);

  // Chart.js pie expects counts like so: [23, 10, 5]
  const counts = data?.map((d) => d[metric.name]);

  return (
    <>
      <Pie
        options={chartOptions(showLegend)}
        data={chartData(labels, counts, colors)}
        height="100%"
      />
    </>
  );
};
