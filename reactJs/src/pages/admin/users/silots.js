import { useEffect, useRef } from "react";

const Silots = ({ formData, setFormData, state = null, indexes = null }) => {
  const containerRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  useEffect(() => {
    if (state !== null && indexes !== null && containerRef.current) {
      if (indexes.indexOf(state) === -1) {
        const inputElements = containerRef.current.querySelectorAll('input');
        inputElements.forEach(input => {
          input.disabled = true;
        });
      } else {
        const inputElements = containerRef.current.querySelectorAll('input');
        inputElements.forEach(input => {
          input.disabled = false;
        });
      }
    }
  }, [indexes, state]);


  return (
    <div className="mb-1 row silo-form"  ref={containerRef} >
      <div className="mb-3 col-md-6">
        <label htmlFor="email" className="form-label" >Email:</label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          
        />
      </div>
      <div className="mb-3 col-md-6">
        <label htmlFor="password" className="form-label">Password:</label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3 col-md-6">
        <label htmlFor="address" className="form-label">Ethereum Address:</label>
        <input
          type="text"
          className="form-control"
          id="address"
          value={formData.address}
          onChange={handleInputChange}
          pattern="^0x[a-fA-F0-9]{40}$"
          required
        />
        <small className="text-muted">
          Must start with '0x' followed by 40 hexadecimal characters (0-9, a-f).
        </small>
      </div>
      <div className="mb-3 col-md-6">
        <label htmlFor="location" className="form-label">Location :</label>
        <input
          type="text"
          className="form-control"
          id="location"
          value={formData.location}
          onChange={handleInputChange}
          pattern="\[\d+(\.\d+)?, \d+(\.\d+)?\]"
          required
        />
        <small className="text-muted">
          Format: [digits, digits] (e.g., [12,34])
        </small>
      </div>
      <div className="mb-3 col-md-6">
        <label htmlFor="capacity" className="form-label">Capacity in Kg:</label>
        <input
          type="number"
          className="form-control"
          id="capacity"
          value={formData.capacity}
          onChange={handleInputChange}
          required
        />
      </div>
    </div>
  );
}

export default Silots;
