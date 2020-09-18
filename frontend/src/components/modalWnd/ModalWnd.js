import React, { useState, useEffect } from "react";

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CFormGroup,
  CLabel,
  CInput,
  CTextarea,
  CInputCheckbox,
  CBadge,
} from "@coreui/react";

const ModalWnd = (props) => {
  /** Handle Edition Mode  */
  const [editMode, setEditMode] = useState(() => {
    if (props.mode == "edit") return false;
    return true;
  });
  /** Edit Name */
  const [old_name, setOldName] = useState(props.data.name);
  const [name, setName] = useState(props.data.name);
  /** Edit Description */
  const [old_description, setOldDescription] = useState(props.data.description);
  const [description, setDescription] = useState(props.data.description);
  /** Edit Location */
  const [old_location, setOldLocation] = useState(props.data.location);
  const [location, setLocation] = useState(props.data.location);
  /** Edit Devices */
  const [deviceIDs, setDeviceIDs] = useState(props.data.devices);
  const [deviceObjects, setDeviceObjects] = useState(() => {
    if (props.mode == "edit") {
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
  const [old_deviceObjects, setOldDeviceObjects] = useState(deviceObjects);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    console.log("Devices", deviceObjects);
  }, [deviceObjects]);

  /** Handler for CInputs */
  function handleOnChange_Name(e) {
    e.preventDefault();
    setName(e.target.value);
  }
  function handleOnChange_Description(e) {
    e.preventDefault();
    setDescription(e.target.value);
  }
  function handleOnChange_Location(e) {
    e.preventDefault();
    setLocation(e.target.value);
  }

  /** Handler for CCheckBox */
  function handleOnChange_Device(e) {
    //e.preventDefault();
    console.log(e.target);
    const deviceID = e.target.id;

    // Update array of Device Objects
    setDeviceObjects(
      deviceObjects.map((object) => {
        if (object.id == deviceID) {
          // Device to update
          return { ...object, checked: e.target.checked };
        }
        // Device is not the one clicked ==> nothing to do
        return object;
      })
    );
  }

  /** Handlers for CButtons */
  function handleClick_Save(e) {
    e.preventDefault();

    // Update old data with the new changed
    setOldName(name);
    setOldDescription(description);
    setOldLocation(location);
    setOldDeviceObjects(deviceObjects);

    // Disable Edit mode
    setEditMode(false);
  }

  function handleClick_Cancel(e) {
    e.preventDefault();

    // Discard changed data and keep the old one
    setName(old_name);
    setDescription(old_description);
    setLocation(old_location);
    setDeviceObjects(old_deviceObjects);

    // Disable Edit mode
    setEditMode(false);
  }

  return (
    <CModal show={true} onClose={props.onClose}>
      <CModalHeader closeButton>
        <h3>
          {props.mode === "edit"
            ? "Test Bench Information"
            : "Introducing a new Test Bench"}
        </h3>
      </CModalHeader>
      <CModalBody>
        <CCol>
          <CCard>
            {props.mode === "edit" ? (
              <CCardHeader>
                ID: {props.data.id}
                <CBadge className="float-right" color={props.color}>
                  {props.data.status}
                </CBadge>
              </CCardHeader>
            ) : (
              ""
            )}
            <CCardBody>
              <CFormGroup>
                <CLabel htmlFor="testbench-name">Test Bench Name</CLabel>
                <CInput
                  id="testbench-name"
                  placeholder="Enter the name of the test bench"
                  value={name}
                  disabled={!editMode}
                  onChange={handleOnChange_Name}
                  autoFocus
                />
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="testbench-description">
                  Test Bench Description
                </CLabel>
                <CTextarea
                  name="testbench-description-input"
                  id="testbench-description"
                  rows="5"
                  value={description}
                  placeholder="Describe the test bench..."
                  disabled={!editMode}
                  onChange={handleOnChange_Description}
                />
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="testbench-location">Location</CLabel>
                <CInput
                  id="testbench-location"
                  value={location}
                  placeholder="Enter location of the test bench"
                  disabled={!editMode}
                  onChange={handleOnChange_Location}
                />
              </CFormGroup>
              {props.mode === "edit" ? (
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
                                disabled={!editMode}
                                onClick={handleOnChange_Device}
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
            </CCardBody>
          </CCard>
        </CCol>
      </CModalBody>
      <CModalFooter>
        {editMode === false ? (
          <>
            <CButton color="danger" onClick={() => setEditMode(true)}>
              Edit
            </CButton>{" "}
            <CButton color="success" onClick={() => props.onClose(false)}>
              Close
            </CButton>
          </>
        ) : (
          <>
            <CButton color="info" onClick={handleClick_Save}>
              Save
            </CButton>
            <CButton color="light" onClick={handleClick_Cancel}>
              Cancel
            </CButton>
          </>
        )}
      </CModalFooter>
    </CModal>
  );
};

export default ModalWnd;

/* Los botens
fetch de los device data para cruzarlo con los IDs
Actualizar base de datos cuando se da OK
*/
