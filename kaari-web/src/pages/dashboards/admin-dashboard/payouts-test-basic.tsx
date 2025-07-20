import React from 'react';

const PayoutsTestBasic = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Payouts Test Page</h1>
      <p>This is a basic test page with no server actions.</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Test Instructions</h2>
        <ol>
          <li>To test refund payouts: Go to the Refund Requests page and approve a request</li>
          <li>To test cancellation payouts: Go to the Cancellation Requests page and approve a request</li>
          <li>To test rent payouts: Check bookings with move-in dates more than 24 hours ago</li>
        </ol>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Expected Behavior</h2>
        <ul>
          <li>Approving a refund should create a payout for the tenant</li>
          <li>Approving a cancellation should create a payout for the advertiser</li>
          <li>Bookings with closed safety windows should create rent payouts</li>
        </ul>
      </div>
    </div>
  );
};

export default PayoutsTestBasic; 