const FarmerProfile = ({ farmer}) => {
    return (
      <div>
        <div>
          <div className="mb-3">
            <h2 className="fs-5">Status</h2>
            <p>{farmer.user.status}</p>
          </div>
          <hr />
          <h2 className="fs-5">Permit</h2>
          {farmer.user.cid ? (
            <div className="mb-3">
              <img
                src={`http://127.0.0.1:8080/ipfs/${farmer.user.cid}`}
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
            <p>{farmer.user.mail}</p>
          </div>
          <hr />
          <h2 className="fs-5">Ethereum Address</h2>
          <div className="mb-3">
            <p>{farmer.user.account}</p>
          </div>
          <hr />
          <h2 className="fs-5">Phone Number</h2>
          <div className="mb-3">
            <p>{Number(farmer.number)}</p>
          </div>
          <hr />
          <h2 className="fs-5">Full Name</h2>
          <div className="mb-3">
            <p>{farmer.name}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default FarmerProfile;
  