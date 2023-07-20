import React from 'react';

const Note = ({ note }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h3 className="card-title">{note.title}</h3>
        <p className="card-text">{note.content}</p>
      </div>
    </div>
  );
};

export default Note;
