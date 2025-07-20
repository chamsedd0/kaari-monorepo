'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Divider, Alert, CircularProgress, TextField, List, ListItem, ListItemText, Chip, Tab, Tabs } from '@mui/material';
import PayoutsService from '../../../services/PayoutsService';

export default function PayoutsTestScript() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState('');
  const [referralId, setReferralId] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [properties, setProperties] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [advertiserId, setAdvertiserId] = useState('');

  // Load properties, reservations, and user info on component mount
  useEffect(() => {
    fetchProperties();
    fetchReservations();
    fetchCurrentUser();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchCurrentUser = async () => {
    try {
      const { getAuth } = await import('firebase/auth');
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../../../backend/firebase/config');
      
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        setCurrentUser({ error: 'Not authenticated' });
        return;
      }
      
      // Get user role from Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: userData.role || 'unknown',
          hasPaymentMethod: !!userData.paymentMethod
        });
      } else {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'unknown',
          error: 'User document not found in Firestore'
        });
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
      setCurrentUser({ error: String(err) });
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchProperties = async () => {
    setLoadingProperties(true);
    try {
      // Import Firestore functions
      const { collection, getDocs, query, limit } = await import('firebase/firestore');
      const { db } = await import('../../../backend/firebase/config');
      
      // Get up to 10 properties
      const propertiesRef = collection(db, 'properties');
      const q = query(propertiesRef, limit(10));
      const querySnapshot = await getDocs(q);
      
      const propertiesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProperties(propertiesList);
      console.log('Fetched properties:', propertiesList);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(`Error fetching properties: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoadingProperties(false);
    }
  };

  const fetchReservations = async () => {
    setLoadingReservations(true);
    try {
      // Import Firestore functions
      const { collection, getDocs, query, where, orderBy, limit } = await import('firebase/firestore');
      const { db } = await import('../../../backend/firebase/config');
      
      // Get reservations with movedIn status
      const reservationsRef = collection(db, 'requests');
      const q = query(
        reservationsRef,
        where('status', '==', 'movedIn'),
        orderBy('updatedAt', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      
      const reservationsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setReservations(reservationsList);
      console.log('Fetched reservations:', reservationsList);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError(`Error fetching reservations: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoadingReservations(false);
    }
  };

  const handleTestCollectionsExist = async () => {
    setLoading(true);
    setError(null);
    try {
      await PayoutsService.ensureCollectionsExist();
      setResult({ message: 'Collections check completed. Check console for details.' });
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestRentPayout = async () => {
    if (!reservationId) {
      setError('Please enter a reservation ID');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await PayoutsService.requestRentPayout(reservationId);
      setResult({ success: result, message: result ? 'Rent payout request created successfully' : 'Failed to create rent payout request' });
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestReferralPayout = async () => {
    if (!referralId) {
      setError('Please enter a referral ID');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await PayoutsService.requestReferralPayout(referralId);
      setResult({ success: result, message: result ? 'Referral payout request created successfully' : 'Failed to create referral payout request' });
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectDatabaseWrite = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current user
      const auth = await import('firebase/auth').then(module => module.getAuth());
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Import Firestore functions
      const { addDoc, collection, Timestamp } = await import('firebase/firestore');
      const { db } = await import('../../../backend/firebase/config');
      
      // Create a test payout request directly
      const payoutRequestRef = await addDoc(collection(db, 'payoutRequests'), {
        userId: user.uid,
        userType: 'advertiser',
        amount: 1000,
        currency: 'MAD',
        sourceType: 'test',
        sourceId: 'test-' + Date.now(),
        status: 'pending',
        reason: 'Test Payout',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      setResult({ 
        message: 'Direct database write successful', 
        payoutRequestId: payoutRequestRef.id 
      });
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestReservation = async () => {
    if (!propertyId) {
      setError('Please enter a property ID');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Get current user
      const auth = await import('firebase/auth').then(module => module.getAuth());
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Import Firestore functions
      const { addDoc, collection, Timestamp, getDoc, doc } = await import('firebase/firestore');
      const { db } = await import('../../../backend/firebase/config');
      
      // Get property to find advertiserId
      const propertyRef = doc(db, 'properties', propertyId);
      const propertyDoc = await getDoc(propertyRef);
      
      if (!propertyDoc.exists()) {
        throw new Error(`Property not found: ${propertyId}`);
      }
      
      const propertyData = propertyDoc.data();
      
      // Create a test reservation
      const reservationRef = await addDoc(collection(db, 'requests'), {
        propertyId: propertyId,
        advertiserId: propertyData.advertiserId,
        clientId: user.uid,
        status: 'movedIn',
        totalPrice: 5000,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      setResult({ 
        message: 'Test reservation created successfully', 
        reservationId: reservationRef.id,
        advertiserId: propertyData.advertiserId
      });
      
      // Auto-fill the reservation ID field
      setReservationId(reservationRef.id);
      
      // Refresh reservations list
      fetchReservations();
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePaymentMethod = async () => {
    if (!advertiserId) {
      setError('Please enter an advertiser ID');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Import Firestore functions
      const { addDoc, collection, Timestamp, getDoc, doc, query, where, getDocs } = await import('firebase/firestore');
      const { db } = await import('../../../backend/firebase/config');
      
      // Check if the advertiser exists
      const advertiserRef = doc(db, 'users', advertiserId);
      const advertiserDoc = await getDoc(advertiserRef);
      
      if (!advertiserDoc.exists()) {
        throw new Error(`Advertiser not found: ${advertiserId}`);
      }
      
      // Check if a payment method already exists
      const payoutMethodsRef = collection(db, 'payoutMethods');
      const q = query(payoutMethodsRef, where('userId', '==', advertiserId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const existingMethod = querySnapshot.docs[0].data();
        setResult({ 
          message: 'Payment method already exists', 
          paymentMethodId: querySnapshot.docs[0].id,
          details: {
            bankName: existingMethod.bankName,
            type: existingMethod.type,
            accountLast4: existingMethod.accountNumber ? existingMethod.accountNumber.slice(-4) : '****'
          }
        });
        return;
      }
      
      // Create a test payment method
      const paymentMethodRef = await addDoc(collection(db, 'payoutMethods'), {
        userId: advertiserId,
        bankName: 'Test Bank',
        accountNumber: 'TEST-ACCOUNT-' + Date.now(),
        type: 'RIB',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isVerified: true
      });
      
      setResult({ 
        message: 'Payment method created successfully', 
        paymentMethodId: paymentMethodRef.id,
        advertiserId
      });
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAdvertiserFromReservation = async () => {
    if (!reservationId) {
      setError('Please enter a reservation ID');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Import Firestore functions
      const { getDoc, doc, collection, query, where, getDocs } = await import('firebase/firestore');
      const { db } = await import('../../../backend/firebase/config');
      
      // Get the reservation
      const reservationRef = doc(db, 'requests', reservationId);
      const reservationDoc = await getDoc(reservationRef);
      
      if (!reservationDoc.exists()) {
        throw new Error(`Reservation not found: ${reservationId}`);
      }
      
      const reservation = reservationDoc.data();
      let advertiserId = reservation.advertiserId;
      
      // If advertiserId is undefined, try to get it from the property
      if (!advertiserId && reservation.propertyId) {
        // First try to get advertiserId directly from property
        const propertyRef = doc(db, 'properties', reservation.propertyId);
        const propertyDoc = await getDoc(propertyRef);
        
        if (propertyDoc.exists()) {
          const propertyData = propertyDoc.data();
          advertiserId = propertyData.advertiserId;
        }
        
        // If still no advertiserId, search through all advertisers
        if (!advertiserId) {
          // Query all users with role 'advertiser'
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('role', '==', 'advertiser'));
          const querySnapshot = await getDocs(q);
          
          // Loop through advertisers to find one with this property
          for (const advertiserDoc of querySnapshot.docs) {
            const advertiserData = advertiserDoc.data();
            
            // Check if this advertiser has the property in their properties array
            if (advertiserData.properties && 
                Array.isArray(advertiserData.properties) && 
                advertiserData.properties.includes(reservation.propertyId)) {
              advertiserId = advertiserDoc.id;
              break;
            }
          }
        }
      }
      
      if (advertiserId) {
        // Set the found advertiser ID
        setAdvertiserId(advertiserId);
        
        // Check if the advertiser has a payment method
        const payoutMethodsRef = collection(db, 'payoutMethods');
        const q = query(payoutMethodsRef, where('userId', '==', advertiserId));
        const querySnapshot = await getDocs(q);
        
        const hasPaymentMethod = !querySnapshot.empty;
        
        setResult({ 
          message: 'Found advertiser for reservation', 
          advertiserId,
          propertyId: reservation.propertyId,
          hasPaymentMethod,
          paymentMethodId: hasPaymentMethod ? querySnapshot.docs[0].id : null
        });
      } else {
        setError(`Could not find advertiser for reservation: ${reservationId}`);
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Payouts System Test Script
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          Current User Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {loadingUser ? (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress size={24} />
          </Box>
        ) : currentUser ? (
          <Box>
            {currentUser.error ? (
              <Alert severity="error">{currentUser.error}</Alert>
            ) : (
              <>
                <Typography variant="body1">
                  <strong>User ID:</strong> {currentUser.uid}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {currentUser.email || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {currentUser.displayName || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Role:</strong> {' '}
                  <Chip 
                    color={currentUser.role === 'admin' ? 'success' : 'primary'} 
                    label={currentUser.role} 
                    size="small" 
                  />
                </Typography>
                <Typography variant="body1">
                  <strong>Payment Method:</strong> {' '}
                  {currentUser.hasPaymentMethod ? (
                    <Chip color="success" label="Available" size="small" />
                  ) : (
                    <Chip color="error" label="Not Set" size="small" />
                  )}
                </Typography>
                {currentUser.role === 'admin' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    As an admin user, you can create payout requests on behalf of advertisers.
                  </Alert>
                )}
              </>
            )}
          </Box>
        ) : (
          <Alert severity="warning">Unable to load user information</Alert>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            {typeof result === 'object' ? JSON.stringify(result, null, 2) : result}
          </pre>
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Collections Exist
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleTestCollectionsExist}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Test Collections Exist'}
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            This will check if the necessary collections exist and create them if needed
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Properties" />
          <Tab label="Reservations" />
        </Tabs>
        
        {tabValue === 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Available Properties
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {loadingProperties ? (
              <Box display="flex" justifyContent="center" my={3}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  onClick={fetchProperties}
                  disabled={loading}
                  sx={{ mb: 2 }}
                  fullWidth
                >
                  Refresh Properties
                </Button>
                
                {properties.length > 0 ? (
                  <List>
                    {properties.map((property) => (
                      <ListItem 
                        key={property.id} 
                        divider 
                        button 
                        onClick={() => setPropertyId(property.id)}
                        selected={propertyId === property.id}
                      >
                        <ListItemText 
                          primary={property.title || 'Unnamed Property'} 
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                ID: {property.id}
                              </Typography>
                              <br />
                              {property.advertiserId && (
                                <Chip 
                                  label={`Advertiser: ${property.advertiserId.substring(0, 8)}...`} 
                                  size="small" 
                                  sx={{ mr: 1, mt: 1 }} 
                                />
                              )}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">No properties found</Typography>
                )}
              </>
            )}
          </>
        )}
        
        {tabValue === 1 && (
          <>
            <Typography variant="h6" gutterBottom>
              Existing Reservations (Moved In)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {loadingReservations ? (
              <Box display="flex" justifyContent="center" my={3}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  onClick={fetchReservations}
                  disabled={loading}
                  sx={{ mb: 2 }}
                  fullWidth
                >
                  Refresh Reservations
                </Button>
                
                {reservations.length > 0 ? (
                  <List>
                    {reservations.map((reservation) => (
                      <ListItem 
                        key={reservation.id} 
                        divider 
                        button 
                        onClick={() => setReservationId(reservation.id)}
                        selected={reservationId === reservation.id}
                      >
                        <ListItemText 
                          primary={`Reservation: ${reservation.fullName || 'Unknown'}`} 
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                ID: {reservation.id}
                              </Typography>
                              <br />
                              <Chip 
                                label={`Property: ${reservation.propertyId?.substring(0, 8)}...`} 
                                size="small" 
                                sx={{ mr: 1, mt: 1 }} 
                              />
                              {reservation.advertiserId && (
                                <Chip 
                                  label={`Advertiser: ${reservation.advertiserId.substring(0, 8)}...`} 
                                  size="small" 
                                  sx={{ mr: 1, mt: 1 }} 
                                />
                              )}
                              <Chip 
                                label={`Amount: ${reservation.totalPrice || 0} MAD`} 
                                size="small" 
                                color="primary"
                                sx={{ mt: 1 }} 
                              />
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">No moved-in reservations found</Typography>
                )}
              </>
            )}
          </>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create Test Reservation
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Property ID"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateTestReservation}
            disabled={loading || !propertyId}
            sx={{ mt: 1 }}
            fullWidth
          >
            Create Test Reservation
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            This will create a test reservation with movedIn status for the given property
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Find Advertiser & Create Payment Method
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Reservation ID"
            value={reservationId}
            onChange={(e) => setReservationId(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleGetAdvertiserFromReservation}
            disabled={loading || !reservationId}
            sx={{ mt: 1 }}
            fullWidth
          >
            Find Advertiser from Reservation
          </Button>
          
          <Divider sx={{ my: 3 }} />
          
          <TextField
            label="Advertiser ID"
            value={advertiserId}
            onChange={(e) => setAdvertiserId(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleCreatePaymentMethod}
            disabled={loading || !advertiserId}
            sx={{ mt: 1 }}
            fullWidth
          >
            Create Payment Method for Advertiser
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            This will create a test payment method in the payoutMethods collection for the specified advertiser
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Rent Payout
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Reservation ID"
            value={reservationId}
            onChange={(e) => setReservationId(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleTestRentPayout}
            disabled={loading || !reservationId}
            sx={{ mt: 1 }}
            fullWidth
          >
            Test Rent Payout
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Referral Payout
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Referral ID"
            value={referralId}
            onChange={(e) => setReferralId(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleTestReferralPayout}
            disabled={loading || !referralId}
            sx={{ mt: 1 }}
            fullWidth
          >
            Test Referral Payout
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Direct Database Write Test
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            color="warning" 
            onClick={handleDirectDatabaseWrite}
            disabled={loading}
            fullWidth
          >
            Test Direct Database Write
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            This will attempt to write directly to the payoutRequests collection
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
} 