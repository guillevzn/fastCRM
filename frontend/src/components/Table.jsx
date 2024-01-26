import React, { useContext, useEffect, useState } from "react";
import moment from "moment";

import ErrorMessage from "./ErrorMessage";
import LeadModal from "./LeadModal";
import { UserContext } from "../context/UserContext";

import InlineEdit from "./InlineEdit";

const Table = () => {
  const [token] = useContext(UserContext);
  const [leads, setLeads] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [id, setId] = useState(null);

  const handleUpdate = async (id) => {
    setId(id);
    setActiveModal(true);
  };

  const handleDelete = async (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(`/api/leads/${id}`, requestOptions);
    if (!response.ok) {
      setErrorMessage("Failed to delete lead");
    }

    getLeads();
  };

  const getLeads = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch("/api/leads", requestOptions);
    if (!response.ok) {
      setErrorMessage("Something went wrong.\nCould not load the leads.");
    } else {
      const data = await response.json();
      setLeads(data);
      setLoaded(true);
    }
  };

  useEffect(() => {
    getLeads();
  }, []);

  const handleModal = () => {
    setActiveModal(!activeModal);
    getLeads();
    setId(null);
  };

  return (
    <> 
    <LeadModal
        active={activeModal}
        handleModal={handleModal}
        token={token}
        id={id}
        setErrorMessage={setErrorMessage}/>
    <button
        className="button is-fullwidth mb-5 is-primary"
        onClick={() => setActiveModal(true)}>
        Create lead
    </button>
      <ErrorMessage message={errorMessage} />
      {loaded && leads ? (
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Note</th>
              <th>Last updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <InlineEdit value={lead.first_name} setValue={(value) => console.log("Set first_name to", value)} />
                </td>
                <td>
                  <InlineEdit value={lead.last_name} setValue={(value) => console.log("Set last_name to", value)} />
                </td>
                <td>
                  <InlineEdit value={lead.company} setValue={(value) => console.log("Set company to", value)} />
                </td>
                <td>
                  <InlineEdit value={lead.email} setValue={(value) => console.log("Set email to", value)} />
                </td>
                <td>
                  <InlineEdit value={lead.note} setValue={(value) => console.log("Set note to", value)} />
                </td>
                <td>{moment(lead.date_last_updated).format("Do MMM YY")}</td>
                <td>
                  <button
                    className="button mr-2 is-danger is-light"
                    onClick={() => handleDelete(lead.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
};

export default Table;