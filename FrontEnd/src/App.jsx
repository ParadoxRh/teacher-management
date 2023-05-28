import { useEffect, useState } from "react";
import axios from 'axios'

function App() {
  const [dataList, setDataList] = useState([]);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    axios.get("http://localhost:8080/student")
      .then((response) => setDataList(response.data))
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setName("");
    setSubject("");
  };

  return (
    <div>
      <div>
        <header>
          <h1>System management</h1>
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="name"> name: </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="subject">Subjet: </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <button type="submit">ADD</button>
          </form>
        </header>
      </div>

      <main className="list">
        <div>
          {dataList.map((item) => (
            <div key={item.id}>
              <p>Name: {item.name}</p>
              <p>Subject: {item.subject}</p>
              <p>Score: {item.score}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
