"use client";

import { useState, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, setYear, setMonth, addMonths, subMonths } from "date-fns";
import { cn } from "./utils";

interface CalendarProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  mode?: "single";
  initialFocus?: boolean;
}

export function EnhancedDatePicker({
  selected,
  onSelect,
  disabled,
  mode = "single",
  initialFocus,
}: CalendarProps) {
  const getValidDate = (date?: Date) => {
    if (!date) return new Date();
    if (isNaN(date.getTime())) return new Date();
    return date;
  };

  const currentDate = getValidDate(selected);
  const [currentMonth, setCurrentMonth] = useState(currentDate);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 1950 + 6 },
    (_, i) => 1950 + i
  ).reverse();

  const monthOptions = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  const handleYearChange = useCallback(
    (year: string) => {
      const newDate = setYear(getValidDate(currentMonth), parseInt(year));
      setCurrentMonth(newDate);
      setYearOpen(false);
    },
    [currentMonth]
  );

  const handleMonthChange = useCallback(
    (month: string) => {
      const newDate = setMonth(getValidDate(currentMonth), parseInt(month));
      setCurrentMonth(newDate);
      setMonthOpen(false);
    },
    [currentMonth]
  );

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      onSelect(date);
    },
    [onSelect]
  );

  return (
    <div className="p-3">
      {/* Custom Header */}
      <div className="flex items-center justify-between pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePreviousMonth}
          className="h-7 w-7 p-0"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Select
            value={getValidDate(currentMonth).getMonth().toString()}
            onValueChange={handleMonthChange}
            open={monthOpen}
            onOpenChange={(open) => {
              setMonthOpen(open);
              if (open) setYearOpen(false);
            }}
          >
            <SelectTrigger className="h-7 w-[100px] text-sm pr-2 [&>svg]:hidden">
              <SelectValue>
                {format(getValidDate(currentMonth), "MMMM")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={getValidDate(currentMonth).getFullYear().toString()}
            onValueChange={handleYearChange}
            open={yearOpen}
            onOpenChange={(open) => {
              setYearOpen(open);
              if (open) setMonthOpen(false);
            }}
          >
            <SelectTrigger className="h-7 w-[70px] text-sm pr-2 [&>svg]:hidden">
              <SelectValue>{format(getValidDate(currentMonth), "yyyy")}</SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
          className="h-7 w-7 p-0"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <DayPicker
        mode={mode}
        selected={selected}
        onSelect={handleDateSelect}
        disabled={disabled}
        month={getValidDate(currentMonth)}
        onMonthChange={(month) => setCurrentMonth(getValidDate(month))}
        showOutsideDays
        className="w-full pt-0"
        classNames={{
          months: "space-y-0",
          month: "space-y-0",
          caption: "sr-only",
          caption_label: "sr-only",
          nav: "hidden",
          table: "w-full border-separate border-spacing-1", // Ensure even spacing
          head_row: "flex justify-center", // Center-align headers
          head_cell: "w-9 text-xs font-medium text-gray-500 text-center", // Fixed width for headers
          row: "flex justify-center", // Center-align rows
          cell: cn(
            "h-9 w-9 p-0 text-center text-sm relative",
            "hover:bg-gray-100",
            "aria-selected:bg-blue-100 aria-selected:text-blue-600"
          ),
          day_today: "font-bold text-blue-600",
          day_outside: "text-gray-400",
          day_disabled: "text-gray-300 opacity-50",
          day_hidden: "invisible",
        }}
        styles={{
          
          table: {
            width: "90%",
            tableLayout: "fixed", // Ensure fixed table layout for consistent column widths
            borderSpacing: "0.125rem", // Adjust spacing between cells
          },
          cell: {
            padding: "0.125rem",
            width: "calc(100% / 7)", // Ensure each day takes 1/7th of the container width
            textAlign: "center", // Center-align content within each cell
          },
          
        }}
      />
    </div>
  );
}