import React from 'react';
import { ReservationsStyle } from './styles';
import SelectFieldBaseModelVariant2 from '../../../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2';
import profilePlaceholder from '../../../../assets/images/kaariLogoPurplePic.png';
import propertyPlaceholder from '../../../../assets/images/BigCityPic0.png';
import checkIcon from '../../../../components/skeletons/icons/Check-Icon.svg';
import crossIcon from '../../../../components/skeletons/icons/Cross-Icon.svg';

const ReservationsPage: React.FC = () => {
    return (
        <ReservationsStyle>
            <h1 className="section-title">Reservation requests</h1>
            
            <div className="pending-requests">
                    <div className="field-container">
                        <SelectFieldBaseModelVariant2
                          placeholder='Select a status'   
                            options={['All', 'Pending', 'Approved', 'Rejected']}
                        />
                        <SelectFieldBaseModelVariant2
                              placeholder='Select a status'   
                                options={['All', 'Pending', 'Approved', 'Rejected']}
                        />
                        
                    </div>
            </div>
            
            <div className="border-container">
                <table className="reservations-table">
                    <thead>
                        <tr>
                            <th>Applicant</th>
                            <th>Property</th>
                            <th>Applied</th>
                            <th>Occupants</th>
                            <th>Move-in Date</th>
                            <th>24 Hours</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="applicant-info">
                                    <img src={profilePlaceholder} alt="Applicant" />
                                    <span className="applicant-name">John Doe</span>
                                </div>
                            </td>
                            <td>
                                <div className="property-info">
                                    <img src={propertyPlaceholder} alt="Property" />
                                    <span className="property-name">Luxury Apartment</span>
                                </div>
                            </td>
                            <td className="applied">Aug 10, 2023</td>
                            <td className="occupants">2</td>
                            <td className="move-in-date">Aug 15, 2023</td>
                            <td className="hours-remaining">24</td>
                            <td>
                                <div className="action-buttons">
                                    <div className="approve-button">
                                        <img src={checkIcon} alt="Check" />
                                    </div>
                                    <div className="reject-button">
                                        <img src={crossIcon} alt="Cross" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="applicant-info">
                                    <img src={profilePlaceholder} alt="Applicant" />
                                    <span className="applicant-name">Jane Smith</span>
                                </div>
                            </td>
                            <td>
                                <div className="property-info">
                                    <img src={propertyPlaceholder} alt="Property" />
                                    <span className="property-name">Downtown Loft</span>
                                </div>
                            </td>
                            <td className="applied">Aug 11, 2023</td>
                            <td className="occupants">1</td>
                            <td className="move-in-date">Aug 20, 2023</td>
                            <td className="hours-remaining">18</td>
                            <td>
                                <div className="action-buttons">
                                    <div className="approve-button">
                                        <img src={checkIcon} alt="Check" />
                                    </div>
                                    <div className="reject-button">
                                        <img src={crossIcon} alt="Cross" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="applicant-info">
                                    <img src={profilePlaceholder} alt="Applicant" />
                                    <span className="applicant-name">Michael Johnson</span>
                                </div>
                            </td>
                            <td>
                                <div className="property-info">
                                    <img src={propertyPlaceholder} alt="Property" />
                                    <span className="property-name">Seaside Condo</span>
                                </div>
                            </td>
                            <td className="applied">Aug 12, 2023</td>
                            <td className="occupants">3</td>
                            <td className="move-in-date">Aug 25, 2023</td>
                            <td className="hours-remaining">12</td>
                            <td>
                                <div className="action-buttons">
                                    <div className="approve-button">
                                        <img src={checkIcon} alt="Check" />
                                    </div>
                                    <div className="reject-button">
                                        <img src={crossIcon} alt="Cross" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="applicant-info">
                                    <img src={profilePlaceholder} alt="Applicant" />
                                    <span className="applicant-name">Emily Wilson</span>
                                </div>
                            </td>
                            <td>
                                <div className="property-info">
                                    <img src={propertyPlaceholder} alt="Property" />
                                    <span className="property-name">Garden Townhouse</span>
                                </div>
                            </td>
                            <td className="applied">Aug 13, 2023</td>
                            <td className="occupants">2</td>
                            <td className="move-in-date">Aug 30, 2023</td>
                            <td className="hours-remaining">8</td>
                            <td>
                                <div className="action-buttons">
                                    <div className="approve-button">
                                        <img src={checkIcon} alt="Check" />
                                    </div>
                                    <div className="reject-button">
                                        <img src={crossIcon} alt="Cross" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="applicant-info">
                                    <img src={profilePlaceholder} alt="Applicant" />
                                    <span className="applicant-name">Robert Brown</span>
                                </div>
                            </td>
                            <td>
                                <div className="property-info">
                                    <img src={propertyPlaceholder} alt="Property" />
                                    <span className="property-name">Modern Studio</span>
                                </div>
                            </td>
                            <td className="applied">Aug 14, 2023</td>
                            <td className="occupants">1</td>
                            <td className="move-in-date">Sep 1, 2023</td>
                            <td className="hours-remaining">4</td>
                            <td>
                                <div className="action-buttons">
                                    <div className="approve-button">
                                        <img src={checkIcon} alt="Check" />
                                    </div>
                                    <div className="reject-button">
                                        <img src={crossIcon} alt="Cross" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </ReservationsStyle>
    );
};

export default ReservationsPage;
