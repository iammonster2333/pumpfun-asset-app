import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { KlineData } from '@/types';

interface KlineChartProps {
  data: KlineData[];
  isActive: boolean;
}

export const KlineChart: React.FC<KlineChartProps> = ({ data, isActive }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 创建图表
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: 'transparent' },
        textColor: '#ffffff',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#3b82f6',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: '#3b82f6',
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textColor: '#ffffff',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textColor: '#ffffff',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: false,
        horzTouchDrag: false,
        vertTouchDrag: false,
      },
      handleScale: {
        axisPressedMouseMove: false,
        mouseWheel: false,
        pinch: false,
      },
    });

    // 创建K线图系列
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#4caf50',
      downColor: '#ff5252',
      borderDownColor: '#ff5252',
      borderUpColor: '#4caf50',
      wickDownColor: '#ff5252',
      wickUpColor: '#4caf50',
      priceFormat: {
        type: 'price',
        precision: 6,
        minMove: 0.000001,
      }
    });
    
    // 添加成交量图表
    let volumeSeries = null;
    if (showVolume) {
      volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

    // 设置K线数据
    candlestickSeries.setData(chartData);
    
    // 设置成交量数据
    if (volumeSeries && showVolume) {
      volumeSeries.setData(volumeData);
    }

    // 保存引用
    chartRef.current = chart;
    candleSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    // 调整大小处理函数
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight 
        });
      }
    };

    // 添加窗口大小变化监听
    window.addEventListener('resize', handleResize);
    
    // 设置图表动画效果
    if (isActive) {
      chart.timeScale().fitContent();
    }

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candleSeriesRef.current = null;
        volumeSeriesRef.current = null;
      }
    };
  }, [data, isActive]);

  // 更新K线数据（实时模拟）
  useEffect(() => {
    if (!isActive || !candleSeriesRef.current || chartData.length === 0) return;

    // 模拟实时数据更新
    const interval = setInterval(() => {
      // 获取最后一个数据点
      const lastPoint = chartData[chartData.length - 1];
      
      // 随机生成价格变化
      const change = (Math.random() - 0.5) * lastPoint.close * 0.01;
      const newClose = lastPoint.close + change;
      const newHigh = Math.max(lastPoint.high, newClose);
      const newLow = Math.min(lastPoint.low, newClose);
      
      // 更新最后一个数据点
      const updatedPoint = {
        ...lastPoint,
        high: newHigh,
        low: newLow,
        close: newClose,
      };
      
      // 更新K线图
      candleSeriesRef.current.update(updatedPoint);
      
      // 更新成交量图
      if (volumeSeriesRef.current && showVolume) {
        const lastVolume = volumeData[volumeData.length - 1];
        const newVolume = {
          ...lastVolume,
          value: lastVolume.value * (0.9 + Math.random() * 0.2), // 随机波动成交量
          color: newClose >= lastPoint.close ? 'rgba(76, 175, 80, 0.5)' : 'rgba(255, 82, 82, 0.5)'
        };
        volumeSeriesRef.current.update(newVolume);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, chartData, volumeData, showVolume]);

  // 当激活状态改变时，调整图表显示
  useEffect(() => {
    if (chartRef.current && isActive) {
      // 自动滚动到最新数据
      chartRef.current.timeScale().fitContent();
    }
  }, [isActive]);

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
};

// 根据时间周期过滤数据
function filterDataByTimeframe(data: KlineData[], timeframe: '1h' | '1d' | '1w' | '1m'): KlineData[] {
  if (!data || data.length === 0) return [];
  
  // 对于演示目的，我们只是返回原始数据
  // 在实际应用中，这里应该根据时间周期聚合数据
  return data;
}