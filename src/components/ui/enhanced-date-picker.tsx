import { useState, useCallback } from "react";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Calendar } from "./calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, setYear, setMonth, addMonths, subMonths } from "date-fns";

interface EnhancedDatePickerProps {
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
  initialFocus 
}: EnhancedDatePickerProps) {
  // Ensure we have a valid date for currentMonth
  const getValidDate = (date?: Date) => {
    if (!date) return new Date();
    if (isNaN(date.getTime())) return new Date();
    return date;
  };
  
  const currentDate = getValidDate(selected);
  const [currentMonth, setCurrentMonth] = useState(currentDate);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [showMonthSelect, setShowMonthSelect] = useState(false);

  // Generate year options (from 1950 to current year + 5)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1950 + 6 }, (_, i) => 1950 + i);
  
  // Month options
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
    { value: 11, label: "December" }
  ];

  const handleYearChange = useCallback((year: string) => {
    const validCurrentMonth = getValidDate(currentMonth);
    const newDate = setYear(validCurrentMonth, parseInt(year));
    setCurrentMonth(newDate);
    setShowYearSelect(false);
  }, [currentMonth]);

  const handleMonthChange = useCallback((month: string) => {
    const validCurrentMonth = getValidDate(currentMonth);
    const newDate = setMonth(validCurrentMonth, parseInt(month));
    setCurrentMonth(newDate);
    setShowMonthSelect(false);
  }, [currentMonth]);

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    onSelect(date);
  }, [onSelect]);

  return (
    <div className="p-3">
      {/* Enhanced Header with Year/Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePreviousMonth}
          className="h-7 w-7 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-1">
          {/* Month Selector */}
          {showMonthSelect ? (
            <Select value={getValidDate(currentMonth).getMonth().toString()} onValueChange={handleMonthChange}>
              <SelectTrigger className="h-7 w-[110px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowMonthSelect(true);
                setShowYearSelect(false);
              }}
              className="h-7 text-sm font-medium hover:bg-gray-100"
            >
              {format(getValidDate(currentMonth), "MMMM")}
            </Button>
          )}

          {/* Year Selector */}
          {showYearSelect ? (
            <Select value={getValidDate(currentMonth).getFullYear().toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="h-7 w-[80px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {yearOptions.reverse().map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowYearSelect(true);
                setShowMonthSelect(false);
              }}
              className="h-7 text-sm font-medium hover:bg-gray-100"
            >
              {format(getValidDate(currentMonth), "yyyy")}
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
          className="h-7 w-7 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Component */}
      <Calendar
        mode={mode}
        selected={selected}
        onSelect={handleDateSelect}
        disabled={disabled}
        month={getValidDate(currentMonth)}
        onMonthChange={(month) => setCurrentMonth(getValidDate(month))}
        initialFocus={initialFocus}
        className="w-full"
        classNames={{
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          day_range_end: "day-range-end",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
      />
    </div>
  );
}