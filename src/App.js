import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function App() {
  const [categories, setCategories] = useState([
    { id: 'category1', name: 'Category 1', notes: [] },
    { id: 'category2', name: 'Category 2', notes: [] },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const newCategories = Array.from(categories);

    // Reorder notes within the same category
    if (source.droppableId === destination.droppableId) {
      const category = newCategories.find((cat) => cat.id === source.droppableId);
      const updatedNotes = Array.from(category.notes);
      const [removed] = updatedNotes.splice(source.index, 1);
      updatedNotes.splice(destination.index, 0, removed);
      category.notes = updatedNotes;
      setCategories(newCategories);
    }
    // Move notes to a different category
    else {
      const sourceCategory = newCategories.find((cat) => cat.id === source.droppableId);
      const destinationCategory = newCategories.find((cat) => cat.id === destination.droppableId);
      const sourceNotes = Array.from(sourceCategory.notes);
      const destinationNotes = Array.from(destinationCategory.notes);
      const [removed] = sourceNotes.splice(source.index, 1);
      destinationNotes.splice(destination.index, 0, removed);
      sourceCategory.notes = sourceNotes;
      destinationCategory.notes = destinationNotes;
      setCategories(newCategories);
    }
  };

  const handleAddNote = (categoryId, title, content) => {
    const newNote = {
      id: `note${Date.now()}`,
      title,
      content,
      category: categoryId,
    };

    const newCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          notes: [...category.notes, newNote],
        };
      }
      return category;
    });

    setCategories(newCategories);
  };

  const handleSearch = () => {
    const searchQuery = searchTerm.toLowerCase();
    const filteredNotes = categories.reduce((acc, category) => {
      const notes = category.notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery) ||
          note.content.toLowerCase().includes(searchQuery)
      );
      return [...acc, ...notes];
    }, []);
    setFilteredNotes(filteredNotes);
  };

  const handleDeleteNote = (categoryId, noteId) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          notes: category.notes.filter((note) => note.id !== noteId),
        };
      }
      return category;
    });

    setCategories(updatedCategories);
  };

  return (
    <div className="container mt-4">
      <h1>Note Taking App</h1>
      <div className="row">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search notes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-2">
          <button className="btn btn-primary mr-2" onClick={handleSearch}>
            Search
          </button>
          <button className="btn btn-secondary" onClick={() => setSearchTerm('')}>
            Clear
          </button>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {categories.map((category) => {
          let newNoteTitle = '';
          let newNoteContent = '';

          const notes = filteredNotes.length > 0 ? filteredNotes : category.notes;

          return (
            <div className="mt-4" key={category.id}>
              <h4>{category.name}</h4>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter note title"
                  onChange={(e) => (newNoteTitle = e.target.value)}
                />
                <ReactQuill
                  className="mb-2"
                  theme="snow"
                  placeholder="Enter note content"
                  onChange={(value) => (newNoteContent = value)}
                />
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => handleAddNote(category.id, newNoteTitle, newNoteContent)}
                >
                  Add Note
                </button>
              </div>
              <Droppable droppableId={category.id} key={category.id}>
                {(provided) => (
                  <ul className="list-group" ref={provided.innerRef} {...provided.droppableProps}>
                    {notes.map((note, index) => (
                      <Draggable key={note.id} draggableId={note.id} index={index}>
                        {(provided) => (
                          <li
                            className="list-group-item"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h5>{note.title}</h5>
                            <div dangerouslySetInnerHTML={{ __html: note.content }} />
                            <button
                              className="btn btn-danger btn-sm mt-2"
                              onClick={() => handleDeleteNote(category.id, note.id)}
                            >
                              Delete
                            </button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
