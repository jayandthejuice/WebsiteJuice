// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const MyClasses = () => {
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [countdownTimers, setCountdownTimers] = useState({});

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:5001/api/classes/my-classes", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const updatedClasses = response.data.map((cls, index) => ({
//           ...cls,
//           isUnlocked: index === 0 || cls.isUnlocked, // Unlock only the first class initially
//         }));

//         setClasses(updatedClasses);
//         initializeCountdowns(updatedClasses);
//       } catch (err) {
//         console.error("Error fetching classes:", err);
//         setError("Failed to fetch classes. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClasses();
//   }, []);

//   // Initialize countdown timers based on userUnlockTime
//   const initializeCountdowns = (fetchedClasses) => {
//     const timers = {};
//     fetchedClasses.forEach((cls, index) => {
//       if (index > 0 && cls.userUnlockTime) {
//         const timeLeft = new Date(cls.userUnlockTime) - new Date();
//         if (timeLeft > 0) {
//           timers[cls._id] = timeLeft;
//         }
//       }
//     });
//     setCountdownTimers(timers);
//   };

//   // Live countdown update
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCountdownTimers((prevTimers) => {
//         const updatedTimers = {};
//         Object.entries(prevTimers).forEach(([classId, timeLeft]) => {
//           if (timeLeft > 1000) {
//             updatedTimers[classId] = timeLeft - 1000;
//           } else {
//             // Unlock the next class when the countdown reaches 0
//             setClasses((prevClasses) =>
//               prevClasses.map((cls) =>
//                 cls._id === classId ? { ...cls, isUnlocked: true } : cls
//               )
//             );
//           }
//         });
//         return updatedTimers;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const formatTime = (milliseconds) => {
//     const seconds = Math.floor((milliseconds / 1000) % 60);
//     const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
//     const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
//     return `${hours}h ${minutes}m ${seconds}s`;
//   };

//   const handleWatchLesson = async (classId, chapterId, lessonId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         "http://localhost:5001/api/classes/watch-lesson",
//         { classId, chapterId, lessonId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const { nextClassUnlockTime } = response.data;

//       // Update state to mark lesson as watched
//       setClasses((prevClasses) =>
//         prevClasses.map((cls) =>
//           cls._id === classId
//             ? {
//                 ...cls,
//                 chapters: cls.chapters.map((chapter) =>
//                   chapter._id === chapterId
//                     ? {
//                         ...chapter,
//                         lessons: chapter.lessons.map((lesson) =>
//                           lesson._id === lessonId
//                             ? { ...lesson, watchedAt: new Date() } // Mark as watched
//                             : lesson
//                         ),
//                       }
//                     : chapter
//                 ),
//               }
//             : cls
//         )
//       );

//       // Fetch the current class and check if all lessons are watched
//       const currentClass = classes.find((cls) => cls._id === classId);
//       if (!currentClass) return;

//       const allLessonsWatched = currentClass.chapters.every((chapter) =>
//         chapter.lessons.every((lesson) => lesson.watchedAt)
//       );

//       // If all lessons are watched, start the 24-hour countdown
//       if (allLessonsWatched && nextClassUnlockTime) {
//         const unlockTime = new Date(nextClassUnlockTime) - new Date();
//         setCountdownTimers((prevTimers) => ({
//           ...prevTimers,
//           [classId]: unlockTime,
//         }));
//       }
//     } catch (err) {
//       console.error("Error marking lesson as watched:", err);
//       alert("Failed to update lesson progress. Please try again.");
//     }
//   };

//   if (loading) return <div className="text-white text-center">Loading classes...</div>;
//   if (error) return <div className="text-red-500 text-center">{error}</div>;

//   return (
//     <div className="bg-black min-h-screen text-white p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">My Classes</h1>
//       {classes.length === 0 ? (
//         <p className="text-center">No classes available.</p>
//       ) : (
//         <div className="space-y-6">
//           {classes.map((cls, index) => {
//             const timeLeft = countdownTimers[cls._id];
//             const isClassUnlocked = index === 0 || cls.isUnlocked || (timeLeft && timeLeft <= 0);
//             const isNextClassLocked = index > 0 && !isClassUnlocked;

//             return (
//               <div key={cls._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
//                 <h2 className="text-2xl font-semibold mb-4">
//                   {cls.title} {isNextClassLocked ? "🔒" : ""}
//                 </h2>

//                 {isNextClassLocked ? (
//                   <p className="text-red-500">Unlocks in: {formatTime(timeLeft)}</p>
//                 ) : (
//                   cls.chapters.map((chapter) => (
//                     <div key={chapter._id} className="p-4 bg-gray-700 rounded-lg mb-4">
//                       <h3 className="text-xl font-bold">{chapter.name}</h3>
//                       <div className="grid gap-4 mt-2">
//                         {chapter.lessons.map((lesson) => (
//                           <div key={lesson._id} className="bg-gray-600 p-3 rounded-lg">
//                             <h4 className="text-lg font-bold mb-2">{lesson.title}</h4>

//                             <video
//                               controls
//                               width="100%"
//                               className="rounded-lg"
//                               onPlay={() =>
//                                 handleWatchLesson(cls._id, chapter._id, lesson._id)
//                               }
//                             >
//                               <source
//                                 src={`http://localhost:5001/${lesson.content}`}
//                                 type="video/mp4"
//                               />
//                               Your browser does not support the video tag.
//                             </video>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyClasses;

import React, { useState, useEffect } from "react";
import axios from "axios";

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdownTimers, setCountdownTimers] = useState({});
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://websitejuice.onrender.com/api';


  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token");
        //const response = await axios.get("http://localhost:5001/api/classes/my-classes", {
          const response = await axios.get(`${API_BASE_URL}/classes/my-classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClasses(response.data);
        initializeCountdowns(response.data);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to fetch classes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Initialize countdown timers based on userUnlockTime
  const initializeCountdowns = (fetchedClasses) => {
    const timers = {};
    fetchedClasses.forEach((cls, index) => {
      if (index > 0 && cls.userUnlockTime) {
        const timeLeft = new Date(cls.userUnlockTime) - new Date();
        if (timeLeft > 0) {
          timers[cls._id] = timeLeft;
        }
      }
    });
    setCountdownTimers(timers);
  };

  // Live countdown update
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownTimers((prevTimers) => {
        const updatedTimers = {};
        Object.entries(prevTimers).forEach(([classId, timeLeft]) => {
          if (timeLeft > 1000) {
            updatedTimers[classId] = timeLeft - 1000;
          } else {
            // Unlock the next class when the countdown reaches 0
            setClasses((prevClasses) =>
              prevClasses.map((cls) =>
                cls._id === classId ? { ...cls, isUnlocked: true } : cls
              )
            );
          }
        });
        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleWatchLesson = async (classId, lessonId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        //"http://localhost:5001/api/classes/watch-lesson",
        `${API_BASE_URL}/classes/watch-lesson`,
        { classId, lessonId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { nextClassUnlockTime } = response.data;

      // Update state to mark lesson as watched
      setClasses((prevClasses) =>
        prevClasses.map((cls) =>
          cls._id === classId
            ? {
                ...cls,
                lessons: cls.lessons.map((lesson) =>
                  lesson._id === lessonId ? { ...lesson, watchedAt: new Date() } : lesson
                ),
              }
            : cls
        )
      );

      // If all lessons are watched, start the countdown
      const currentClass = classes.find((cls) => cls._id === classId);
      if (!currentClass) return;

      const allLessonsWatched = currentClass.lessons.every((lesson) => lesson.watchedAt);

      if (allLessonsWatched && nextClassUnlockTime) {
        const unlockTime = new Date(nextClassUnlockTime) - new Date();
        setCountdownTimers((prevTimers) => ({
          ...prevTimers,
          [classId]: unlockTime,
        }));
      }
    } catch (err) {
      console.error("Error marking lesson as watched:", err);
      alert("Failed to update lesson progress. Please try again.");
    }
  };

  if (loading) return <div className="text-white text-center">Loading classes...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Classes</h1>
      {classes.length === 0 ? (
        <p className="text-center">No classes available.</p>
      ) : (
        <div className="space-y-6">
          {classes.map((cls, index) => {
            const timeLeft = countdownTimers[cls._id];
            const isClassUnlocked = index === 0 || cls.isUnlocked || (timeLeft && timeLeft <= 0);
            const isNextClassLocked = index > 0 && !isClassUnlocked;

            return (
              <div key={cls._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">
                  {cls.title} {isNextClassLocked ? "🔒" : ""}
                </h2>

                {isNextClassLocked ? (
                  <p className="text-red-500">Unlocks in: {formatTime(timeLeft)}</p>
                ) : (
                  <div className="space-y-4">
                    {cls.lessons.length === 0 ? (
                      <p className="text-gray-400">No lessons available for this class.</p>
                    ) : (
                      cls.lessons.map((lesson) => (
                        <div key={lesson._id} className="bg-gray-600 p-3 rounded-lg">
                          <h4 className="text-lg font-bold mb-2">{lesson.title}</h4>

                          <video
                            controls
                            width="100%"
                            className="rounded-lg"
                            onPlay={() => handleWatchLesson(cls._id, lesson._id)}
                          >
                            <source
                              //src={`http://localhost:5001/${lesson.content}`}
                              src={lesson.content} type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>

                          <p className="text-sm text-gray-300 mt-2">
                            {lesson.watchedAt
                              ? `Watched on: ${new Date(lesson.watchedAt).toLocaleString()}`
                              : "Not watched yet"}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyClasses;
