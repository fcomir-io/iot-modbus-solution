import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

// https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples

function App() {
  const [test_benches, setTestBenches] = useState([]);
  const [new_TB__description, setNewTestBenchDescription] = useState("");
  const [new_TB__location, setNewTestBenchLocation] = useState("");
  const [testBench_Id, setTestBenchId] = useState("");

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    fetch("/test_benches")
      .then((res) => res.json())
      .then((test_benches) => setTestBenches(test_benches));
  });

  /** ADD NEW TEST BENCH */
  function handleChange__Description(event) {
    setNewTestBenchDescription(event.target.value);
  }

  function handleChange__Location(event) {
    setNewTestBenchLocation(event.target.value);
  }

  async function handleSubmit__Add(event) {
    event.preventDefault();
    console.log("In Submit: ");

    // POST request using fetch inside useEffect React hook
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: `${new_TB__description}`,
        location: `${new_TB__location}`,
      }),
    };

    console.log("Data to POST: ", requestOptions);

    const response = await fetch("/test_bench", requestOptions);
    const data = await response;
    console.log("Response: ", response);
    console.log("Data returned: ", data);
  }

  /** UPDATE SPECIFIC TEST BENCH */
  function handleChange__TestBenchId(event) {
    setTestBenchId(event.target.value);
  }

  async function handleSubmit__GetTestBenchByID(event) {
    event.preventDefault();

    fetch(`/test_bench/${testBench_Id}`)
      .then((res) => res.json())
      .then((test_bench) => {
        console.log(test_bench);
        console.log(test_bench[0]);
        setNewTestBenchDescription(test_bench[0]["description"]);
        setNewTestBenchLocation(test_bench[0]["location"]);
      });
  }

  async function handleSubmit__Update(event) {
    event.preventDefault();

    // POST request using fetch inside useEffect React hook
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: `${new_TB__description}`,
        location: `${new_TB__location}`,
      }),
    };

    console.log("Data to POST: ", requestOptions);

    const response = await fetch(`/test_bench/${testBench_Id}`, requestOptions);
    const data = await response;
    console.log("Response: ", response);
    console.log("Data returned: ", data);
  }

  /** DELETE SPECIFIC TEST BENCH */
  async function handleSubmit__Delete(event) {
    event.preventDefault();

    // POST request using fetch inside useEffect React hook
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    console.log("Data to POST: ", requestOptions);

    const response = await fetch(`/test_bench/${testBench_Id}`, requestOptions);
    const data = await response;
    console.log("Response: ", response);
    console.log("Data returned: ", data);
  }

  /** DELETE ALL TEST BENCHES */
  async function handleSubmit__DeleteAll(event) {
    event.preventDefault();

    // POST request using fetch inside useEffect React hook
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    console.log("Data to POST: ", requestOptions);

    const response = await fetch(`/test_benches/empty_table`, requestOptions);
    const data = await response;
    console.log("Response: ", response);
    console.log("Data returned: ", data);  
  }

  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>

      <div className="test-bench-api">

        <div className="all-testbenches">
          <h1> GET All test Benches </h1>
          <div>
            {test_benches.map((test_bench) => (
              <div key={test_bench.test_bench_id}>
                {test_bench.test_bench_id}- {test_bench.description}-{" "}
                {test_bench.location}
              </div>
            ))}
          </div>
        </div>

        <div className="add-testbench">
          <h1> Add new Test Bench </h1>
          <div>
            <form onSubmit={handleSubmit__Add}>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={new_TB__description}
                  onChange={handleChange__Description}
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={new_TB__location}
                  onChange={handleChange__Location}
                />
              </label>
              <input type="submit" value="Add new Test Bench" />
            </form>
          </div>
        </div>

        <div className="testbench-selector">
          <form onSubmit={handleSubmit__GetTestBenchByID}>
            <label>
              Enter ID:
              <input
                type="text"
                name="testBenchId"
                value={testBench_Id}
                onChange={handleChange__TestBenchId}
              />
            </label>
            <input type="submit" value="Select Test Bench by ID" />
          </form>
        </div>

        <div className="update-testbench">
          <h1> Update specific Test Bench </h1>
          <div>
            <form onSubmit={handleSubmit__Update}>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={new_TB__description}
                  onChange={handleChange__Description}
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={new_TB__location}
                  onChange={handleChange__Location}
                />
              </label>
              <input type="submit" value="Update Test Bench by ID" />
            </form>
          </div>
        </div>

        <div className="delete-testbench">
          <h1> Delete specific Test Bench </h1>
          <div>
            <form onSubmit={handleSubmit__Delete}>
              <input type="submit" value="Delete Test Bench by ID" />
            </form>
          </div>
        </div>

        <div className="empty-testbench-table">
          <h1> Delete ALL Test Benches </h1>
          <div>
            <form onSubmit={handleSubmit__DeleteAll}>
              <input type="submit" value="Delete All Test Benches" />
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
