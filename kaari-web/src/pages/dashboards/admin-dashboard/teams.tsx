import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import {
  DashboardCard,
  CardTitle,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  Button,
  StatusBadge,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalFooter,
  CancelButton,
  ActionButton,
  Select,
} from './styles';

import { TeamServerActions } from '../../../backend/server-actions/TeamServerActions';
import { Team } from '../../../backend/entities';

const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Team form state
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamLead, setTeamLead] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    loadTeams();
  }, []);
  
  const loadTeams = async () => {
    try {
      setLoading(true);
      const allTeams = await TeamServerActions.getAllTeams();
      setTeams(allTeams);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setEditingTeam(null);
    setTeamName('');
    setTeamLead('');
    setTeamMembers([]);
    setMemberInput('');
    setSpecialization('');
    setAvailableDays([]);
    setIsActive(true);
  };
  
  const openCreateTeamModal = () => {
    resetForm();
    setShowTeamModal(true);
  };
  
  const openEditTeamModal = (team: Team) => {
    setEditingTeam(team);
    setTeamName(team.name);
    setTeamLead(team.lead);
    setTeamMembers(team.members);
    setSpecialization(team.specialization || '');
    setAvailableDays(team.availableDays || []);
    setIsActive(team.active);
    setShowTeamModal(true);
  };
  
  const handleAddMember = () => {
    if (memberInput.trim() && !teamMembers.includes(memberInput.trim())) {
      setTeamMembers([...teamMembers, memberInput.trim()]);
      setMemberInput('');
    }
  };
  
  const handleRemoveMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };
  
  const handleToggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter(d => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };
  
  const handleSaveTeam = async () => {
    if (!teamName || !teamLead || teamMembers.length === 0) {
      // Validation failed
      alert('Please fill all required fields (name, lead, and at least one member)');
      return;
    }
    
    try {
      const teamData = {
        name: teamName,
        lead: teamLead,
        members: teamMembers,
        specialization,
        availableDays,
        active: isActive,
      };
      
      if (editingTeam) {
        // Update existing team
        await TeamServerActions.updateTeam(editingTeam.id, teamData);
      } else {
        // Create new team
        await TeamServerActions.createTeam(teamData);
      }
      
      // Refresh teams data
      await loadTeams();
      setShowTeamModal(false);
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Error saving team. Please try again.');
    }
  };
  
  const handleDeleteTeam = async (teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await TeamServerActions.deleteTeam(teamId);
        
        // Refresh teams data
        await loadTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Error deleting team. Please try again.');
      }
    }
  };
  
  const toggleTeamActive = async (team: Team) => {
    try {
      await TeamServerActions.updateTeam(team.id, {
        active: !team.active,
      });
      
      // Refresh teams data
      await loadTeams();
    } catch (error) {
      console.error('Error updating team status:', error);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredTeams = searchQuery.trim() 
    ? teams.filter(team => 
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : teams;
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div>
      <DashboardCard>
        <CardTitle>Teams Management</CardTitle>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <FormGroup style={{ width: '300px', margin: 0 }}>
              <div style={{ position: 'relative' }}>
                <Input 
                  type="text" 
                  placeholder="Search teams..." 
                  value={searchQuery}
                  onChange={handleSearch}
                  style={{ paddingLeft: '35px' }}
                />
                <FaSearch style={{ position: 'absolute', left: '10px', top: '12px', color: '#aaa' }} />
              </div>
            </FormGroup>
            
            <Button onClick={openCreateTeamModal}>
              <FaPlus style={{ marginRight: '5px' }} /> Create Team
            </Button>
          </div>
          
          {loading ? (
            <p>Loading teams...</p>
          ) : filteredTeams.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Specialization</TableHeader>
                  <TableHeader>Members</TableHeader>
                  <TableHeader>Created</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {filteredTeams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>{team.name}</TableCell>
                    <TableCell>{team.specialization || 'N/A'}</TableCell>
                    <TableCell>{team.members.length} members</TableCell>
                    <TableCell>{formatDate(team.createdAt)}</TableCell>
                    <TableCell>
                      <StatusBadge status={team.active ? 'completed' : 'cancelled'}>
                        {team.active ? 'Active' : 'Inactive'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <Button onClick={() => openEditTeamModal(team)} style={{ padding: '4px 8px' }}>
                          <FaEdit />
                        </Button>
                        <Button 
                          onClick={() => toggleTeamActive(team)} 
                          style={{ 
                            padding: '4px 8px', 
                            backgroundColor: team.active ? '#6c757d' : '#28a745' 
                          }}
                        >
                          {team.active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button 
                          onClick={() => handleDeleteTeam(team.id)} 
                          style={{ padding: '4px 8px', backgroundColor: '#dc3545' }}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No teams found.</p>
          )}
        </CardContent>
      </DashboardCard>
      
      {/* Team Modal */}
      {showTeamModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{editingTeam ? 'Edit Team' : 'Create Team'}</ModalTitle>
              <CloseButton onClick={() => setShowTeamModal(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <Label>Team Name*</Label>
              <Input 
                type="text" 
                value={teamName} 
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Team Lead ID*</Label>
              <Input 
                type="text" 
                value={teamLead} 
                onChange={(e) => setTeamLead(e.target.value)}
                placeholder="Enter team lead user ID"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Team Members*</Label>
              <div style={{ display: 'flex', marginBottom: '10px' }}>
                <Input 
                  type="text" 
                  value={memberInput} 
                  onChange={(e) => setMemberInput(e.target.value)}
                  placeholder="Enter member user ID"
                  style={{ flex: 1, marginRight: '10px' }}
                />
                <Button onClick={handleAddMember}>
                  Add
                </Button>
              </div>
              
              {teamMembers.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <Label>Team members ({teamMembers.length}):</Label>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {teamMembers.map((member, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{ marginRight: '10px', flex: 1 }}>
                          {member}
                        </span>
                        <Button 
                          onClick={() => handleRemoveMember(index)}
                          style={{ backgroundColor: '#dc3545', padding: '4px 8px' }}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label>Specialization</Label>
              <Input 
                type="text" 
                value={specialization} 
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Enter team specialization"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Available Days</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <div key={day} style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      id={`day-${day}`} 
                      checked={availableDays.includes(day)}
                      onChange={() => handleToggleDay(day)}
                      style={{ marginRight: '5px' }}
                    />
                    <label htmlFor={`day-${day}`}>{day}</label>
                  </div>
                ))}
              </div>
            </FormGroup>
            
            <FormGroup>
              <Label>Status</Label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  id="active-status" 
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                  style={{ marginRight: '5px' }}
                />
                <label htmlFor="active-status">Active</label>
              </div>
            </FormGroup>
            
            <ModalFooter>
              <CancelButton onClick={() => setShowTeamModal(false)}>Cancel</CancelButton>
              <ActionButton 
                onClick={handleSaveTeam}
                disabled={!teamName || !teamLead || teamMembers.length === 0}
              >
                {editingTeam ? 'Update Team' : 'Create Team'}
              </ActionButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default TeamsPage; 