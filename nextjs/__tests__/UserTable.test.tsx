import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import '@testing-library/jest-dom';
import UserTable from '../app/components/UserTable';
import theme from '../app/theme';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Test wrapper with theme
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

const mockUsersResponse = {
  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      bio: 'System administrator',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'user',
      bio: 'Frontend developer',
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
    },
  ],
  total: 2,
  page: 1,
  per_page: 10,
  total_pages: 1,
};

describe('UserTable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(
      <TestWrapper>
        <UserTable />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders user data after loading', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsersResponse,
    });

    render(
      <TestWrapper>
        <UserTable />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
    });

    // Check if user roles are displayed with correct chips
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();

    // Check if bio is displayed
    expect(screen.getByText('System administrator')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockFetch.mockRejectedValueOnce(new Error('API Error'));

    render(
      <TestWrapper>
        <UserTable />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });

  it('handles search functionality', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUsersResponse,
    });

    render(
      <TestWrapper>
        <UserTable />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search users...');
    
    fireEvent.change(searchInput, { target: { value: 'John' } });

    // Wait for debounce
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('search=John')
      );
    }, { timeout: 1000 });
  });

  it('handles role filtering', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUsersResponse,
    });

    render(
      <TestWrapper>
        <UserTable />
      </TestWrapper>
    );

    // Open role select
    const roleSelect = screen.getByLabelText('Role');
    fireEvent.mouseDown(roleSelect);

    // Select admin role
    const adminOption = screen.getByText('Admin');
    fireEvent.click(adminOption);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('role=admin')
      );
    });
  });

  it('handles pagination', async () => {
    const paginatedResponse = {
      ...mockUsersResponse,
      total: 25,
      total_pages: 3,
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => paginatedResponse,
    });

    render(
      <TestWrapper>
        <UserTable />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Test page navigation
    const nextPageButton = screen.getByLabelText('Go to next page');
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2')
      );
    });
  });

  it('changes rows per page', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUsersResponse,
    });

    render(
      <TestWrapper>
        <UserTable />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Open rows per page select
    const rowsPerPageSelect = screen.getByDisplayValue('10');
    fireEvent.mouseDown(rowsPerPageSelect);

    // Select 25 rows per page
    const option25 = screen.getByText('25');
    fireEvent.click(option25);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('per_page=25')
      );
    });
  });

  it('displays empty state when no users found', async () => {
    const emptyResponse = {
      users: [],
      total: 0,
      page: 1,
      per_page: 10,
      total_pages: 0,
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => emptyResponse,
    });

    render(
      <TestWrapper>
        <UserTable />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('No users found')).toBeInTheDocument();
    });
  });

  it('formats dates correctly', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUsersResponse,
    });

    render(
      <TestWrapper>
        <UserTable />
      </TestWrapper>
    );

    await waitFor(() => {
      // Should display formatted date (Jan 1, 2023)
      expect(screen.getByText('Jan 1, 2023')).toBeInTheDocument();
    });
  });

  it('displays user avatars with initials', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUsersResponse,
    });

    render(
      <TestWrapper>
        <UserTable />
      </TestWrapper>
    );

    await waitFor(() => {
      // Should display user initials in avatars
      expect(screen.getByText('JD')).toBeInTheDocument(); // John Doe
      expect(screen.getByText('JS')).toBeInTheDocument(); // Jane Smith
    });
  });

  it('handles refresh functionality', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUsersResponse,
    });

    render(
      <TestWrapper>
        <UserTable />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Clear previous calls
    mockFetch.mockClear();

    // Click refresh button
    const refreshButton = screen.getByLabelText('Refresh');
    fireEvent.click(refreshButton);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('truncates long bio text', async () => {
    const longBioResponse = {
      users: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'admin',
          bio: 'This is a very long bio that should be truncated because it exceeds the maximum width allowed in the table cell and we want to ensure the UI remains clean and readable',
          created_at: '2023-01-01T00:00:00Z',
        },
      ],
      total: 1,
      page: 1,
      per_page: 10,
      total_pages: 1,
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => longBioResponse,
    });

    render(
      <TestWrapper>
        <UserTable />
      </TestWrapper>
    );

    await waitFor(() => {
      const bioCell = screen.getByText(/This is a very long bio/);
      expect(bioCell).toBeInTheDocument();
      
      // Check if the text is truncated (has ellipsis styling)
      const computedStyle = window.getComputedStyle(bioCell);
      expect(computedStyle.textOverflow).toBe('ellipsis');
    });
  });

  it('handles role color coding correctly', async () => {
    const multiRoleResponse = {
      users: [
        { id: 1, name: 'Admin User', email: 'admin@test.com', role: 'admin', created_at: '2023-01-01T00:00:00Z' },
        { id: 2, name: 'Manager User', email: 'manager@test.com', role: 'manager', created_at: '2023-01-01T00:00:00Z' },
        { id: 3, name: 'Regular User', email: 'user@test.com', role: 'user', created_at: '2023-01-01T00:00:00Z' },
      ],
      total: 3,
      page: 1,
      per_page: 10,
      total_pages: 1,
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => multiRoleResponse,
    });

    render(
      <TestWrapper>
        <UserTable />
      </TestWrapper>
    );

    await waitFor(() => {
      // All role chips should be present
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('manager')).toBeInTheDocument();
      expect(screen.getByText('user')).toBeInTheDocument();
    });
  });
});