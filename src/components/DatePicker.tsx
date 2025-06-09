'use client';

import { useState } from 'react';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="flex items-center gap-2 mb-6">
      <label htmlFor="newsDate" className="text-white">
        Select Date:
      </label>
      <input
        type="date"
        id="newsDate"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        min={thirtyDaysAgo}
        max={today}
        className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );
} 