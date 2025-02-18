// import React, { useState, useEffect } from 'react';
// import { 
//   getClasses, 
//   addLesson, 
//   updateLesson, 
//   deleteLesson, 
//   addClass, 
//   updateClassTitle, 
//   deleteClass 
// } from '../utils/api';

// const ManageClasses = () => {
//   const [classes, setClasses] = useState([]);
//   const [newLesson, setNewLesson] = useState({ classId: '', lessonTitle: '', video: null });
//   const [newClassTitle, setNewClassTitle] = useState('');
//   const [editingClass, setEditingClass] = useState(null);
//   const [editingLesson, setEditingLesson] = useState(null);
//   const [updatedClassTitle, setUpdatedClassTitle] = useState('');
//   const [updatedLessonTitle, setUpdatedLessonTitle] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await getClasses();
//         setClasses(response);
//         setError('');
//       } catch (err) {
//         console.error('Error fetching classes:', err);
//         setError('Failed to fetch classes.');
//       }
//     };

//     fetchClasses();
//   }, []);

//   const handleFileChange = (e) => {
//     setNewLesson({ ...newLesson, video: e.target.files[0] });
//   };

//   const handleAddClass = async (e) => {
//     e.preventDefault();
//     if (!newClassTitle.trim()) {
//       setError('Class title is required.');
//       return;
//     }

//     try {
//       const response = await addClass({ title: newClassTitle });
//       setSuccess('Class added successfully!');
//       setClasses([...classes, response.class]);
//       setNewClassTitle('');
//     } catch (err) {
//       console.error('Error adding class:', err);
//       setError('Error adding class.');
//     }
//   };

//   const handleUpdateClassTitle = async (classId) => {
//     if (!updatedClassTitle.trim()) {
//       setError('Title cannot be empty.');
//       return;
//     }

//     try {
//       const response = await updateClassTitle(classId, { title: updatedClassTitle });
//       setSuccess('Class title updated successfully!');
//       setClasses(classes.map(cls => 
//         cls._id === classId ? { ...cls, title: response.updatedClass.title } : cls
//       ));
//       setEditingClass(null);
//       setUpdatedClassTitle('');
//     } catch (err) {
//       console.error('Error updating class title:', err);
//       setError('Error updating class title.');
//     }
//   };

//   const handleDeleteClass = async (classId) => {
//     try {
//       await deleteClass(classId);
//       setSuccess('Class deleted successfully!');
//       setClasses(classes.filter(cls => cls._id !== classId));
//     } catch (err) {
//       console.error('Error deleting class:', err);
//       setError('Error deleting class.');
//     }
//   };

//   const handleAddLesson = async (e) => {
//     e.preventDefault();

//     if (!newLesson.video) {
//       setError('Please upload a video file.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('classId', newLesson.classId);
//     formData.append('lessonTitle', newLesson.lessonTitle);
//     formData.append('video', newLesson.video);

//     try {
//       const response = await addLesson(formData);
//       setSuccess('Lesson added successfully!');
//       setClasses(classes.map(cls => 
//         cls._id === newLesson.classId ? { ...cls, lessons: [...cls.lessons, response.lesson] } : cls
//       ));
//       setNewLesson({ classId: '', lessonTitle: '', video: null });
//     } catch (err) {
//       console.error('Error adding lesson:', err);
//       setError('Error adding lesson.');
//     }
//   };

//   const handleUpdateLesson = async (lessonId, classId) => {
//     if (!updatedLessonTitle.trim()) {
//       setError('Lesson title cannot be empty.');
//       return;
//     }

//     try {
//       const response = await updateLesson(lessonId, { lessonTitle: updatedLessonTitle });
//       setSuccess('Lesson updated successfully!');
//       setClasses(classes.map(cls => 
//         cls._id === classId 
//           ? { ...cls, lessons: cls.lessons.map(lesson => 
//               lesson._id === lessonId ? { ...lesson, title: response.updatedLesson.title } : lesson
//             )} 
//           : cls
//       ));
//       setEditingLesson(null);
//       setUpdatedLessonTitle('');
//     } catch (err) {
//       console.error('Error updating lesson:', err);
//       setError('Error updating lesson.');
//     }
//   };

//   const handleDeleteLesson = async (lessonId, classId) => {
//     try {
//       await deleteLesson(lessonId);
//       setSuccess('Lesson deleted successfully!');
//       setClasses(classes.map(cls =>
//         cls._id === classId
//           ? { ...cls, lessons: cls.lessons.filter(lesson => lesson._id !== lessonId) }
//           : cls
//       ));
//     } catch (err) {
//       console.error('Error deleting lesson:', err);
//       setError('Error deleting lesson.');
//     }
//   };

//   return (
//     <div className="bg-black min-h-screen text-white p-8">
//       <h1 className="text-3xl font-bold mb-6">Manage Classes</h1>

//       {error && <p className="text-red-500 mt-2">{error}</p>}
//       {success && <p className="text-green-500 mt-2">{success}</p>}

//       {/* Add Class Form */}
//       <form onSubmit={handleAddClass} className="mb-6">
//         <input 
//           type="text" 
//           placeholder="Class Title" 
//           value={newClassTitle} 
//           onChange={(e) => setNewClassTitle(e.target.value)} 
//           required 
//           className="p-2 rounded bg-gray-800 text-white w-2/3"
//         />
//         <button type="submit" className="px-4 py-2 bg-blue-500 text-white font-bold rounded">Add Class</button>
//       </form>

//       {/* Add Lesson Form */}
//       <form onSubmit={handleAddLesson} className="mb-6">
//         <select 
//           value={newLesson.classId} 
//           onChange={(e) => setNewLesson({ ...newLesson, classId: e.target.value })} 
//           required
//           className="p-2 rounded bg-gray-800 text-white"
//         >
//           <option value="">Select a class</option>
//           {classes.map((cls) => (
//             <option key={cls._id} value={cls._id}>{cls.title}</option>
//           ))}
//         </select>
//         <input 
//           type="text" 
//           placeholder="Lesson Title" 
//           value={newLesson.lessonTitle} 
//           onChange={(e) => setNewLesson({ ...newLesson, lessonTitle: e.target.value })} 
//           required 
//           className="p-2 rounded bg-gray-800 text-white"
//         />
//         <input type="file" accept="video/*" onChange={handleFileChange} required className="p-2 bg-gray-800 text-white rounded" />
//         <button type="submit" className="px-4 py-2 bg-green-500 text-white font-bold rounded">Add Lesson</button>
//       </form>

//       {/* Display Classes and Lessons */}
//       {classes.map((cls) => (
//         <div key={cls._id} className="mb-6 p-4 bg-gray-800 rounded">
//           <h3 className="text-xl font-bold">{cls.title}</h3>
//           <button onClick={() => handleDeleteClass(cls._id)} className="px-3 py-1 bg-red-500 text-white font-bold rounded">Delete Class</button>

//           {cls.lessons.map((lesson) => (
//             <div key={lesson._id} className="mt-4 p-2 bg-gray-700 rounded">
//               <p>{lesson.title}</p>
//               <video controls width="100%">
//                 <source src={`http://localhost:5001/${lesson.content}`} type="video/mp4" />
//               </video>
//               <button onClick={() => handleDeleteLesson(lesson._id, cls._id)} className="px-2 py-1 bg-red-500 text-white font-bold rounded mt-2">Delete Lesson</button>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ManageClasses;
// import React, { useState, useEffect } from 'react';
// import { 
//   getClasses, 
//   addLesson, 
//   updateLesson, 
//   deleteLesson, 
//   addClass, 
//   updateClassTitle, 
//   deleteClass 
// } from '../utils/api';

// const ManageClasses = () => {
//   const [classes, setClasses] = useState([]);
//   const [newLesson, setNewLesson] = useState({ classId: '', lessonTitle: '', video: null });
//   const [newClassTitle, setNewClassTitle] = useState('');
//   const [editingClass, setEditingClass] = useState(null);
//   const [editingLesson, setEditingLesson] = useState(null);
//   const [updatedClassTitle, setUpdatedClassTitle] = useState('');
//   const [updatedLessonTitle, setUpdatedLessonTitle] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await getClasses();
//         setClasses(response);
//         setError('');
//       } catch (err) {
//         console.error('Error fetching classes:', err);
//         setError('Failed to fetch classes.');
//       }
//     };

//     fetchClasses();
//   }, []);

//   const handleFileChange = (e) => {
//     setNewLesson({ ...newLesson, video: e.target.files[0] });
//   };

//   const handleAddClass = async (e) => {
//     e.preventDefault();
//     if (!newClassTitle.trim()) {
//       setError('Class title is required.');
//       return;
//     }

//     try {
//       const response = await addClass({ title: newClassTitle });
//       setSuccess('Class added successfully!');
//       setClasses([...classes, response.class]);
//       setNewClassTitle('');
//     } catch (err) {
//       console.error('Error adding class:', err);
//       setError('Error adding class.');
//     }
//   };

//   const handleUpdateClassTitle = async (classId) => {
//     if (!updatedClassTitle.trim()) {
//       setError('Title cannot be empty.');
//       return;
//     }

//     try {
//       const response = await updateClassTitle(classId, { title: updatedClassTitle });
//       setSuccess('Class title updated successfully!');
//       setClasses(classes.map(cls => 
//         cls._id === classId ? { ...cls, title: response.updatedClass.title } : cls
//       ));
//       setEditingClass(null);
//       setUpdatedClassTitle('');
//     } catch (err) {
//       console.error('Error updating class title:', err);
//       setError('Error updating class title.');
//     }
//   };

//   const handleDeleteClass = async (classId) => {
//     try {
//       await deleteClass(classId);
//       setSuccess('Class deleted successfully!');
//       setClasses(classes.filter(cls => cls._id !== classId));
//     } catch (err) {
//       console.error('Error deleting class:', err);
//       setError('Error deleting class.');
//     }
//   };

//   const handleAddLesson = async (e) => {
//     e.preventDefault();

//     if (!newLesson.video) {
//       setError('Please upload a video file.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('classId', newLesson.classId);
//     formData.append('lessonTitle', newLesson.lessonTitle);
//     formData.append('video', newLesson.video);

//     try {
//       const response = await addLesson(formData);
//       setSuccess('Lesson added successfully!');
//       setClasses(classes.map(cls => 
//         cls._id === newLesson.classId ? { ...cls, lessons: [...cls.lessons, response.lesson] } : cls
//       ));
//       setNewLesson({ classId: '', lessonTitle: '', video: null });
//     } catch (err) {
//       console.error('Error adding lesson:', err);
//       setError('Error adding lesson.');
//     }
//   };

//   const handleUpdateLesson = async (lessonId, classId) => {
//     if (!updatedLessonTitle.trim()) {
//       setError('Lesson title cannot be empty.');
//       return;
//     }

//     try {
//       const response = await updateLesson(lessonId, { lessonTitle: updatedLessonTitle });
//       setSuccess('Lesson updated successfully!');
//       setClasses(classes.map(cls => 
//         cls._id === classId 
//           ? { ...cls, lessons: cls.lessons.map(lesson => 
//               lesson._id === lessonId ? { ...lesson, title: response.updatedLesson.title } : lesson
//             )} 
//           : cls
//       ));
//       setEditingLesson(null);
//       setUpdatedLessonTitle('');
//     } catch (err) {
//       console.error('Error updating lesson:', err);
//       setError('Error updating lesson.');
//     }
//   };

//   const handleDeleteLesson = async (lessonId, classId) => {
//     try {
//       await deleteLesson(lessonId);
//       setSuccess('Lesson deleted successfully!');
//       setClasses(classes.map(cls =>
//         cls._id === classId
//           ? { ...cls, lessons: cls.lessons.filter(lesson => lesson._id !== lessonId) }
//           : cls
//       ));
//     } catch (err) {
//       console.error('Error deleting lesson:', err);
//       setError('Error deleting lesson.');
//     }
//   };

//   return (
//     <div className="bg-black min-h-screen text-white p-8">
//       <h1 className="text-3xl font-bold mb-6">Manage Classes</h1>

//       {error && <p className="text-red-500 mt-2">{error}</p>}
//       {success && <p className="text-green-500 mt-2">{success}</p>}

//       {/* Add Class Form */}
//       <form onSubmit={handleAddClass} className="mb-6">
//         <input 
//           type="text" 
//           placeholder="Class Title" 
//           value={newClassTitle} 
//           onChange={(e) => setNewClassTitle(e.target.value)} 
//           required 
//           className="p-2 rounded bg-gray-800 text-white w-2/3"
//         />
//         <button type="submit" className="px-4 py-2 bg-blue-500 text-white font-bold rounded">Add Class</button>
//       </form>

//       {/* Display Classes and Lessons */}
//       {classes.map((cls) => (
//         <div key={cls._id} className="mb-6 p-4 bg-gray-800 rounded">
//           {editingClass === cls._id ? (
//             <input type="text" value={updatedClassTitle} onChange={(e) => setUpdatedClassTitle(e.target.value)} />
//           ) : (
//             <h3 className="text-xl font-bold">{cls.title}</h3>
//           )}
//           {editingClass === cls._id ? (
//             <button onClick={() => handleUpdateClassTitle(cls._id)} className="px-3 py-1 bg-green-500 text-white font-bold rounded">Save</button>
//           ) : (
//             <button onClick={() => setEditingClass(cls._id)} className="px-3 py-1 bg-yellow-500 text-black font-bold rounded">Edit Title</button>
//           )}
//           <button onClick={() => handleDeleteClass(cls._id)} className="px-3 py-1 bg-red-500 text-white font-bold rounded">Delete Class</button>

//           {cls.lessons.map((lesson) => (
//             <div key={lesson._id} className="mt-4 p-2 bg-gray-700 rounded">
//               {editingLesson === lesson._id ? (
//                 <input type="text" value={updatedLessonTitle} onChange={(e) => setUpdatedLessonTitle(e.target.value)} />
//               ) : (
//                 <p>{lesson.title}</p>
//               )}
//               {editingLesson === lesson._id ? (
//                 <button onClick={() => handleUpdateLesson(lesson._id, cls._id)} className="px-3 py-1 bg-green-500 text-white font-bold rounded">Save</button>
//               ) : (
//                 <button onClick={() => setEditingLesson(lesson._id)} className="px-3 py-1 bg-yellow-500 text-black font-bold rounded">Edit</button>
//               )}
//               <button onClick={() => handleDeleteLesson(lesson._id, cls._id)} className="px-2 py-1 bg-red-500 text-white font-bold rounded mt-2">Delete Lesson</button>
//               <video controls width="100%">
//                 <source src={`http://localhost:5001/${lesson.content}`} type="video/mp4" />
//               </video>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ManageClasses;
import React, { useState, useEffect } from 'react';
import { 
  getClasses, 
  addLesson, 
  updateLesson, 
  deleteLesson, 
  addClass, 
  updateClassTitle, 
  deleteClass 
} from '../utils/api';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [newLesson, setNewLesson] = useState({ classId: '', lessonTitle: '', video: null });
  const [newClassTitle, setNewClassTitle] = useState('');
  const [editingClass, setEditingClass] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [updatedClassTitle, setUpdatedClassTitle] = useState('');
  const [updatedLessonTitle, setUpdatedLessonTitle] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getClasses();
        setClasses(response);
        setError('');
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to fetch classes.');
      }
    };

    fetchClasses();
  }, []);

  const handleFileChange = (e) => {
    setNewLesson({ ...newLesson, video: e.target.files[0] });
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassTitle.trim()) {
      setError('Class title is required.');
      return;
    }

    try {
      const response = await addClass({ title: newClassTitle });
      setSuccess('Class added successfully!');
      setClasses([...classes, response.class]);
      setNewClassTitle('');
    } catch (err) {
      console.error('Error adding class:', err);
      setError('Error adding class.');
    }
  };

  const handleUpdateClassTitle = async (classId) => {
    if (!updatedClassTitle.trim()) {
      setError('Title cannot be empty.');
      return;
    }

    try {
      const response = await updateClassTitle(classId, { title: updatedClassTitle });
      setSuccess('Class title updated successfully!');
      setClasses(classes.map(cls => 
        cls._id === classId ? { ...cls, title: response.updatedClass.title } : cls
      ));
      setEditingClass(null);
      setUpdatedClassTitle('');
    } catch (err) {
      console.error('Error updating class title:', err);
      setError('Error updating class title.');
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      await deleteClass(classId);
      setSuccess('Class deleted successfully!');
      setClasses(classes.filter(cls => cls._id !== classId));
    } catch (err) {
      console.error('Error deleting class:', err);
      setError('Error deleting class.');
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();

    if (!newLesson.video) {
      setError('Please upload a video file.');
      return;
    }

    const formData = new FormData();
    formData.append('classId', newLesson.classId);
    formData.append('lessonTitle', newLesson.lessonTitle);
    formData.append('video', newLesson.video);

    try {
      const response = await addLesson(formData);
      setSuccess('Lesson added successfully!');
      setClasses(classes.map(cls => 
        cls._id === newLesson.classId ? { ...cls, lessons: [...cls.lessons, response.lesson] } : cls
      ));
      setNewLesson({ classId: '', lessonTitle: '', video: null });
    } catch (err) {
      console.error('Error adding lesson:', err);
      setError('Error adding lesson.');
    }
  };

  const handleUpdateLesson = async (lessonId, classId) => {
    if (!updatedLessonTitle.trim()) {
      setError('Lesson title cannot be empty.');
      return;
    }

    try {
      const response = await updateLesson(lessonId, { lessonTitle: updatedLessonTitle });
      setSuccess('Lesson updated successfully!');
      setClasses(classes.map(cls => 
        cls._id === classId 
          ? { ...cls, lessons: cls.lessons.map(lesson => 
              lesson._id === lessonId ? { ...lesson, title: response.updatedLesson.title } : lesson
            )} 
          : cls
      ));
      setEditingLesson(null);
      setUpdatedLessonTitle('');
    } catch (err) {
      console.error('Error updating lesson:', err);
      setError('Error updating lesson.');
    }
  };

  const handleDeleteLesson = async (lessonId, classId) => {
    try {
      await deleteLesson(lessonId);
      setSuccess('Lesson deleted successfully!');
      setClasses(classes.map(cls =>
        cls._id === classId
          ? { ...cls, lessons: cls.lessons.filter(lesson => lesson._id !== lessonId) }
          : cls
      ));
    } catch (err) {
      console.error('Error deleting lesson:', err);
      setError('Error deleting lesson.');
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Classes</h1>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}

      {/* Add Class Form */}
      <form onSubmit={handleAddClass} className="mb-6">
        <input 
          type="text" 
          placeholder="Class Title" 
          value={newClassTitle} 
          onChange={(e) => setNewClassTitle(e.target.value)} 
          required 
          className="p-2 rounded bg-gray-800 text-white w-2/3"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white font-bold rounded">Add Class</button>
      </form>

      {/* ✅ ADD LESSON FORM (This was missing—Now it's back!) */}
      <form onSubmit={handleAddLesson} className="mb-6">
        <select 
          value={newLesson.classId} 
          onChange={(e) => setNewLesson({ ...newLesson, classId: e.target.value })} 
          required
          className="p-2 rounded bg-gray-800 text-white"
        >
          <option value="">Select a class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>{cls.title}</option>
          ))}
        </select>
        <input 
          type="text" 
          placeholder="Lesson Title" 
          value={newLesson.lessonTitle} 
          onChange={(e) => setNewLesson({ ...newLesson, lessonTitle: e.target.value })} 
          required 
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input type="file" accept="video/*" onChange={handleFileChange} required className="p-2 bg-gray-800 text-white rounded" />
        <button type="submit" className="px-4 py-2 bg-green-500 text-white font-bold rounded">Add Lesson</button>
      </form>

      {/* Display Classes and Lessons */}
      {classes.map((cls) => (
        <div key={cls._id} className="mb-6 p-4 bg-gray-800 rounded">
          <h3 className="text-xl font-bold">{cls.title}</h3>
          <button onClick={() => handleDeleteClass(cls._id)} className="px-3 py-1 bg-red-500 text-white font-bold rounded">Delete Class</button>

          {cls.lessons.map((lesson) => (
            <div key={lesson._id} className="mt-4 p-2 bg-gray-700 rounded">
              <p>{lesson.title}</p>
              <video controls width="100%">
                <source src={`http://localhost:5001/${lesson.content}`} type="video/mp4" />
              </video>
              <button onClick={() => handleDeleteLesson(lesson._id, cls._id)} className="px-2 py-1 bg-red-500 text-white font-bold rounded mt-2">Delete Lesson</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ManageClasses;
