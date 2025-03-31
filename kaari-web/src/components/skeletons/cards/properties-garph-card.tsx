import React from 'react';
import { PropertiesGraphCard } from '../../styles/cards/card-base-model-style-properties-graph';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import styled from 'styled-components';

// Styled component for tilted arrows
const TiltedArrow = styled.span`
  display: inline-block;
  transform: rotate(45deg);
  
  &.down {
    transform: rotate(-45deg);
  }
`;

interface PropertyData {
  propertyName: string;
  propertyImage: string;
  trend: 'up' | 'down';
  thisMonth: string;
  lastMonth: string;
  clicks: string;
  requests: string;
  listedOn: string;
  views: string;
}

interface PropertiesGraphCardProps {
  title: string;
  total: string;
  properties: PropertyData[];
}

const PropertiesGraphCardComponent: React.FC<PropertiesGraphCardProps> = ({
  title,
  total,
  properties
}) => {
  return (
    <PropertiesGraphCard>
      <div className="title-container">
        <h2 className="title">{title}</h2>
        <div className="total-views">
          <TiltedArrow><FaArrowUp className="arrow-up-icon" /></TiltedArrow>
          <span className="views-count">{total}</span>
        </div>
      </div>
      
      <table className="properties-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>This Month</th>
            <th>Last Month</th>
            <th>Clicks</th>
            <th>Requests</th>
            <th>Listed on</th>
            <th>Total Views</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property, index) => (
            <tr key={index}>
              <td>
                <div className="property-info">
                  <img src={property.propertyImage} alt={property.propertyName} />
                  <span className="property-name">{property.propertyName}</span>
                </div>
              </td>
              <td>
                <div className="trend-indicator">
                  {property.trend === 'up' ? (
                    <TiltedArrow><FaArrowUp className="arrow-up" /></TiltedArrow>
                  ) : (
                    <TiltedArrow className="down"><FaArrowDown className="arrow-down" /></TiltedArrow>
                  )}
                  
                  <span className="metric-value">{property.thisMonth}</span>
                </div>
              </td>
              <td>
                <span className="metric-value">{property.lastMonth}</span>
              </td>
              <td>
                <span className="metric-value">{property.clicks}</span>
              </td>
              <td>
                <span className="metric-value">{property.requests}</span>
              </td>
              <td>
                <span className="date-value">{property.listedOn}</span>
              </td>
              <td>
                <span className="metric-value">{property.views}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PropertiesGraphCard>
  );
};

export default PropertiesGraphCardComponent;
