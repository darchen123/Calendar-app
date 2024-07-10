import React, { useEffect, useState } from 'react';
import axios from "axios";

/*  This component is to display the next 5 events that are going to occur
    This was pulled from index.html and needs to be changed to fit the react
    and javascipt way. Also needs to call the backend and send the data
    to the backend and then retrieve the information and display the information
    on the screen.
    Will need to figure out how to put it in the top right corner
    in small list with it's own title. Maybe later can see if can make a mini calendar
    and input these events into the calendar.
*/

const EventList = ({ calendarId, eventCreated }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`/api/grabbingEvents/${calendarId}`);
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [calendarId, eventCreated]);

    return (
        <div style={{ textAlign: 'center' }}>
            <h2 style={{
                textAlign: 'center', textDecoration: 'underline',
                paddingTop: "30px"
            }}>Upcoming Events</h2>
            {events.length === 0 ? (
                <p>No Events</p>
            ) : (
                <ul style={{ listStyleType: 'disk', textIndent: 10, paddingLeft: 0 }}>
                    {events.map((event) => (
                        <li key={event.id} style={{ marginBottom: '15px' }}>
                            {event.summary} - {event.start.dateTime ? (
                                new Date(event.start.dateTime).toLocaleString()
                            ) : (
                                <>{new Date(event.start.date).toLocaleDateString()}, All Day</>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EventList;