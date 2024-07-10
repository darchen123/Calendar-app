import './App.css';
import React, { useState } from 'react';
// Import the login method used from react-outh/google
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import CalendarSelection from './pickCalendar';
import EventList from './mini_Calendar';
import AuroraGetData from './aurora';

function App() {

  // Sends request to the backend to get access tokens
  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        // Wait for the backend to send the credentials
        const response = await axios.post('/google-auth', { code });
        // console.log('Tokens received:', response.data);
        console.log('Tokens received:', response.statusText);
        console.log('Logged in successfully with code:');
        // When true, move onto the next screen to input event data
        setSignedIn(true);
      } catch (error) {
        console.error('Error', error);
      }
    },
    // Specifies that OAuth flow is being used
    flow: 'auth-code',
    // Specifies scope of access requested by the application
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
  });

  const handleGoogleLogout = () => {
    setSignedIn(false); // Update local state to indicate signed out
    setSelectedCalendarId(null); // Clear selected calendar
    setSelectCalSummary(null); // Clear selected calendar summary
  };

  // Set variables to the state that will be changed
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [selectCalSummary, setSelectCalSummary] = useState(null);
  const [eventCreate, setEventCreate] = useState(false);


  // This handles the user's calendar selection and sets the calendar Id and Summary
  const handleCalendarSelect = (calId, calSummary) => {
    setSelectedCalendarId(calId);
    setSelectCalSummary(calSummary);
    console.log('The calendar:', calSummary);
  };

  // Back button to go back to calendar selection
  const handleBackToCalendarSelection = () => {
    setSelectedCalendarId(null);
    setSelectCalSummary(null);
    setSummary('');
    setDescription('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
    setAllDay(false);
    setEventCreate(false);
  };

  // const handleBackToSignIn = () => {
  //   setSignedIn(false);
  // }

  // Handle form submission so can use the data
  const handleSubmit = async (e) => {
    // Prevents default form submission to handle the submission programmatically
    e.preventDefault();
    console.log(summary, description, location, startDate, endDate, allDay);

    // Creating the Event
    try {
      // Make sure all the required fields are filled
      if (!summary || !startDate || !endDate) {
        console.error('Summary, start date, and end date are required.');
        return;
      }

      // Object that contains the event data to be sent to google calendar
      const eventData = {
        calendarIdentification: selectedCalendarId,
        summary,
        description,
        location,
        startDate,
        endDate,
        startTime,
        endTime,
        allDay,
      };

      console.log('Event Data:', eventData);

      // Call the backend API to create the event in Google Calendar
      const response = await axios.post('/api/create-event', eventData);

      // Handle the response from the backend if needed
      console.log('Event created successfully:', response.data);
      setEventCreate(true);

      // Optionally, you can reset the form fields after successful submission
      setSummary('');
      setDescription('');
      setLocation('');
      setStartDate('');
      setEndDate('');
      setStartTime('');
      setEndTime('');
      setAllDay(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  // Handle the changes to the check box. If checked or not
  const handleAllDayChange = (e) => {
    setAllDay(e.target.checked);

    // Clear time values when toggling to/from all-day event
    if (e.target.checked) {
      setStartTime('');
      setEndTime('');
    }
  };

  return (
    <div className="App">
      {
        // If not signed in then display sign-in page, 
        // otherwise display the event creation page
        !signedIn ? (<div className='centered-section'>
          <h1>Google Test App</h1>
          <button onClick={googleLogin}
            className='buttonStyle'>
            Sign in with Google 🐬
          </button>
        </div>) : (<div>
          {selectedCalendarId ? (
            <div className='two-column-layout'>
              <div className='event-list-container'>
                <EventList calendarId={selectedCalendarId} eventCreated={eventCreate} /> {/* Pass selectedCalendarId to EventList */}
                <AuroraGetData idCalendar={selectedCalendarId} ></AuroraGetData>
              </div>
              <div className='event-Create-container'>
                <h1>Event Creation</h1>
                <p><small>Selected Calendar: {selectCalSummary}</small></p>
                {/* Categories for event creation */}
                <form onSubmit={handleSubmit}>
                  {/* The Summary/Title of the event */}
                  <label htmlFor="summary">Title</label>
                  <br />
                  <input
                    type='text'
                    id='summary'
                    value={summary}
                    onChange={e => setSummary(e.target.value)} />
                  <br />
                  {/* The description of the event */}
                  <label htmlFor="description">Description</label>
                  <br />
                  <input
                    type='text'
                    id='description'
                    value={description}
                    onChange={e => setDescription(e.target.value)} />
                  <br />
                  {/* The location of the event */}
                  <label htmlFor="location">Location</label>
                  <br />
                  <input
                    type='text'
                    id='location'
                    value={location}
                    onChange={e => setLocation(e.target.value)} />
                  <br />
                  {/* Start and end Date */}
                  <div className="date-time-container">
                    <div className="date-input">
                      <label htmlFor="startDate">Start Date</label>
                      <br />
                      <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <br />
                    <div className="date-input">
                      <label htmlFor="endDate">End Date</label>
                      <br />
                      <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                      <br />
                    </div>
                  </div>
                  {!allDay && (
                    // Start and end Time
                    <div className="date-time-container">
                      <div className="time-input">
                        <label htmlFor="startTime">Start Time</label>
                        <br />
                        <input
                          type="time"
                          id="startTime"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                      <br />
                      <div className="time-input">
                        <label htmlFor="endTime">End Time</label>
                        <br />
                        <input
                          type="time"
                          id="endTime"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </div>
                      <br />
                    </div>
                  )}
                  {/* All-day event */}
                  <label>
                    <input type='checkbox'
                      checked={allDay}
                      onChange={handleAllDayChange} />
                    All-Day Event
                  </label>
                  <p></p>
                  <button type='submit'>Create Event</button>
                  <button type='button' onClick={handleBackToCalendarSelection}>Back</button>
                </form>
              </div>
            </div>)
            :
            (<div className='centered-section'>
              <h1>Calendar Selection</h1>
              <CalendarSelection onCalendarSelect={handleCalendarSelect} />
              {/* <button style={{ marginTop: '20px' }} type='button' onClick={handleBackToSignIn}>Back</button> */}
            </div>
            )}
          <button type='button' onClick={handleGoogleLogout}
            className='signOutStyle'>Sign Out</button>
        </div>
        )}
    </div >
  );
}

export default App;
