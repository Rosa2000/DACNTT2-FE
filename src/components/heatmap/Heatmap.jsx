import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './Heatmap.module.css'; // Import your custom CSS for styling

const Heatmap = () => {
    const shiftDate = (date, numDays) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + numDays);
        return newDate.toISOString().slice(0, 10);
      };

    const today = new Date();
    console.log(today);  
    
    return (
        <CalendarHeatmap
            // startDate={shiftDate(today, -200)}
            // endDate={today}
            showWeekdayLabels={true}
            weekdayLabels={['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']}
            monthLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            values={[
                { date: '2025-04-01', count: 2 },
                { date: '2025-04-02', count: 4 },
                { date: '2025-04-03', count: 100 },
                { date: '2025-04-04', count: 2 },
                { date: '2025-04-05', count: 4 },
                { date: '2025-04-06', count: 100 },
                // ...
            ]}
            classForValue={(value) => {
                if (!value) return 'color-empty';
                if (value.count > 50) return 'color-very-high';
                if (value.count > 30) return 'color-high';
                if (value.count > 15) return 'color-medium';
                if (value.count > 0) return 'color-low';
                return 'color-empty';
            }}
        />
    );
};

export default Heatmap;
