import { useEffect, useMemo, useState } from "react";

const blankStudent = {
  displayName: "",
  gradeBand: "Unknown",
  track: "Aleph",
  confidence: "new",
  currentSkill: "Finding Hebrew starting point",
};

function ChavrutaClassroom() {
  const [teacherPin, setTeacherPin] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studentForm, setStudentForm] = useState(blankStudent);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedStudent = useMemo(() => {
    return students.find((student) => student.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  useEffect(() => {
    const savedPin = window.localStorage.getItem("chavrutaTeacherPin") || "";

    if (savedPin) {
      setTeacherPin(savedPin);
    }
  }, []);

  async function fetchStudents(pinOverride) {
    const pin = pinOverride || teacherPin;

    if (!pin) {
      setError("Enter the teacher PIN first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/.netlify/functions/students", {
        method: "GET",
        headers: {
          "X-Teacher-Pin": pin,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load students.");
      }

      setStudents(data.students || []);

      if (!selectedStudentId && data.students && data.students.length) {
        setSelectedStudentId(data.students[0].id);
      }
    } catch (err) {
      setError(err.message || "Could not load students.");
    } finally {
      setLoading(false);
    }
  }

  function savePin() {
    window.localStorage.setItem("chavrutaTeacherPin", teacherPin);
    fetchStudents(teacherPin);
  }

  async function createStudent(event) {
    event.preventDefault();

    if (!teacherPin) {
      setError("Enter the teacher PIN first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/.netlify/functions/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Teacher-Pin": teacherPin,
        },
        body: JSON.stringify(studentForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not create student.");
      }

      setStudents((current) =>
        [...current, data.student].sort((a, b) =>
          a.displayName.localeCompare(b.displayName)
        )
      );

      setSelectedStudentId(data.student.id);
      setStudentForm(blankStudent);
    } catch (err) {
      setError(err.message || "Could not create student.");
    } finally {
      setLoading(false);
    }
  }

  async function askChavruta(event) {
    event.preventDefault();

    if (!question.trim()) {
      setError("Ask Chavruta a question first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");
    setNextStep("");

    try {
      const response = await fetch("/.netlify/functions/chavruta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Teacher-Pin": teacherPin,
        },
        body: JSON.stringify({
          question,
          mode: "classroom",
          studentId: selectedStudent ? selectedStudent.id : "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Chavruta could not answer.");
      }

      setAnswer(data.response || "");
      setNextStep(data.nextStep || "");
    } catch (err) {
      setError(err.message || "Chavruta could not answer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="chavruta" className="section chavruta-section">
      <div className="section-heading">
        <p className="eyebrow">Chavruta Classroom</p>

        <h2>A Hebrew guide that remembers each student’s beginning.</h2>

        <p className="section-intro">
          Chavruta Classroom helps teachers place students into Aleph, Bet, or
          Gimel Tracks, then supports each learner with gentle Hebrew practice.
        </p>
      </div>

      <div className="chavruta-grid">
        <div className="feature-card">
          <h3>Teacher Access</h3>

          <label className="field-label" htmlFor="teacher-pin">
            Teacher PIN
          </label>

          <input
            id="teacher-pin"
            className="field-input"
            type="password"
            value={teacherPin}
            onChange={(event) => setTeacherPin(event.target.value)}
            placeholder="Enter classroom PIN"
          />

          <button className="button primary" type="button" onClick={savePin}>
            Load Students
          </button>

          <p className="small-note">
            The PIN protects student records. Do not share it with students.
          </p>
        </div>

        <form className="feature-card" onSubmit={createStudent}>
          <h3>Create Student</h3>

          <label className="field-label" htmlFor="student-name">
            Student display name
          </label>

          <input
            id="student-name"
            className="field-input"
            type="text"
            value={studentForm.displayName}
            onChange={(event) =>
              setStudentForm({
                ...studentForm,
                displayName: event.target.value,
              })
            }
            placeholder="Example: Student 1 or Eli"
          />

          <label className="field-label" htmlFor="grade-band">
            Grade band
          </label>

          <select
            id="grade-band"
            className="field-input"
            value={studentForm.gradeBand}
            onChange={(event) =>
              setStudentForm({
                ...studentForm,
                gradeBand: event.target.value,
              })
            }
          >
            <option>K-2</option>
            <option>3-5</option>
            <option>6-8</option>
            <option>9-12</option>
            <option>Mixed</option>
            <option>Unknown</option>
          </select>

          <label className="field-label" htmlFor="track">
            Starting track
          </label>

          <select
            id="track"
            className="field-input"
            value={studentForm.track}
            onChange={(event) =>
              setStudentForm({
                ...studentForm,
                track: event.target.value,
              })
            }
          >
            <option>Aleph</option>
            <option>Bet</option>
            <option>Gimel</option>
            <option>Review</option>
            <option>Unknown</option>
          </select>

          <label className="field-label" htmlFor="current-skill">
            Current skill
          </label>

          <input
            id="current-skill"
            className="field-input"
            type="text"
            value={studentForm.currentSkill}
            onChange={(event) =>
              setStudentForm({
                ...studentForm,
                currentSkill: event.target.value,
              })
            }
            placeholder="Example: Recognizes Aleph"
          />

          <button className="button primary" type="submit">
            Save Student
          </button>
        </form>

        <div className="feature-card chavruta-panel">
          <h3>Ask Chavruta</h3>

          <label className="field-label" htmlFor="student-select">
            Student
          </label>

          <select
            id="student-select"
            className="field-input"
            value={selectedStudentId}
            onChange={(event) => setSelectedStudentId(event.target.value)}
          >
            <option value="">No student selected</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.displayName} — {student.track}
              </option>
            ))}
          </select>

          {selectedStudent && (
            <div className="student-summary">
              <p>
                <strong>Track:</strong> {selectedStudent.track}
              </p>
              <p>
                <strong>Current skill:</strong>{" "}
                {selectedStudent.currentSkill || "Not set yet"}
              </p>
            </div>
          )}

          <form onSubmit={askChavruta}>
            <label className="field-label" htmlFor="chavruta-question">
              Question
            </label>

            <textarea
              id="chavruta-question"
              className="field-textarea"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Example: Help this student practice Aleph."
            />

            <button className="button primary" type="submit">
              Ask Chavruta
            </button>
          </form>

          {answer && (
            <div className="chavruta-answer">
              <h4>Chavruta says:</h4>
              <p>{answer}</p>

              {nextStep && (
                <>
                  <h4>Next step:</h4>
                  <p>{nextStep}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {loading && <p className="status-message">Working...</p>}
      {error && <p className="error-message">{error}</p>}
    </section>
  );
}

export default ChavrutaClassroom;
