const SiloProfile = ({ silo }) => {
  return (
    <div>
      <div>
        <div className="mb-3">
          <h2 className="fs-5">Status</h2>
          <p>{silo.user.status}</p>
        </div>
        <hr />
        <h2 className="fs-5">Permit</h2>
        {silo.user.cid ? (
          <div className="mb-3">
            <img
              src={`http://127.0.0.1:8080/ipfs/${silo.user.cid}`}
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
          <p>{silo.user.mail}</p>
        </div>
        <hr />
        <h2 className="fs-5">Ethereum Address</h2>
        <div className="mb-3">
          <p>{silo.user.account}</p>
        </div>
        <hr />
        <h2 className="fs-5">Location</h2>
        <div className="mb-3">
          <p>{silo.location}</p>
        </div>
        <hr />
        <h2 className="fs-5">Capacity of Storage</h2>
        <div className="mb-3">
          <p>{Number(silo.capacity)} kg</p>
        </div>
        <hr />
        <h2 className="fs-5">Quantity Stored</h2>
        <div className="mb-3">
          <p>{Number(silo.quantity)} kg</p>
        </div>
      </div>

    </div>
  );
};

export default SiloProfile;
