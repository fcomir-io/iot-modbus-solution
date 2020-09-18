import React, { useState, useEffect } from "react";
import {
  CDataTable,
  CRow,
  CFormGroup,
  CLabel,
  CInput,
  CTextarea,
  CInputCheckbox,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
} from "@coreui/react";
import SignalSelector from "../../components/modalWnd/SignalSelector";

/** Update table data */
import signalsData from "../../assets/myMockups/SignalsData";

/** Define table fields */
const fields = ["id", "address", "name", "type", "description", "devices"];

const Signals = () => {
  const [modal, setModal] = useState(false);
  const [signal_data, setSignalData] = useState({
    id: "",
    address: "",
    name: "",
    type: "",
    description: "",
    devices: [],
  });
  const [modalMode, setModalMode] = useState("edit");

  const [deviceIDs, setDeviceIDs] = useState(signal_data.devices);
  const [deviceObjects, setDeviceObjects] = useState(() => {
    if (modalMode == "edit") {
      console.log("EDIT");
      let tempArray = [];
      let tempObject = {};
      deviceIDs.forEach((deviceID, i) => {
        tempObject = {
          id: i,
          checked: true,
          name: "Device " + deviceID,
        };
        tempArray.push(tempObject);
      });
      return tempArray;
    }
  });

  const [selectedSignals, setSelectedSignals] = useState([])

  useEffect(() => {
    setSignalData(signalsData);
    console.log("signal_data", signal_data);
  }, [signal_data]);

  function handleOnClick_AddSignal(e) {
    e.preventDefault();
    console.log("ADD", e);
    setSignalData({
      id: 100,
      name: "",
      description: "",
      location: "",
      status: "",
    });
    setModalMode("add");
    setModal(true);
  }
  const handle_onRowClick = (e) => {
    console.log("Selected data", e);
    setSelectedSignals(e.devices);
    setModalMode("edit");
    setModal(true);
  };

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader className="tb-list-table-header">
              <h1 size="sm">List of Test Benches</h1>
              <CButton
                className="float-right tb-add-button"
                color="success"
                onClick={handleOnClick_AddSignal}
              >
                + Add
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={signalsData}
                fields={fields}
                hover
                striped
                bordered
                size="sm"
                itemsPerPage={10}
                pagination
                clickableRows={true}
                onRowClick={handle_onRowClick}
              />

              {modal === true ? (
                <CRow>
                  <CCol>
                    <CCard>
                      <h1>Signal Information</h1>
                      {modalMode === "edit" ? (
                        <CCardHeader>ID: {signal_data.id}</CCardHeader>
                      ) : (
                        ""
                      )}
                      <CCardBody>
                        <CRow>
                          <CCol sm="3">
                            <CFormGroup>
                              <CLabel htmlFor="signal-name">Signal Name</CLabel>
                              <CInput
                                id="signal-name"
                                placeholder="Enter the name of the signal"
                                value={signal_data.name}
                                disabled={!modalMode}
                                //onChange={handleOnChange_Name}
                                autoFocus
                              />
                            </CFormGroup>
                          </CCol>
                          <CCol>
                            <CFormGroup>
                              <CLabel htmlFor="testbench-description">
                                Test Bench Description
                              </CLabel>
                              <CTextarea
                                name="testbench-description-input"
                                id="testbench-description"
                                rows="5"
                                value={signal_data.description}
                                placeholder="Describe the test bench..."
                                disabled={!modalMode}
                                //onChange={handleOnChange_Description}
                              />
                            </CFormGroup>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol>
                            <CFormGroup>
                              <CLabel htmlFor="signal-address">Address</CLabel>
                              <CInput
                                id="signal-address"
                                value={signal_data.address}
                                placeholder="Enter address of the signal"
                                disabled={!modalMode}
                                //onChange={handleOnChange_Location}
                              />
                            </CFormGroup>
                          </CCol>
                          <CCol>
                            <CFormGroup>
                              <CLabel htmlFor="signal-type">Type</CLabel>
                              <CInput
                                id="signal-type"
                                value={signal_data.type}
                                placeholder="Enter type of the signal"
                                disabled={!modalMode}
                                //onChange={handleOnChange_Location}
                              />
                            </CFormGroup>
                          </CCol>
                        </CRow>

                        {modalMode === "edit" ? (
                          <CCard>
                            <CCardBody>
                              <CFormGroup row>
                                <CCol md="9">
                                  <CLabel>Associated Devices</CLabel>
                                  {deviceObjects.map((deviceObject, i) => {
                                    return (
                                      <CFormGroup
                                        key={i}
                                        variant="checkbox"
                                        className="checkbox"
                                      >
                                        <CInputCheckbox
                                          id={i}
                                          name={deviceObject.name}
                                          value={i}
                                          checked={deviceObject.checked}
                                          disabled={!modalMode}
                                          //onClick={handleOnChange_Device}
                                        />
                                        <CLabel
                                          variant="checkbox"
                                          className="form-check-label"
                                          htmlFor={deviceObject.name}
                                        >
                                          {deviceObject.name}
                                        </CLabel>
                                      </CFormGroup>
                                    );
                                  })}
                                </CCol>
                              </CFormGroup>
                            </CCardBody>
                          </CCard>
                        ) : (
                          ""
                        )}

                        {modalMode === false ? (
                          <div>
                            <CButton
                              color="danger"
                              //onClick={() => setEditMode(true)}
                            >
                              Edit
                            </CButton>{" "}
                            <CButton
                              color="success"
                              //7onClick={() => props.onClose(false)}
                            >
                              Close
                            </CButton>
                          </div>
                        ) : (
                          <div>
                            <CButton
                              color="info" /*onClick={handleClick_Save}*/
                            >
                              Save
                            </CButton>
                            <CButton
                              color="light"
                              onClick={() => setModal(true)}
                            >
                              Cancel
                            </CButton>
                          </div>
                        )}
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
              ) : (
                ""
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {modal === true ? <SignalSelector onClose={setModal} selectedSignals={selectedSignals}/> : ""}
      </CRow>
    </>
  );
};

export default Signals;
