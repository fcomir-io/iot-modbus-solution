const db_connection = require("../db.config.js");

/** Test Benches */
// GET - All Test Benches
const getTestBenches = (request, response) => {
  db_connection.query('SELECT * FROM test_benches ORDER BY test_bench_id DESC ', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// GET - Test Bench by Id
const getTestBenchById = (request, response) => {
  const id = parseInt(request.params.id)

  db_connection.query('SELECT * FROM test_benches WHERE test_bench_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// POST - New Test Bench
const createTestBench = (request, response) => {
  const { description, location } = request.body

  console.log("Body:", request.body)
  console.log("description:", description)
  console.log("location:", location)

  db_connection.query('INSERT INTO test_benches(description, location) VALUES ($1, $2) RETURNING test_bench_id', [description, location], (error, result) => {
    if (error) {
      throw error
    }
    
    console.log("result:", result)
    const insertId = result.rows[0].test_bench_id
    console.log("result.test_bench_id:", result.rows[0].test_bench_id)
    response.status(201).send(`Test Bench added with ID: ${insertId}`)
  })
}

// PUT - Update Test Bench
const updateTestBench = (request, response) => {
  const id = parseInt(request.params.id)
  const { description, location } = request.body

  console.log("Body:", request.body)
  console.log("id:", id)
  console.log("description:", description)
  console.log("location:", location)

  db_connection.query('UPDATE test_benches SET description = $1, location = $2 WHERE test_bench_id = $3', [description, location, id], (error, result) => {
    if (error) {
      throw error
    }
    
    console.log("result:", result)
    response.status(200).send(`Testbench modified with ID: ${id}`)
  })
}

// DELETE - Delete Test Bench
const deleteTestBenchById = (request, response) => {
  const id = parseInt(request.params.id)

  db_connection.query('DELETE FROM test_benches WHERE test_bench_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Testbench with ID: ${id} deleted`)
  })
}

// DELETE - Empty table Test Bench
const deleteAllTestBenches = (request, response) => {
  db_connection.query('DELETE FROM test_benches', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Table of Test Benches completely emptied!!!`)
  })
}

/** EXPORT API Functions */
module.exports = {
  /** Test Benches */
  getTestBenches,
  getTestBenchById,
  createTestBench,
  updateTestBench,
  deleteTestBenchById,
  deleteAllTestBenches,
}