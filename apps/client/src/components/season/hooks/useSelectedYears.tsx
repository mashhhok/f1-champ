import { useState } from "react";

export const useSelectedYear = () => {
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    const handleSeasonClick = (year: number) => {
        setSelectedYear(selectedYear === year ? null : year);
    };

    return { selectedYear, handleSeasonClick };
};