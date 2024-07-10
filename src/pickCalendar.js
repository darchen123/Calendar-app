import React, { useState, useEffect } from "react";
import axios from "axios";

// Object to get the calendars
const CalendarSelection = ({ onCalendarSelect }) => {
    const [calendars, setCalendars] = useState([]);
    const [loading, setLoading] = useState(true);

    // Gets the calendar data from the backend 
    useEffect(() => {
        async function fetchCalendars() {
            try {
                // Sends request to the backend to get the information
                const response = await axios.get('/api/listCalendars');
                setCalendars(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching calendars:', error);
                setLoading(true); // Ensure loading state is cleared on error

            }
        }
        // Puts each Calendar in the array for the user to pick
        fetchCalendars();
    }, []);

    // This handles when the calendar is selected and assigns the values
    const handleSelectChange = (e) => {
        // Passes the value of the calendar selected, the value(the id)
        const selectedCalendarId = e.target.value;
        // Looks through the array to match the selectedCalendar Id to the selected calendar id
        const selectedCalendar = calendars.find(calendar => calendar.id === selectedCalendarId);
        // Sends the data of the selected option to App.js
        onCalendarSelect(selectedCalendar.id, selectedCalendar.summaryCalendar); // Pass selectedCalendar to parent component
    };

    // To tell the user that the app is retrieving the information
    if (loading) {
        return <p>Loading calendars...</p>;
    }
    // Returns the txt and button to select the calendar
    // Select is to make a drop down menu and key/value is for map
    return (
        <div>
            <select onChange={handleSelectChange}>
                <option value="">Select a calendar</option>
                {calendars.map((calendar) => (
                    <option key={calendar.id} value={calendar.id}>
                        {calendar.summaryCalendar}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CalendarSelection;
