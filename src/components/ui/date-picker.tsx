import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
  error = false,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            error && "border-red-500",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  allowCurrent?: boolean;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startPlaceholder = "Start date",
  endPlaceholder = "End date",
  className,
  disabled = false,
  error = false,
  allowCurrent = true,
}: DateRangePickerProps) {
  return (
    <div className={cn("flex space-x-2", className)}>
      <div className="flex-1">
        <DatePicker
          value={startDate}
          onChange={onStartDateChange}
          placeholder={startPlaceholder}
          disabled={disabled}
          error={error}
        />
      </div>
      <div className="flex-1">
        {allowCurrent ? (
          <div className="flex space-x-2">
            <DatePicker
              value={endDate}
              onChange={onEndDateChange}
              placeholder={endPlaceholder}
              disabled={disabled}
              error={error}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEndDateChange(undefined)}
              className="px-3"
            >
              Current
            </Button>
          </div>
        ) : (
          <DatePicker
            value={endDate}
            onChange={onEndDateChange}
            placeholder={endPlaceholder}
            disabled={disabled}
            error={error}
          />
        )}
      </div>
    </div>
  );
}