import React, { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './Heatmap.module.css'; // Import your custom CSS for styling

const Heatmap = ({ values = [] }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const today = new Date();
    const numDays = isMobile ? 90 : 180; // 3 tháng cho mobile, 6 tháng cho desktop

    const startDate = new Date();
    startDate.setDate(today.getDate() - numDays);
    
    return (
        <CalendarHeatmap
            startDate={startDate}
            endDate={today}
            showWeekdayLabels={true}
            weekdayLabels={['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']}
            monthLabels={['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']}
            values={values}
            classForValue={(value) => {
                if (!value) return 'color-empty';
                if (value.count > 7) return 'color-very-high';
                if (value.count > 5) return 'color-high';
                if (value.count > 3) return 'color-medium';
                if (value.count > 0) return 'color-low';
                return 'color-empty';
            }}
        />
    );
};

export default Heatmap;
