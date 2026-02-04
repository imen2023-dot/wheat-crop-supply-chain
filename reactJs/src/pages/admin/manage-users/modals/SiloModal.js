const SiloModal = ({ silo, index, changeStatus }) => {
    // Construct unique id for each modal using index
    const modalId = `view-file-${index}`;

    return (
        <div>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#${modalId}`}>
                Details
            </button>

            <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby={`${modalId}Label`} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="view-fileLabel">Storage Silo Details</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <h2 className="fs-5">Status</h2>
                            <div className="mb3">
                                <p>{silo.user.status}</p>
                            </div>
                            <hr />
                            <h2 className="fs-5">Permit</h2>
                            {silo.user.cid ? (
                                <div className="mb3">
                                    <img src={`http://127.0.0.1:8080/ipfs/${silo.user.cid}`} className='img-fluid' alt='permit' />
                                </div>
                            ) : (
                                <div className="mb3">
                                    <p>No permit uploaded.</p>
                                </div>
                            )}
                            <hr />
                            <h2 className="fs-5">Email</h2>
                            <div className="mb3">
                                <p>{silo.user.mail}</p>
                            </div>
                            <hr />
                            <h2 className="fs-5">Ethereum Address</h2>
                            <div className="mb3">
                                <p>{silo.user.account}</p>
                            </div>
                            <hr />
                            <h2 className="fs-5">Location</h2>
                            <div className="mb3">
                                <p>{silo.location}</p>
                            </div>
                            <hr />
                            <h2 className="fs-5">Capacity of Storage</h2>
                            <div className="mb3">
                                <p>{Number(silo.capacity)} kg</p>
                            </div>
                            <hr />
                            <h2 className="fs-5">Quantity Stored</h2>
                            <div className="mb3">
                                <p>{Number(silo.quantity)} kg</p>
                            </div>

                        </div>

                        <div className="modal-footer">
                            {silo.user.status === 'Blocked' &&
                                (<button className='btn btn-success mt-1' onClick={() => changeStatus('Pending', silo.user.account, silo.user.role)}>Unblock</button>)
                            }
                            {(silo.user.status !== 'Blocked') &&
                                (<button className='btn btn-danger mt-1' onClick={() => changeStatus('Blocked', silo.user.account, silo.user.role)} >Block</button>)
                            }
                            {(silo.user.status === 'Pending') && (silo.user.cid !== '') && (
                                <button type="button" className="btn btn-primary" onClick={() => changeStatus('Active', silo.user.account, silo.user.role)}>Activate</button>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SiloModal;