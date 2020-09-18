const db_connection = require("../db.config.js");

/** Testbenches - Devices ==> Links between both tables */

// POST - Associate ONE Testbench to Device by Device Id
const createAssociation__TestbenchToDevice = (request, response) => {
  const id = parseInt(request.params.id);
  const { test_bench_id } = request.body;

  console.log("Body:", request.body);
  console.log("test_bench_id:", test_bench_id);

  /** Query to link device with signal */
  db_connection
    .query(
      "INSERT INTO testbench_device(associated_test_bench_id, associated_device_id) VALUES ($1, $2) RETURNING associated_test_bench_id",
      [test_bench_id, id]
    )
    .then((res) => {
      response.status(200).send(`Testbench with ID: ${test_bench_id} associated with Device with ID: ${id}`);
    })
    .catch((err) =>
      console.error("Error executing ASSOCIATE query", err.stack)
    );

  console.log("Saliendo:", id);
};

// GET - Device(s) by Testbench Id
const getDeviceByTestbenchId = (request, response) => {
  const id = parseInt(request.params.id);

  db_connection.query(
    "SELECT * FROM testbench_device WHERE associated_test_bench_id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// GET - Testbench by Device Id
const getTestbenchByDeviceId = (request, response) => {
  const id = parseInt(request.params.id);

  db_connection.query(
    "SELECT * FROM testbench_device WHERE associated_device_id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// POST - Associate MULTIPLE Devices to ONE Testbench by Testbench Id
const createAssociation__DevicesToTestbench = (request, response) => {
  const id = parseInt(request.params.id);
  const { devices_list } = request.body;
  let deviceCounter = 0;

  console.log("Body:", request.body);
  console.log("devices_list:", devices_list);

  let data = [];

  /** Query to delete associations between device and signals
   *
   * Risk: That the association later on does not work and we loose the firt information
   */
  db_connection
    .query("DELETE FROM testbench_device WHERE associated_test_bench_id = $1", [id])
    .then(() => {
      /** Create an entry for each device associated with the test bench */

      devices_list.forEach((device_id) => {
        deviceCounter = deviceCounter + 1;
        console.log(
          "device_id insert:",
          device_id,
          "deviceCounter:",
          deviceCounter
        );

        /** Query to link device with signal */
        db_connection
          .query(
            "INSERT INTO testbench_device(associated_test_bench_id, associated_device_id) VALUES ($1, $2) RETURNING associated_test_bench_id",
            [id, device_id]
          )
          .then((res) => {
            data.push(
              `Device with ID: ${device_id} associated with test bench with ID: ${id}`
            );

            if (deviceCounter >= devices_list.length) {
              data.forEach((msg) => response.status(200).send(msg));
            }
            console.log(
              "Dando resultado",
              device_id,
              "deviceCounter:",
              deviceCounter
            );
          })
          .catch((err) => {
            //console.error("Error executing ASSOCIATE query", err.stack)
            response.status(504).send("Error executing ASSOCIATE query")
          }
          );
      });
    })
    .catch((err) => {
      console.error("Error executing CLEAR query", err.stack)
      response.status(504).send("Error executing CLEAR query")
    });

  /** I don't like this solution
   * Each query should give a response to the client and not only the last one
   */
};

// DELETE - Clear Association between Device(s) AND Testbench by Testbench Id
const clearAssociation__DevicesToTestbench = (request, response) => {
  const id = parseInt(request.params.id);
  
  console.log("testbench ID:", id);

  db_connection.query(
    "DELETE FROM testbench_device WHERE associated_test_bench_id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(`Test Bench with ID: ${id} has no associated devices`);
    }
  );
};

/** EXPORT API Functions */
module.exports = {
  /** Device - Signals */
  createAssociation__TestbenchToDevice,
  getDeviceByTestbenchId,
  getTestbenchByDeviceId,
  createAssociation__DevicesToTestbench,
  clearAssociation__DevicesToTestbench,
};
