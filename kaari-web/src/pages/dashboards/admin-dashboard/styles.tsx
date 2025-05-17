import styled from 'styled-components';

export const AdminDashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const Sidebar = styled.aside`
  width: 240px;
  background-color: #1a1a1a;
  color: #fff;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
`;

export const SidebarHeader = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid #333;
  margin-bottom: 20px;
`;

export const Logo = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

export const NavItem = styled.div<{ $active?: boolean }>`
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: ${props => props.$active ? '#333' : 'transparent'};
  
  &:hover {
    background-color: #333;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;

export const PageTitle = styled.h1`
  font-size: 1.8rem;
  margin: 0;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

export const UserName = styled.span`
  font-weight: 500;
`;

export const DashboardCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

export const CardTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

export const CardContent = styled.div`
  
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

export const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const StatLabel = styled.div`
  color: #666;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background-color: #f5f5f5;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #eee;
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 12px 15px;
  font-weight: 500;
`;

export const TableCell = styled.td`
  padding: 12px 15px;
`;

export const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #3a80d2;
  }
`;

export const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  
  background-color: ${props => {
    switch (props.status) {
      case 'pending':
        return '#ffeeba';
      case 'assigned':
        return '#d1ecf1';
      case 'completed':
        return '#d4edda';
      case 'cancelled':
        return '#f8d7da';
      case 'active':
        return '#d4edda';
      case 'blocked':
        return '#f8d7da';
      case 'admin':
        return '#cce5ff';
      default:
        return '#e2e3e5';
    }
  }};
  
  color: ${props => {
    switch (props.status) {
      case 'pending':
        return '#856404';
      case 'assigned':
        return '#0c5460';
      case 'completed':
        return '#155724';
      case 'cancelled':
        return '#721c24';
      case 'active':
        return '#155724';
      case 'blocked':
        return '#721c24';
      case 'admin':
        return '#004085';
      default:
        return '#383d41';
    }
  }};
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #eee;
`;

export const CancelButton = styled.button`
  background-color: #f1f1f1;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #e1e1e1;
  }
`;

export const ActionButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #3a80d2;
  }
`;

export const TabsContainer = styled.div`
  margin-bottom: 20px;
`;

export const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
`;

export const Tab = styled.div<{ active: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  border-bottom: ${props => props.active ? '2px solid #4a90e2' : 'none'};
  color: ${props => props.active ? '#4a90e2' : '#333'};
  
  &:hover {
    color: #4a90e2;
  }
`;

export const TabPanel = styled.div`
  padding: 20px 0;
`;

export const Badge = styled.span`
  display: inline-block;
  background-color: #4a90e2;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  font-size: 0.8rem;
  margin-left: 8px;
`;

export const DataList = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 16px;
  margin: 0;

  dt {
    font-weight: bold;
    color: #555;
  }

  dd {
    margin: 0;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;
