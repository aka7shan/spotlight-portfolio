"use client";

import "react-day-picker/dist/style.css";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "./utils";

export function Calendar({
  className,
  classNames = {},
  styles = {},
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      styles={{
        caption: { display: 'outside' }, // This will completely hide the built-in caption
        table: {
          width: "100%",
          tableLayout: "fixed",
          borderCollapse: "collapse",
        },
        head_row: { display: "table-row" },
        row: { display: "table-row" },
        head_cell: {
          display: "table-cell",
          padding: "0.25rem",
          textAlign: "center",
          verticalAlign: "middle",
        },
        cell: {
          display: "table-cell",
          padding: 0,
          textAlign: "center",
          verticalAlign: "middle",
          width: `${100 / 7}%`,
        },
        ...styles
      }}
      classNames={{
        months: "block",
        month: "block",
        // caption: "", // Double protection to hide caption
        // caption_label: "hidden",
        // nav: "hidden", // Hide navigation buttons if using custom ones
        table: "w-full",
        head_row: "",
        head_cell: "text-gray-600 text-xs font-medium",
        row: "",
        cell: "",
        day: "select-none",
        day_today: "font-bold text-black-600",
        day_outside: "text-gray-300",
        day_disabled: "text-gray-300 opacity-50",
        ...classNames
      }}
      {...props}
    />
  );
}