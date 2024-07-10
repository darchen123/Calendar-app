import React, { useState } from "react";
import axios from "axios";

/* This component is used to get the data from the Aurora API and the create
events in Google Calendar using the data from the API. Used to schedule the
workers schedule for the month
*/

const AuroraGetData = ({ idCalendar }) => {
  const [createdEvents, setCreatedEvents] = useState(false);

  const handleFetchedEvent = async () => {
    try {
      const firstProcess = await axios.post('/api/deleteCreateSchedule', {idCalendar});
      console.log('Events Deleted:', firstProcess.statusText);

      // const response = await axios.post('/api/grabSchedule', {
      //   idCalendar,
      // });
      // console.log('Event Data:', response.data);
      setCreatedEvents(true);
    } catch (error) {
      console.error('Error creating work events:', error);
    }
  };

  return (
    <div>
      <h2 style={{
        textDecoration: 'underline', paddingTop: "125px ",
        paddingBottom: "10px"
      }}>Import Work Schedule</h2>
      {createdEvents && <p>Events Created</p>}
      <button type='button' onClick={handleFetchedEvent}>Import Schedule</button>
    </div>
  );
};

export default AuroraGetData;

