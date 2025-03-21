import { PaymentsPageStyle } from "./styles";
import SelectFieldBaseModelVariant1 from '../../../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2';


const PaymentsPage = () => {
  return (
    
      <PaymentsPageStyle>
        <h1 className="title">Payments</h1>
        
        <div className="payments-stats">
          <div className="payment-stat border-container">
            <div className="payment-stat-title">Total collected</div>
            <div className="payment-stat-value">2500$</div>
          </div>
          <div className="payment-stat border-container">
            <div className="payment-stat-title">Number of payments</div>
            <div className="payment-number">3</div>
          </div>
          <div className="payment-stat border-container">
            <div className="payment-stat-title">Pending amount</div>
            <div className="payment-pending">2500$</div>
          </div>
        </div>
        
        <div className="payments-content">
          <h2 className="payments-title">Payments</h2>
          <div className="slider-container">
            <SelectFieldBaseModelVariant1
              options={['By date', 'By tenant', 'By property']}
              placeholder="Select Status"
              value="All"
              onChange={(value) => console.log(value)}
            />
          </div>
          <div className="border-container">
          <table className="tenants-table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Status</th>
                <th>Property</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Payment ID</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="tenant-info">
                    <span className="tenant-name">John Smith</span>
                  </div>
                </td>
                <td>Completed</td>
                <td>
                  <div className="property-info">
                    <span className="property-name">Sunset Apartments New York, NY</span>
                  </div>
                </td>
                <td>$1,250.00</td>
                <td className="move-in-date">May 15, 2023</td>
                <td>PAY-001</td>
              </tr>
              <tr>
                <td>
                  <div className="tenant-info">
                    <span className="tenant-name">Sarah Johnson</span>
                  </div>
                </td>
                <td>Completed</td>
                <td>
                  <div className="property-info">
                    <span className="property-name">Harbor View Boston, MA </span>
                  </div>
                </td>
                <td>$1,450.00</td>
                <td className="move-in-date">May 12, 2023</td>
                <td>PAY-002</td>
              </tr>
              <tr>
                <td>
                  <div className="tenant-info">
                    <span className="tenant-name">Michael Brown</span>
                  </div>
                </td>
                <td>Pending</td>
                <td>
                  <div className="property-info">
                    <span className="property-name">Mountain Retreat Denver, CO</span>
                  </div>
                </td>
                <td>$950.00</td>
                <td className="move-in-date">May 10, 2023</td>
                <td>PAY-003</td>
              </tr>
              <tr>
                <td>
                  <div className="tenant-info">
                    <span className="tenant-name">Emily Wilson</span>
                  </div>
                </td>
                <td>Completed</td>
                <td>
                  <div className="property-info">
                    <span className="property-name">Lakeside Condos Chicago, IL</span>
                  </div>
                </td>
                <td>$1,350.00</td>
                <td className="move-in-date">May 8, 2023</td>
                <td>PAY-004</td>
              </tr>
              <tr>
                <td>
                  <div className="tenant-info">
                    <span className="tenant-name">David Thompson</span>
                  </div>
                </td>
                <td>Pending</td>
                <td>
                  <div className="property-info">
                    <span className="property-name">Urban Lofts Seattle, WA</span>
                  </div>
                </td>
                <td>$1,150.00</td>
                <td className="move-in-date">May 5, 2023</td>
                <td>PAY-005</td>
              </tr>
              <tr>
                <td>
                  <div className="tenant-info">
                    <span className="tenant-name">Jessica Martinez</span>
                  </div>
                </td>
                <td>Completed</td>
                <td>
                  <div className="property-info">
                    <span className="property-name">Sunshine Villas Miami, FL</span>
                  </div>
                </td>
                <td>$1,550.00</td>
                <td className="move-in-date">May 3, 2023</td>
                <td>PAY-006</td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </PaymentsPageStyle>
  );
};

export default PaymentsPage;
