const TransporterModal = ({ transporter, index , changeStatus }) => {
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
                            <h1 className="modal-title fs-5" id="view-fileLabel">Transporter Details</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        <h2 className="fs-5">Status</h2>
                            <div className="mb3">   
                            <p>{transporter.user.status}</p>                                 
                            </div>
                        <hr/>
                        <h2 className="fs-5">Permit</h2>
                        {transporter.user.cid ? (
                            <div className="mb3">                                    
                                    <img src={`http://127.0.0.1:8080/ipfs/${transporter.user.cid}`} className='img-fluid' alt='permit'/>
                                </div>
                        ) : (
                            <div className="mb3">
                                    <p>No permit uploaded.</p>
                            </div>
                        )}  
                            <hr/>
                            <h2 className="fs-5">Email</h2>
                            <div className="mb3">   
                            <p>{transporter.user.mail}</p>                                 
                            </div>
                            <hr/>
                            <h2 className="fs-5">Ethereum Address</h2>
                            <div className="mb3">   
                            <p>{transporter.user.account}</p>                                 
                            </div>
                            <hr/>
                            <h2 className="fs-5">Phone Number</h2>
                            <div className="mb3">   
                            <p>{Number (transporter.number)}</p>                                 
                            </div>
                            <hr/>
                            <h2 className="fs-5">License Plate</h2>
                            <div className="mb3">   
                            <p>{transporter.licensePlate}</p>                                 
                            </div>                          

                            </div>

                                <div className="modal-footer">
                                {transporter.user.status ==='Blocked' &&
                                (<button className='btn btn-success mt-1' onClick={() =>changeStatus('Pending' , transporter.user.account , transporter.user.role)}>Unblock</button>)
                                }
                                {(transporter.user.status !=='Blocked' )&&
                                (<button className='btn btn-danger mt-1' onClick={()=>changeStatus('Blocked' , transporter.user.account , transporter.user.role)} >Block</button>)
                                }
                                {(transporter.user.status === 'Pending') && (transporter.user.cid !== '') && (
                                    <button type="button" className="btn btn-primary" onClick={() =>changeStatus('Active' , transporter.user.account , transporter.user.role)}>Activate</button>
                                )}
                                    
                                </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransporterModal;