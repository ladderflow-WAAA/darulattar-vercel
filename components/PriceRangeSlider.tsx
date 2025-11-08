import React, { useState, useEffect, useCallback, useRef } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  values: { min: number; max: number };
  onChange: (values: { min: number; max: number }) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ min, max, values, onChange }) => {
  const [minVal, setMinVal] = useState(values.min);
  const [maxVal, setMaxVal] = useState(values.max);
  const range = useRef<HTMLDivElement>(null);
  const debouncedOnChange = useRef(onChange);

  // Debounce logic using useRef to avoid re-creating timeout on every render
  useEffect(() => {
    const handler = setTimeout(() => {
      if (values.min !== minVal || values.max !== maxVal) {
        debouncedOnChange.current({ min: minVal, max: maxVal });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [minVal, maxVal, values.min, values.max]);


  // Update local state when parent values change (e.g., on filter reset)
  useEffect(() => {
    setMinVal(values.min);
    setMaxVal(values.max);
  }, [values]);

  const getPercent = useCallback(
    (value: number) => {
      if (max === min) return 0;
      return Math.round(((value - min) / (max - min)) * 100);
    },
    [min, max]
  );
  
  const handleMinRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(event.target.value), maxVal - 1);
    setMinVal(value);
  };

  const handleMaxRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(event.target.value), minVal + 1);
    setMaxVal(value);
  };
  
  const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= min && value < maxVal) {
      setMinVal(value);
    }
  };
  
  const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      if (value > minVal && value <= max) {
        setMaxVal(value);
      }
  };

  const minPercent = getPercent(minVal);
  const maxPercent = getPercent(maxVal);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 text-sm">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">₹</span>
          <input
            type="number"
            value={minVal}
            onChange={handleMinInputChange}
            className="w-28 bg-brand-dark border border-gray-700 rounded-sm py-1.5 pl-7 pr-2 text-gray-200 focus:ring-brand-gold focus:border-brand-gold"
            min={min}
            max={max}
            aria-label="Minimum price"
          />
        </div>
        <div className="w-2 h-px bg-gray-600"></div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">₹</span>
          <input
            type="number"
            value={maxVal}
            onChange={handleMaxInputChange}
            className="w-28 bg-brand-dark border border-gray-700 rounded-sm py-1.5 pl-7 pr-2 text-gray-200 focus:ring-brand-gold focus:border-brand-gold"
            min={min}
            max={max}
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className="relative h-8 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinRangeChange}
          className="thumb thumb--zindex-3"
          disabled={min === max}
          aria-label="Minimum price slider"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxRangeChange}
          className="thumb thumb--zindex-4"
          disabled={min === max}
          aria-label="Maximum price slider"
        />

        <div className="relative w-full mx-[10px]">
          <div className="absolute w-full h-1 rounded-full bg-gray-700 z-10"></div>
          <div
            ref={range}
            className="absolute h-1 rounded-full bg-brand-gold z-20"
            style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;