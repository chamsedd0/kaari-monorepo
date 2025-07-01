'use server';

import { 
  collection, 
  addDoc, 
  updateDoc,
  getDoc,
  getDocs, 
  doc,
  query, 
  where, 
  orderBy,
  Timestamp,
  serverTimestamp,
  deleteDoc,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Team } from '../entities';

// Collection reference
const COLLECTION_NAME = 'teams';
const teamsCollection = collection(db, COLLECTION_NAME);

// Firestore interface for Team
interface FirestoreTeam extends Omit<Team, 'createdAt' | 'updatedAt'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Convert to Firestore format
const toFirestoreTeam = (team: Team): Omit<FirestoreTeam, 'id'> => {
  const { id, ...rest } = team;
  
  return {
    ...rest,
    createdAt: Timestamp.fromDate(new Date(team.createdAt)),
    updatedAt: Timestamp.fromDate(new Date(team.updatedAt)),
  };
};

// Convert from Firestore format
const fromFirestoreTeam = (id: string, data: DocumentData): Team => {
  // Ensure all required date fields exist before converting
  if (!data.createdAt || !data.updatedAt) {
    
    // Create default dates for missing fields to prevent errors
    const now = new Date();
    return {
      id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toDate() : now,
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : now,
    } as Team;
  }
  
  return {
    id,
    ...data,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  } as Team;
};

// Sample teams for development
const sampleTeams: Omit<Team, 'id'>[] = [
  {
    name: 'Photography Team A',
    lead: 'user1',
    members: ['user1', 'user2', 'user3'],
    specialization: 'Interior Photography',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true,
  },
  {
    name: 'Photography Team B',
    lead: 'user4',
    members: ['user4', 'user5'],
    specialization: 'Exterior Photography',
    availableDays: ['Tuesday', 'Thursday'],
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true,
  },
  {
    name: 'Photography Team C',
    lead: 'user6',
    members: ['user6', 'user7', 'user8'],
    specialization: 'Drone Photography',
    availableDays: ['Monday', 'Friday', 'Saturday'],
    createdAt: new Date(),
    updatedAt: new Date(),
    active: false,
  },
];

// Class for Team server actions
export class TeamServerActions {
  /**
   * Create a new team
   */
  static async createTeam(teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const team: Omit<Team, 'id'> = {
        ...teamData,
        createdAt: now,
        updatedAt: now,
      };
      
      const firestoreData = toFirestoreTeam(team as Team);
      const docRef = await addDoc(teamsCollection, firestoreData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  /**
   * Get all teams
   */
  static async getAllTeams(): Promise<Team[]> {
    try {
      const q = query(teamsCollection, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      // No longer auto-initialize sample data
      if (querySnapshot.empty) {
        return [];
      }
      
      return querySnapshot.docs.map(doc => 
        fromFirestoreTeam(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting all teams:', error);
      throw error;
    }
  }

  /**
   * Initialize sample data for development
   */
  static async initializeSampleData(): Promise<string[]> {
    try {
      const teamIds: string[] = [];
      
      for (const team of sampleTeams) {
        const firestoreData = toFirestoreTeam(team as Team);
        const docRef = await addDoc(teamsCollection, firestoreData);
        teamIds.push(docRef.id);
      }
      
      return teamIds;
    } catch (error) {
      console.error('Error initializing sample data:', error);
      throw error;
    }
  }

  /**
   * Get active teams
   */
  static async getActiveTeams(): Promise<Team[]> {
    try {
      const q = query(
        teamsCollection, 
        where('active', '==', true),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      
      // If there are no active teams, just return empty array
      if (querySnapshot.empty) {
        return [];
      }
      
      return querySnapshot.docs.map(doc => 
        fromFirestoreTeam(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting active teams:', error);
      throw error;
    }
  }

  /**
   * Get a team by ID
   */
  static async getTeamById(id: string): Promise<Team | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return fromFirestoreTeam(docSnap.id, docSnap.data());
    } catch (error) {
      console.error(`Error getting team ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update a team
   */
  static async updateTeam(id: string, teamData: Partial<Omit<Team, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      
      await updateDoc(docRef, {
        ...teamData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error updating team ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a team
   */
  static async deleteTeam(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting team ${id}:`, error);
      throw error;
    }
  }

  /**
   * Add member to team
   */
  static async addMemberToTeam(teamId: string, userId: string): Promise<void> {
    try {
      const team = await this.getTeamById(teamId);
      
      if (!team) {
        throw new Error(`Team ${teamId} not found`);
      }
      
      if (team.members.includes(userId)) {
        // Member already in team, nothing to do
        return;
      }
      
      const updatedMembers = [...team.members, userId];
      
      const docRef = doc(db, COLLECTION_NAME, teamId);
      await updateDoc(docRef, {
        members: updatedMembers,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error adding member ${userId} to team ${teamId}:`, error);
      throw error;
    }
  }

  /**
   * Remove member from team
   */
  static async removeMemberFromTeam(teamId: string, userId: string): Promise<void> {
    try {
      const team = await this.getTeamById(teamId);
      
      if (!team) {
        throw new Error(`Team ${teamId} not found`);
      }
      
      const updatedMembers = team.members.filter(member => member !== userId);
      
      const docRef = doc(db, COLLECTION_NAME, teamId);
      await updateDoc(docRef, {
        members: updatedMembers,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error removing member ${userId} from team ${teamId}:`, error);
      throw error;
    }
  }

  /**
   * Change team lead
   */
  static async changeTeamLead(teamId: string, newLeadId: string): Promise<void> {
    try {
      const team = await this.getTeamById(teamId);
      
      if (!team) {
        throw new Error(`Team ${teamId} not found`);
      }
      
      // Ensure the new lead is a member of the team
      if (!team.members.includes(newLeadId)) {
        throw new Error(`User ${newLeadId} is not a member of team ${teamId}`);
      }
      
      const docRef = doc(db, COLLECTION_NAME, teamId);
      await updateDoc(docRef, {
        lead: newLeadId,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error changing team lead to ${newLeadId} for team ${teamId}:`, error);
      throw error;
    }
  }

  /**
   * Remove all sample/fake data
   * This removes any teams created with the sample team names
   */
  static async removeSampleData(): Promise<{ count: number }> {
    try {
      // The team names used in the sample data
      const sampleTeamNames = [
        'Photography Team A',
        'Photography Team B',
        'Photography Team C'
      ];
      let deletedCount = 0;
      
      // Create queries for each sample team name
      for (const teamName of sampleTeamNames) {
        const q = query(
          teamsCollection, 
          where('name', '==', teamName)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          continue;
        }
        
        
        // Delete all teams with this name
        for (const docSnapshot of querySnapshot.docs) {
          await deleteDoc(docSnapshot.ref);
          deletedCount++;
        }
      }
      
      return { count: deletedCount };
    } catch (error) {
      console.error('Error removing sample team data:', error);
      throw error;
    }
  }
} 