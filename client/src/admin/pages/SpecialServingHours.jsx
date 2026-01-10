import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/servingHours.css';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function SpecialServingHours() {
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'all', 'past'

  // Form State
  const [formData, setFormData] = useState({
    date: '',
    openingTime: '',
    closingTime: '',
    isClosed: false,
    reason: ''
  });

  // Convex Queries & Mutations
  const servingHoursRaw = useQuery(api.modules.servingHours.servingHours.getAllServingHours) || [];
  const setServingHours = useMutation(api.modules.servingHours.servingHours.setServingHours);
  const deleteServingHours = useMutation(api.modules.servingHours.servingHours.deleteServingHours);

  // Helper to format date for input/display
  const formatDateForInput = (d) => d.toISOString().split('T')[0];

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const dateStr = formatDateForInput(newDate);
    // Auto-fill form if existing entry found
    const existingEntry = servingHoursRaw.find(sh => sh.date === dateStr);

    if (existingEntry) {
      setFormData({
        date: existingEntry.date,
        openingTime: existingEntry.openingTime,
        closingTime: existingEntry.closingTime,
        isClosed: existingEntry.isClosed,
        reason: existingEntry.reason || ''
      });
    } else {
      setFormData({
        date: dateStr,
        openingTime: '',
        closingTime: '',
        isClosed: false,
        reason: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.date) {
        alert("Please select a date");
        return;
      }

      const dayOfWeek = new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

      await setServingHours({
        date: formData.date,
        dayOfWeek: dayOfWeek,
        openingTime: formData.openingTime || '00:00',
        closingTime: formData.closingTime || '00:00',
        isClosed: formData.isClosed,
        reason: formData.reason
      });
      alert("Special serving hours updated successfully!");
    } catch (error) {
      console.error("Error setting hours:", error);
      alert("Failed to update serving hours");
    }
  };

  const handleDelete = async (servingHourId) => {
    if (window.confirm("Delete these special hours?")) {
      try {
        await deleteServingHours({ servingHourId });
      } catch (error) {
        console.error("Error deleting hours:", error);
        alert("Failed to delete");
      }
    }
  };

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = formatDateForInput(date);
      const entry = servingHoursRaw.find(sh => sh.date === dateStr);
      if (entry) {
        return (
          <div className={`calendar-dot ${entry.isClosed ? 'red' : 'green'}`}></div>
        );
      }
    }
    return null;
  };

  // Filter for list view
  const categorizedHours = servingHoursRaw.filter(sh => {
    const today = new Date().toISOString().split('T')[0];
    if (activeTab === 'upcoming') return sh.date >= today;
    if (activeTab === 'past') return sh.date < today;
    return true; // all
  }).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>🕐 Special Serving Hours</h1>
          <p style={{ color: '#666' }}>Manage holiday hours or special event timings.</p>
        </div>

        <div className="hours-layout">
          {/* Calendar & Form Section */}
          <div className="calendar-section">
            <div className="calendar-card">
              <h3>Select Date</h3>
              <Calendar
                onChange={handleDateChange}
                value={date}
                tileContent={getTileContent}
                className="custom-calendar"
              />
            </div>

            <div className="form-card">
              <h3>{formData.date ? `Settings for ${formData.date}` : 'Select a date'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isClosed}
                      onChange={e => setFormData({ ...formData, isClosed: e.target.checked })}
                    />
                    <span>Mark as Closed All Day</span>
                  </label>
                </div>

                {!formData.isClosed && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Opening Time</label>
                      <input
                        type="time"
                        value={formData.openingTime}
                        onChange={e => setFormData({ ...formData, openingTime: e.target.value })}
                        required={!formData.isClosed}
                      />
                    </div>
                    <div className="form-group">
                      <label>Closing Time</label>
                      <input
                        type="time"
                        value={formData.closingTime}
                        onChange={e => setFormData({ ...formData, closingTime: e.target.value })}
                        required={!formData.isClosed}
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Reason / Note</label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="e.g. National Holiday"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">Save Changes</button>
                  {/* Delete button logic based on current selection matching DB entry */}
                  {servingHoursRaw.find(sh => sh.date === formData.date) && (
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => {
                        const entry = servingHoursRaw.find(sh => sh.date === formData.date);
                        if (entry) handleDelete(entry._id);
                      }}
                    >
                      Delete Entry
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="list-section">
            <div className="tabs">
              <button className={activeTab === 'upcoming' ? 'active' : ''} onClick={() => setActiveTab('upcoming')}>Upcoming</button>
              <button className={activeTab === 'past' ? 'active' : ''} onClick={() => setActiveTab('past')}>Past</button>
              <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All</button>
            </div>

            <div className="hours-list">
              {categorizedHours.length === 0 ? (
                <p className="no-data">No special hours found.</p>
              ) : (
                categorizedHours.map(sh => (
                  <div key={sh._id} className={`list-item ${sh.isClosed ? 'closed-item' : ''}`}>
                    <div className="list-date">
                      <span className="day">{new Date(sh.date).getDate()}</span>
                      <span className="month">{new Date(sh.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="year">{new Date(sh.date).getFullYear()}</span>
                    </div>
                    <div className="list-details">
                      <h4>{new Date(sh.date).toLocaleDateString('en-US', { weekday: 'long' })}</h4>
                      <p>{sh.isClosed ? 'Closed All Day' : `${sh.openingTime} - ${sh.closingTime}`}</p>
                      {sh.reason && <p className="reason-text">"{sh.reason}"</p>}
                    </div>
                    <button className="delete-icon" onClick={() => handleDelete(sh._id)}>🗑️</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
