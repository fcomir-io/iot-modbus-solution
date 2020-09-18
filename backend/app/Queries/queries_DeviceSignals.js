const db_connection = require("../db.config.js");

/** Devices - Signals ==> Links between both tables */

// POST - Associate MULTIPLE Siganls to Device by Device Id
const createAssociation__SignalsToDevice = (request, response) => {
  const id = parseInt(request.params.id);
  const { signals_list } = request.body;
  let signalCounter = 0;

  console.log("Body:", request.body);
  console.log("signals_list:", signals_list);

  let flag;
  let data = [];

  /** Query to delete associations between device and signals
   *
   * Risk: That the association later on does not work and we loose the firt information
   */
  db_connection
    .query("DELETE FROM device_signals WHERE device_id = $1", [id])
    .then(() => {
      /** Create an entry for each signal associated with the device */

      signals_list.forEach((signal_id) => {
        signalCounter = signalCounter + 1;
        console.log(
          "signal_id insert:",
          signal_id,
          "signalCounter:",
          signalCounter
        );

        /** Query to link device with signal */
        db_connection
          .query(
            "INSERT INTO device_signals(device_id, signal_id) VALUES ($1, $2) RETURNING device_id",
            [id, signal_id]
          )
          .then((res) => {
            data.push(
              `Signal with ID: ${signal_id} associated with device with ID: ${id}`
            );

            if (signalCounter >= signals_list.length) {
              data.forEach((msg) => response.status(200).send(msg));
            }
            console.log(
              "Dando resultado",
              signal_id,
              "signalCounter:",
              signalCounter
            );
          })
          .catch((err) =>
            console.error("Error executing ASSOCIATE query", err.stack)
          );

        console.log("Saliendo:", signal_id);
      });
    })
    .catch((err) => console.error("Error executing CLEAR query", err.stack));

  /** I don't like this solution
   * Each query should give a response to the client and not only the last one
   */
};

// GET - Signal(s) by Device Id
const getSignalByDeviceId = (request, response) => {
  const id = parseInt(request.params.id)

  db_connection.query('SELECT * FROM device_signals WHERE device_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// GET - Device(s) by Signal Id
const getDeviceBySignalId = (request, response) => {
  const id = parseInt(request.params.id)

  db_connection.query('SELECT * FROM device_signals WHERE signal_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// DELETE - Clear Association between Signal(s) AND Device by Device Id
const clearAssociation__SignalsToDevice = (request, response) => {
  const id = parseInt(request.params.id);

  db_connection.query(
    "DELETE FROM device_signals WHERE device_id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(`Device with ID: ${id} has no associated signals`);
    }
  );
};

/** EXPORT API Functions */
module.exports = {
  /** Device - Signals */
  createAssociation__SignalsToDevice,
  getSignalByDeviceId,
  getDeviceBySignalId,
  clearAssociation__SignalsToDevice,
};



/*

      signal_id_array.forEach((signal_id) => {
        signalCounter = signalCounter + 1;
        console.log(
          "signal_id insert:",
          signal_id,
          "signalCounter:",
          signalCounter
        );

        /** Query to link device with signal */
/*       db_connection
          .query(
            "INSERT INTO device_signals(device_id, signal_id) VALUES ($1, $2) RETURNING device_id",
            [id, signal_id]
          )
          .then((res) => {
            console.log(res)
            if (signalCounter >= signal_id_array.length) {
              response
                .status(200)
                .send(
                  `Signal with ID: ${signal_id_array} associated with device with ID: ${id}`
                );
            }
            console.log(
              "Dando resultado",
              signal_id,
              "signalCounter:",
              signalCounter
            );
          })
          .catch((err) => console.error("Error executing ASSOCIATE query", err.stack));

        console.log("Saliendo:", signal_id);
      });
      */
