import React from 'react';
import { useStore } from '../store/useStore';

const NotesWidget = () => {
  const { notes, setNotes } = useStore();

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  return (
    <div className="notes-widget">
      <h3>All notes</h3>
      <textarea
        className="notes-textarea"
        placeholder="This is how I am going to learn MERN Stack in next 3 months..."
        value={notes}
        onChange={handleNotesChange}
      />
    </div>
  );
};

export default NotesWidget;
