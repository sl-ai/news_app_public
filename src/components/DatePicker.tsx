'use client';

import { useState, useEffect } from 'react';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const [date, setDate] = useState(selectedDate);
  
  // Get date limits
  const today = new Date();
  today.setDate(today.getDate() - 1)
  const thirtyDaysAgo = new Date(Date.now() - 86400000 * 30); 
  
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const todayFormatted = formatDateForInput(today);
  const thirtyDaysAgoFormatted = formatDateForInput(thirtyDaysAgo);

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
        min={thirtyDaysAgoFormatted}
        max={todayFormatted}
        className="bg-gray-800 px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );
} 