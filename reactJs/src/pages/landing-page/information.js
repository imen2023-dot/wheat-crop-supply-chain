import office from '../../assets/images/wheat.avif';
import officee from '../../assets/images/farmers.avif';
import officeee from '../../assets/images/grain.avif';

const Info = () => {
  const officeCereal = {
    officeName: "Cereals Office",
    description: "Established in 1962 by Decree-Law No. 62-10 issued on April 3, 1962, and placed under the jurisdiction of the Ministry of Agriculture, the Office des Céréales, or the Cereals Office, stands as a pivotal institution in the agricultural landscape. Functioning as a Public Company, it enjoys legal autonomy and financial independence. With its inception, it was tasked with the exclusive responsibility of overseeing the marketing and distribution of wheat within the region. Over the years, it has played a vital role in stabilizing the agricultural sector, ensuring the smooth flow of grains from farms to markets. Its strategic importance cannot be overstated, as it continues to uphold the nation's food security and agricultural sustainability."
  };

  const informations = [
    { label: 'Facility Name', value: 'Cereals Office' },
    { label: 'Supervising ministry', value: 'Ministry of Agriculture, Water Resources and Fisheries' },
    { label: 'Creative text', value: 'Decree-law No. 62-10 of April 3, 1962' },
    { label: '1st current manager', value: 'Chairman and CEO Mr. Bechir Kthiri' },
    { label: 'Legal status', value: 'Public company' },
    { label: 'Category of establishment', value: 'G' },
    { label: 'Core business', value: 'Marketing of Cereals' },
  ];

  return (
    <div className="container mt-5 mb-5" id='information'>
      <h2 className="display-3 text-center mb-5">About The Cereals Office</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">{officeCereal.officeName}</h4>
              <hr className="my-4 custom-hr" />
              <p className="card-text">{officeCereal.description}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div id="carouselExampleIndicators" className="carousel slide mt-2" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={office} className="d-block w-100 rounded carousel-img" alt="Office" loading="lazy" />
              </div>
              <div className="carousel-item">
                <img src={officee} className="d-block w-100 rounded carousel-img" alt="Office" loading="lazy" />
              </div>
              <div className="carousel-item">
                <img src={officeee} className="d-block w-100 rounded carousel-img" alt="Office" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h2 className="display-5">Information Table</h2>
        <hr className="my-4 custom-hr" />
        <div className="table-responsive">
          <table className="table table-bordered w-100 mx-auto">
            <tbody>
              {informations.map((information, index) => (
                <tr key={index}>
                  <td className="fw-bold">{information.label}</td>
                  <td>{information.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Info;
