import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { KlineData } from '@/types';

type TimeFrame =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '1d'
  | '3d'
  | '5d'
  | '1w'
  | '3w'
  | '1M'
  | '3M';

interface KlineChartProps {
  data: KlineData[];
  isActive: boolean;
  timeframe?: TimeFrame;
  onTimeframeChange?: (tf: TimeFrame) => void;
  showControls?: boolean;
}

export const KlineChart: React.FC<KlineChartProps> = ({ data, isActive, timeframe, onTimeframeChange, showControls = true }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const fitTimerRef = useRef<number | null>(null);
  const [internalTimeFrame, setInternalTimeFrame] = useState<TimeFrame>('1m');
  const currentTimeFrame: TimeFrame = timeframe ?? internalTimeFrame;

  // 你可以根据需求决定是否显示成交量
  const showVolume = true;

  // 时间周期配置
  const timeFrames: { value: TimeFrame; label: string }[] = [
    { value: '1m', label: '1分' },
    { value: '3m', label: '3分' },
    { value: '5m', label: '5分' },
    { value: '15m', label: '15分' },
    { value: '1d', label: '1日' },
    { value: '3d', label: '3日' },
    { value: '5d', label: '5日' },
    { value: '1w', label: '1周' },
    { value: '3w', label: '3周' },
    { value: '1M', label: '1月' },
    { value: '3M', label: '3月' },
  ];

  // 根据当前时间周期聚合数据
  const aggregatedData = aggregateDataByTimeframe(data, currentTimeFrame);
  console.log('[KlineChart] 聚合后K线条数:', currentTimeFrame, aggregatedData.length);
  
  // K线数据和成交量数据 - 转换时间戳格式
  const chartData: CandlestickData[] = aggregatedData.map(item => ({
    time: Math.floor(item.timestamp / 1000) as any, // 转换为秒级时间戳
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close
  }));

  const volumeData = aggregatedData.map(item => ({
    time: Math.floor(item.timestamp / 1000) as any, // 转换为秒级时间戳
    value: item.volume,
    color: item.close >= item.open ? 'rgba(255, 68, 68, 0.5)' : 'rgba(0, 170, 0, 0.5)' // 红涨绿跌
  }));

  useEffect(() => {
    console.log('[KlineChart] 初始化图表');
    if (!chartContainerRef.current) return;

    // 确保容器有尺寸
    const container = chartContainerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 400;

    // 创建图表（仅初始化一次）
    const chart = createChart(container, {
      width,
      height,
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
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 3,
        barSpacing: 6,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    // 创建K线图系列 - 中国风格：红涨绿跌
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#ff4444',
      downColor: '#00aa00',
      borderDownColor: '#00aa00',
      borderUpColor: '#ff4444',
      wickDownColor: '#00aa00',
      wickUpColor: '#ff4444',
      priceFormat: {
        type: 'price',
        precision: 6,
        minMove: 0.000001,
      }
    });

    // 初始设置K线数据
    if (chartData.length > 0) {
      candlestickSeries.setData(chartData);
    } else {
      candlestickSeries.setData([]);
    }

    // 创建成交量图系列
    let volumeSeries: ISeriesApi<"Histogram"> | null = null;
    if (showVolume && volumeData.length > 0) {
      volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
      });
      volumeSeries.setData(volumeData);
      
      // 设置成交量图的位置
      try {
        chart.priceScale('volume').applyOptions({
          scaleMargins: {
            top: 0.8,
            bottom: 0,
          },
        });
      } catch (e) {
        console.warn('Failed to set volume scale margins:', e);
      }
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

    window.addEventListener('resize', handleResize);

    // 适配内容（强制）
    fitTimerRef.current = window.setTimeout(() => {
      if (chartRef.current) {
        try { chartRef.current.timeScale().fitContent(); } catch {}
      }
    }, 50);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (fitTimerRef.current) {
        clearTimeout(fitTimerRef.current);
        fitTimerRef.current = null;
      }
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candleSeriesRef.current = null;
        volumeSeriesRef.current = null;
      }
    };
  }, []);

  // 在图表容器上拦截默认滚动（不阻止事件传播），避免中间区域滚动影响；图表自身仍可处理缩放/拖拽
  useEffect(() => {
    const el = chartContainerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // DEBUG: 验证捕获是否生效
      try { console.debug('[KlineChart] wheel captured', { target: (e.target as Element)?.tagName, deltaY: e.deltaY }); } catch {}
      // 阻止页面/容器滚动，但允许事件到达目标（图表库仍可处理缩放/拖拽）
      e.preventDefault();
    };
    const onTouchMove = (e: TouchEvent) => {
      try { console.debug('[KlineChart] touchmove captured', { target: (e.target as Element)?.tagName }); } catch {}
      e.preventDefault();
    };
    el.addEventListener('wheel', onWheel, { passive: false, capture: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
    return () => {
      el.removeEventListener('wheel', onWheel as EventListener, true);
      el.removeEventListener('touchmove', onTouchMove as EventListener, true);
    };
  }, []);

  // 数据或时间周期变化时，仅更新系列数据，不销毁图表
  useEffect(() => {
    if (!candleSeriesRef.current) return;
    if (chartData.length > 0) {
      try { candleSeriesRef.current.setData(chartData); } catch {}
    } else {
      try { candleSeriesRef.current.setData([]); } catch {}
    }
    if (volumeSeriesRef.current && showVolume) {
      try { volumeSeriesRef.current.setData(volumeData); } catch {}
    }
    // 每次切换周期后适配视图
    if (chartRef.current) {
      try { chartRef.current.timeScale().fitContent(); } catch {}
    }
  }, [chartData, volumeData, currentTimeFrame]);

  // 根据时间周期动态优化 timeScale 交互手感
  useEffect(() => {
    if (!chartRef.current) return;
    const tf = currentTimeFrame;
    // 默认值
    let barSpacing = 6;
    let rightOffset = 3;
    if (tf.endsWith('d')) {
      barSpacing = 8;
      rightOffset = 5;
    }
    if (tf.endsWith('w') || tf.endsWith('M')) {
      barSpacing = 12;
      rightOffset = 6;
    }
    try {
      chartRef.current.applyOptions({ timeScale: { barSpacing, rightOffset } });
    } catch {}
  }, [currentTimeFrame]);

  // 监听来自 AssetCard 的全局时间周期切换事件（受控与未受控都监听）
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as TimeFrame | undefined;
      if (!detail) return;
      console.log('[KlineChart] 收到全局切换事件:', detail);
      if (onTimeframeChange) {
        onTimeframeChange(detail);
      } else if (!timeframe) {
        setInternalTimeFrame(detail);
      }
    };
    window.addEventListener('kline:setTimeframe', handler as EventListener);
    return () => window.removeEventListener('kline:setTimeframe', handler as EventListener);
  }, [timeframe, onTimeframeChange]);

  // 兜底：轮询全局变量，同步周期（防止某些环境自定义事件失效）
  useEffect(() => {
    const timer = setInterval(() => {
      // @ts-ignore
      const tf = window.__kline_tf as TimeFrame | undefined;
      if (!tf) return;
      if (onTimeframeChange) {
        if (tf !== currentTimeFrame) onTimeframeChange(tf);
      } else if (!timeframe && tf !== internalTimeFrame) {
        setInternalTimeFrame(tf);
      }
    }, 300);
    return () => clearInterval(timer);
  }, [timeframe, onTimeframeChange, currentTimeFrame, internalTimeFrame]);

  // 更新K线数据（实时模拟）
  useEffect(() => {
    if (!isActive || !candleSeriesRef.current || chartData.length === 0) return;

    const interval = setInterval(() => {
      const lastPoint = chartData[chartData.length - 1];
      if (!lastPoint) return;

      const change = (Math.random() - 0.5) * lastPoint.close * 0.01;
      const newClose = Math.max(0.000001, lastPoint.close + change); // 确保价格为正
      const newHigh = Math.max(lastPoint.high, newClose);
      const newLow = Math.min(lastPoint.low, newClose);

      const updatedPoint = {
        ...lastPoint,
        high: newHigh,
        low: newLow,
        close: newClose,
      };

      candleSeriesRef.current!.update(updatedPoint);

      // 更新成交量图
      if (volumeSeriesRef.current && showVolume && volumeData.length > 0) {
        const lastVolume = volumeData[volumeData.length - 1];
        const newVolume = {
          ...lastVolume,
          value: Math.max(1, lastVolume.value * (0.9 + Math.random() * 0.2)),
          color: newClose >= lastPoint.close ? 'rgba(255, 68, 68, 0.5)' : 'rgba(0, 170, 0, 0.5)'
        };
        volumeSeriesRef.current.update(newVolume);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, chartData, volumeData, showVolume]);

  // 当激活状态改变时，调整图表显示
  useEffect(() => {
    if (chartRef.current && isActive) {
      chartRef.current.timeScale().fitContent();
    }
  }, [isActive]);

  // 处理时间周期切换
  const handleTimeFrameChange = (timeFrame: TimeFrame) => {
    if (onTimeframeChange) {
      onTimeframeChange(timeFrame);
    } else {
      setInternalTimeFrame(timeFrame);
    }
  };

  return (
    <div className={`w-full h-full relative`}>
      {/* 当前时间周期徽标（右上角，非交互） */}
      <div className="absolute top-2 right-2 z-20 text-xs px-2 py-1 rounded bg-gray-800/80 text-white pointer-events-none select-none">
        {currentTimeFrame}
      </div>
      {/* 时间周期选择器（可隐藏） */}
      {showControls && (
        <div className="absolute top-2 left-2 z-10 flex space-x-1 bg-gray-800/80 backdrop-blur-sm rounded-lg p-1">
          {timeFrames.map((tf) => (
            <button
              key={tf.value}
              onClick={() => handleTimeFrameChange(tf.value)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                currentTimeFrame === tf.value
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      )}
      
      {/* K线图容器（始终允许交互：缩放/拖拽） */}
      <div
        ref={chartContainerRef}
        className={`kline-chart w-full h-full select-none`}
        style={{ background: 'transparent', overscrollBehavior: 'contain', touchAction: 'none', border: '1px solid red', zIndex: 50, position: 'relative' }}
        onWheelCapture={(e) => { try { console.debug('[KlineChart] onWheelCapture (React)'); } catch {}; e.preventDefault(); }}
        onTouchMoveCapture={(e) => { try { console.debug('[KlineChart] onTouchMoveCapture (React)'); } catch {}; e.preventDefault(); }}
      />
    </div>
  );
};

// 根据时间周期聚合数据
export function aggregateDataByTimeframe(data: KlineData[], timeframe: TimeFrame): KlineData[] {
  if (!data || data.length === 0) return [];
  // 规范化时间戳：自动识别秒/毫秒并统一为毫秒
  const maxTs = Math.max(...data.map(d => d.timestamp));
  const isSeconds = maxTs < 1e12; // 小于 10^12 视为秒
  const normalized = isSeconds
    ? data.map(d => ({ ...d, timestamp: d.timestamp * 1000 }))
    : data;

  const timeframeMinutes: Record<TimeFrame, number> = {
    '1m': 1,
    '3m': 3,
    '5m': 5,
    '15m': 15,
    '1d': 1440,
    '3d': 1440 * 3,
    '5d': 1440 * 5,
    '1w': 10080,         // 7天
    '3w': 10080 * 3,     // 21天
    '1M': 1440 * 30,     // 约30天
    '3M': 1440 * 90,     // 约90天
  };
  
  const intervalMs = timeframeMinutes[timeframe] * 60 * 1000;
  const aggregatedData: KlineData[] = [];
  
  // 按时间周期分组数据
  const groups: { [key: number]: KlineData[] } = {};
  
  normalized.forEach(item => {
    const groupKey = Math.floor(item.timestamp / intervalMs) * intervalMs;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
  });
  
  // 聚合每组数据
  Object.keys(groups).forEach(key => {
    const group = groups[parseInt(key)];
    if (group.length === 0) return;
    
    const timestamp = parseInt(key);
    const open = group[0].open;
    const close = group[group.length - 1].close;
    const high = Math.max(...group.map(item => item.high));
    const low = Math.min(...group.map(item => item.low));
    const volume = group.reduce((sum, item) => sum + item.volume, 0);
    
    aggregatedData.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume
    });
  });
  
  return aggregatedData.sort((a, b) => a.timestamp - b.timestamp);
}