'use client';

import { useState, useEffect } from 'react';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const [date, setDate] = useState(selectedDate);
  
  // Set fixed date range: 8/1/2025 to 8/31/2025
  const minDate = new Date('2025-08-01');
  const maxDate = new Date('2025-08-31');
  
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const minDateFormatted = formatDateForInput(minDate);
  const maxDateFormatted = formatDateForInput(maxDate);

  // Update local state when prop changes
  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    onDateChange(newDate);
  };

  return (
    <div className="flex text-white items-center gap-2">
      <label htmlFor="newsDate" className="whitespace-nowrap">
        Select Date:
      </label>
      <input
        type="date"
        id="newsDate"
        value={date}
        onChange={(e) => handleDateChange(e.target.value)}
        min={minDateFormatted}
        max={maxDateFormatted}
        className="bg-gray-800 px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );
} 