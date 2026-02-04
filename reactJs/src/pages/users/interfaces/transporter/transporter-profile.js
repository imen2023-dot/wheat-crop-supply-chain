const TransporterProfile = ({ transporter }) => {
  return (
    <div>
      <div>
        <div className="mb-3">
          <h2 className="fs-5">Status</h2>
          <p>{transporter.user.status}</p>
        </div>
        <hr />
        <h2 className="fs-5">Permit</h2>
        {transporter.user.cid ? (
          <div className="mb-3">
            <img
              src={`http://127.0.0.1:8080/ipfs/${transporter.user.cid}`}
              className="img-fluid"
              alt="permit"
            />
          </div>
        ) : (
          <div className="mb-3">
            <p>No permit uploaded.</p>
          </div>
        )}
        <hr />
        <h2 className="fs-5">Email</h2>
        <div className="mb-3">
          <p>{transporter.user.mail}</p>
        </div>
        <hr />
        <h2 className="fs-5">Ethereum Address</h2>
        <div className="mb-3">
          <p>{transporter.user.account}</p>
        </div>
        <hr />
        <h2 className="fs-5">Phone Number</h2>
        <div className="mb-3">
          <p>{Number(transporter.number)}</p>
        </div>
        <hr />
        <h2 className="fs-5">License Plate</h2>
        <div className="mb-3">
          <p>{transporter.licensePlate}</p>
        </div>
      </div>
    </div>
  );
};

export default TransporterProfile;
