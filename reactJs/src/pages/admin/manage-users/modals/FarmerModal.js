const FarmerModal = ({ farmer, index , changeStatus}) => {
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
                            <h1 className="modal-title fs-5" id="view-fileLabel">Farmer Details</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        <h2 className="fs-5">Status</h2>
                            <div className="mb3">   
                            <p>{farmer.user.status}</p>                                 
                            </div>
                        <hr/>
                        <h2 className="fs-5">Permit</h2>
                        {farmer.user.cid ? (
                            <div className="mb3">                                    
                                    <img src={`http://127.0.0.1:8080/ipfs/${farmer.user.cid}`} className='img-fluid' alt='permit'/>
                                </div>
                        ) : (
                            <div className="mb3">
                                    <p>No permit uploaded.</p>
                            </div>
                        )}  
                            <hr/>
                            <h2 className="fs-5">Email</h2>
                            <div className="mb3">   
                            <p>{farmer.user.mail}</p>                                 
                            </div>
                            <hr/>
                            <h2 className="fs-5">Ethereum Address</h2>
                            <div className="mb3">   
                            <p>{farmer.user.account}</p>                                 
                            </div>
                            <hr/>
                            <h2 className="fs-5">Phone Number</h2>
                            <div className="mb3">   
                            <p>{Number(farmer.number)}</p>                                 
                            </div>
                            <hr/>
                            <h2 className="fs-5">Full Name</h2>
                            <div className="mb3">   
                            <p>{farmer.name}</p>                                 
                            </div>                          

                            </div>

                                <div className="modal-footer">
                                {farmer.user.status ==='Blocked' &&
                                (<button className='btn btn-success mt-1' onClick={() =>changeStatus('Pending' , farmer.user.account)}>Unblock</button>)
                                }
                                {(farmer.user.status !=='Blocked' )&&
                                (<button className='btn btn-danger mt-1' onClick={()=>changeStatus('Blocked' , farmer.user.account)} >Block</button>)
                                }
                                {(farmer.user.status === 'Pending') && (farmer.user.cid !== '') && (
                                    <button type="button" className="btn btn-primary" onClick={() =>changeStatus('Active' , farmer.user.account)}>Activate</button>
                                )}
                                    
                                </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FarmerModal;