import { useState } from "react";

const FEEDBACK_API_URL = import.meta.env.VITE_FEEDBACK_API_URL;

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [file, setFile] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showImage, setShowImage] = useState(false)

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let file_base64 = null;

    try {
      if (file) {
        file_base64 = await convertFileToBase64(file);
      }

      const res = await fetch(FEEDBACK_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          file_base64,
        }),
      });

      const data = await res.json();
      setModalMessage(data.message || "Feedback submitted successfully!");
      setShowModal(true);
    } catch (err) {
      setModalMessage("Submission failed. Please try again later.");
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    window.location.reload();
  };

  return (
    <div className="main">
      <style>{`
        body {
          font-family: 'Roboto', sans-serif;
          padding: 2rem;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          color: #333;
          width: 100%;
          hight: 100%;
          display: flex;
          overflow: hidden;
          justify-content: center;
          align-items: center;
        }

        .main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        }

        form {
          background: rgba(255, 255, 255, 0.8);
          width: 500px;
          margin: 2rem auto;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          width: 450px;
          justify-content: center;
          align-items: center;
        }

        input, textarea {
          width: 100%;
          margin-top: 10px;
          padding: 12px;
          border: 1px solid rgba(221, 221, 221, 0.8);
          border-radius: 8px;
          font-size: 16px;
          background: rgba(255, 255, 255, 1);
          resize: none;
          color: black;
        }

        button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          margin-top: 15px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          width: 100%;
        }

        h2 {
          font-size: 28px;
          margin-bottom: 20px;
          color: #4a5568;
          text-align: center;
        }

        .modal {
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.4);
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          text-align: center;
          max-width: 400px;
          width: 90%;
        }

        .arc-btn {
           max-width: 400px;
        }

       .arc-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }
        
        .arc-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 30px;
          color: white;
          font-size: 40px;
          cursor: pointer;
          z-index: 2100;
        }
      `}</style>

      <form onSubmit={handleSubmit}>
        <h2>Feedback Form Test 5</h2>

        <input
          type="text"
          id="name"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          id="email"
          placeholder="Your Email"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <textarea
          id="message"
          placeholder="Your Message"
          required
          value={formData.message}
          onChange={handleChange}
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        <button type="submit">Submit</button>
      </form>

      <button className="arc-btn" onClick={() => setShowImage(true)}>Architecture</button>

      {showImage &&
        <div className="arc-container">
          <h1 className="close-btn" onClick={() => setShowImage(false)}>X</h1>
          <img src="/architecture.png" alt="Architecture" />
        </div>
      }
      
      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <p>{modalMessage}</p>
            <button onClick={closeModal}>Okay</button>
          </div>
        </div>
      )}

    </div>
  );
}