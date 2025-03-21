import React from 'react';
import { TenantsPageStyle } from './styles';
import tenantAvatar from '../../../../assets/images/HeroImage.png';
import SelectFieldBaseModelVariant1 from '../../../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2';

const TenantsPage: React.FC = () => {
  return (
    <TenantsPageStyle>
      <h2 className="title">Your Tenants</h2>
      
      <div className="tenants-group">
        <h3 className="group-title">Current and upcoming Tenants</h3>
        <div className="border-container">
          <table className="tenants-table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Property</th>
                <th>Move-in Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="tenant-info">
                    <img src={tenantAvatar} alt="Tenant" />
                    <span className="tenant-name">John Doe</span>
                  </div>
                </td>
                <td>
                  <div className="property-info">
                    <span className="property-name">Sunset Apartments</span>
                    <span className="property-location">San Francisco, CA</span>
                  </div>
                </td>
                <td className="move-in-date">Jan 15, 2023</td>
                <td>Active</td>
              </tr>
              <tr>
                <td>
                  <div className="tenant-info">
                    <img src={tenantAvatar} alt="Tenant" />
                    <span className="tenant-name">John Doe</span>
                  </div>
                </td>
                <td>
                  <div className="property-info">
                    <span className="property-name">Sunset Apartments San Francisco, CA</span>
                  </div>
                </td>
                <td className="move-in-date">Jan 15, 2023</td>
                <td>Active</td>
              </tr>
              <tr>
                <td>
                  <div className="tenant-info">
                    <img src={tenantAvatar} alt="Tenant" />
                    <span className="tenant-name">Jane Smith</span>
                  </div>
                </td>
                <td>
                  <div className="property-info">
                    <span className="property-name">Ocean View Lofts Los Angeles, CA</span>
                  </div>
                </td>
                <td className="move-in-date">Feb 1, 2023</td>
                <td>Active</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="tenants-group">
        <h3 className="group-title">Past Tenants</h3>
        <div className="slider-container">
          <SelectFieldBaseModelVariant1
              options={['All', 'Active', 'Inactive']}
              label="Status"
              placeholder="Select Status"
              value="All"
              onChange={(value) => console.log(value)}
          />
        </div>
      </div>
      
      <div className="tenants-group">
        <div className="border-container">
          <table className="tenants-table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Property</th>
                <th>Move-in date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="tenant-info">
                    <img src={tenantAvatar} alt="Tenant" />
                    <span className="tenant-name">John Price</span>
                  </div>
                </td>
                <td>
                  <div className="property-info">
                    <span className="property-name">Apartment - Flat in the center of Algarve Algarve, Portugal</span>
                  </div>
                </td>
                <td className="move-in-date">05/09/2024</td>
              </tr>
              <tr>
                <td>
                  <div className="tenant-info">
                    <img src={tenantAvatar} alt="Tenant" />
                    <span className="tenant-name">John Price</span>
                  </div>
                </td>
                <td>
                  <div className="property-info">
                    <span className="property-name">Apartment - Flat in the center of Algarve Algarve, Portugal</span>
                  </div>
                </td>
                <td className="move-in-date">05/09/2024</td>
              </tr>
              <tr>
                <td>
                  <div className="tenant-info">
                    <img src={tenantAvatar} alt="Tenant" />
                    <span className="tenant-name">John Price</span>
                  </div>
                </td>
                <td>
                  <div className="property-info">
                    <span className="property-name">Apartment - Flat in the center of Algarve Algarve, Portugal</span>
                  </div>
                </td>
                <td className="move-in-date">05/09/2024</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </TenantsPageStyle>
  );
};

export default TenantsPage;
