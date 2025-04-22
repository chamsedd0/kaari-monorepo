'use client';

import React, { useState } from 'react';
import { PhotoshootBookingServerActions } from '../../../backend/server-actions/PhotoshootBookingServerActions';
import { TeamServerActions } from '../../../backend/server-actions/TeamServerActions';
import * as PropertyServerActions from '../../../backend/server-actions/PropertyServerActions';
import { Button, Card, CardContent, CardHeader, Typography, Box, Alert, AlertTitle } from '@mui/material';
import styled from 'styled-components';

// Styled components
const AdminControlsContainer = styled.div`
  margin: 2rem;
`;

const ActionCard = styled(Card)`
  margin-bottom: 1.5rem;
`;

const ActionButton = styled(Button)`
  margin-right: 1rem;
  margin-top: 1rem;
`;

/**
 * AdminControls component for initializing sample data and other admin actions
 */
export default function AdminControls() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize all sample data
  const handleInitializeAllSampleData = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      // Initialize all types of sample data
      const bookingIds = await PhotoshootBookingServerActions.initializeSampleData();
      const teamIds = await TeamServerActions.initializeSampleData();
      const propertyIds = await PropertyServerActions.initializeSampleData();

      setSuccess(`Successfully initialized sample data: 
        ${bookingIds.length} bookings, ${teamIds.length} teams, and ${propertyIds.length} properties created.`);
    } catch (err) {
      console.error('Error initializing sample data:', err);
      setError(`Failed to initialize sample data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Initialize just photoshoot booking sample data
  const handleInitializeBookingSampleData = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const bookingIds = await PhotoshootBookingServerActions.initializeSampleData();
      setSuccess(`Successfully initialized ${bookingIds.length} sample photoshoot bookings.`);
    } catch (err) {
      console.error('Error initializing booking sample data:', err);
      setError(`Failed to initialize booking sample data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Initialize just team sample data
  const handleInitializeTeamSampleData = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const teamIds = await TeamServerActions.initializeSampleData();
      setSuccess(`Successfully initialized ${teamIds.length} sample teams.`);
    } catch (err) {
      console.error('Error initializing team sample data:', err);
      setError(`Failed to initialize team sample data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Initialize just property sample data
  const handleInitializePropertySampleData = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const propertyIds = await PropertyServerActions.initializeSampleData();
      setSuccess(`Successfully initialized ${propertyIds.length} sample properties.`);
    } catch (err) {
      console.error('Error initializing property sample data:', err);
      setError(`Failed to initialize property sample data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Remove all sample photoshoot booking data
  const handleRemoveBookingSampleData = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const result = await PhotoshootBookingServerActions.removeSampleData();
      setSuccess(`Successfully removed ${result.count} sample photoshoot bookings.`);
    } catch (err) {
      console.error('Error removing booking sample data:', err);
      setError(`Failed to remove booking sample data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Remove all sample team data
  const handleRemoveTeamSampleData = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const result = await TeamServerActions.removeSampleData();
      setSuccess(`Successfully removed ${result.count} sample teams.`);
    } catch (err) {
      console.error('Error removing team sample data:', err);
      setError(`Failed to remove team sample data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Remove all sample property data
  const handleRemovePropertySampleData = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const result = await PropertyServerActions.removeSampleData();
      setSuccess(`Successfully removed ${result.count} sample properties.`);
    } catch (err) {
      console.error('Error removing property sample data:', err);
      setError(`Failed to remove property sample data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Remove all sample data
  const handleRemoveAllSampleData = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const bookingResult = await PhotoshootBookingServerActions.removeSampleData();
      const teamResult = await TeamServerActions.removeSampleData();
      const propertyResult = await PropertyServerActions.removeSampleData();
      
      setSuccess(`Successfully removed ${bookingResult.count} sample bookings, ${teamResult.count} sample teams, and ${propertyResult.count} sample properties.`);
    } catch (err) {
      console.error('Error removing all sample data:', err);
      setError(`Failed to remove all sample data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminControlsContainer>
      <Typography variant="h4" gutterBottom>
        Admin Controls
      </Typography>

      {success && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          <AlertTitle>Success</AlertTitle>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <ActionCard>
        <CardHeader title="Sample Data" />
        <CardContent>
          <Typography variant="body1" gutterBottom>
            Initialize sample data for development and testing purposes.
          </Typography>
          <Box>
            <ActionButton 
              variant="contained" 
              color="primary" 
              onClick={handleInitializeAllSampleData}
              disabled={loading}
            >
              Initialize All Sample Data
            </ActionButton>
            <ActionButton 
              variant="outlined"  
              onClick={handleInitializeBookingSampleData}
              disabled={loading}
            >
              Initialize Bookings Only
            </ActionButton>
            <ActionButton 
              variant="outlined" 
              onClick={handleInitializeTeamSampleData}
              disabled={loading}
            >
              Initialize Teams Only
            </ActionButton>
            <ActionButton 
              variant="outlined" 
              onClick={handleInitializePropertySampleData}
              disabled={loading}
            >
              Initialize Properties Only
            </ActionButton>
          </Box>
          
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
            <Typography variant="body1" gutterBottom color="error">
              Remove sample data from the database.
            </Typography>
            <ActionButton 
              variant="contained" 
              color="error"
              onClick={handleRemoveAllSampleData}
              disabled={loading}
            >
              Remove All Sample Data
            </ActionButton>
            <ActionButton 
              variant="outlined" 
              color="error"
              onClick={handleRemoveBookingSampleData}
              disabled={loading}
            >
              Remove Sample Bookings
            </ActionButton>
            <ActionButton 
              variant="outlined" 
              color="error"
              onClick={handleRemoveTeamSampleData}
              disabled={loading}
            >
              Remove Sample Teams
            </ActionButton>
            <ActionButton 
              variant="outlined" 
              color="error"
              onClick={handleRemovePropertySampleData}
              disabled={loading}
            >
              Remove Sample Properties
            </ActionButton>
          </Box>
        </CardContent>
      </ActionCard>

      {/* Add more admin control cards as needed */}
    </AdminControlsContainer>
  );
} 