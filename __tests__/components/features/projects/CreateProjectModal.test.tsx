import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateProjectModal } from '@/components/features/projects/CreateProjectModal';
import { useCreateProject } from '@/lib/hooks/use-projects';
import { mockProject } from '@/__tests__/mocks/data';
import { render } from '@/__tests__/test-utils';

// Mock the hooks
jest.mock('@/lib/hooks/use-projects');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('CreateProjectModal', () => {
  const mockUseCreateProject = useCreateProject as jest.MockedFunction<typeof useCreateProject>;
  const mockMutateAsync = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    mockUseCreateProject.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      error: null,
      data: undefined,
      isSuccess: false,
      reset: jest.fn(),
      mutate: jest.fn(),
      status: 'idle',
      isIdle: true,
      variables: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
      context: undefined,
    } as ReturnType<typeof useCreateProject>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the modal when open', () => {
    render(<CreateProjectModal open={true} onOpenChange={mockOnOpenChange} />);

    expect(screen.getByText('Create New Project')).toBeInTheDocument();
    expect(screen.getByLabelText('Project Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Business Description')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<CreateProjectModal open={false} onOpenChange={mockOnOpenChange} />);

    expect(screen.queryByText('Create New Project')).not.toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    render(<CreateProjectModal open={true} onOpenChange={mockOnOpenChange} />);

    const submitButton = screen.getByText('Create Project');
    await user.click(submitButton);

    expect(screen.getByText('Project name is required')).toBeInTheDocument();
    expect(screen.getByText('Business description is required')).toBeInTheDocument();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('should create project with valid data', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValueOnce(mockProject);

    render(<CreateProjectModal open={true} onOpenChange={mockOnOpenChange} />);

    // Fill in the form
    await user.type(screen.getByLabelText('Project Name'), 'Test Project');
    await user.type(
      screen.getByLabelText('Business Description'),
      'This is a test project description'
    );

    // Submit
    await user.click(screen.getByText('Create Project'));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: 'Test Project',
        business_description: 'This is a test project description',
      });
    });

    // Modal should close
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should show loading state when creating', () => {
    mockUseCreateProject.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
      isError: false,
      error: null,
      data: undefined,
      isSuccess: false,
      reset: jest.fn(),
      mutate: jest.fn(),
      status: 'pending',
      isIdle: false,
      variables: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
      context: undefined,
    } as ReturnType<typeof useCreateProject>);

    render(<CreateProjectModal open={true} onOpenChange={mockOnOpenChange} />);

    expect(screen.getByText('Creating...')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByLabelText('Project Name')).toBeDisabled();
    expect(screen.getByLabelText('Business Description')).toBeDisabled();
  });

  it('should handle cancel', async () => {
    const user = userEvent.setup();
    render(<CreateProjectModal open={true} onOpenChange={mockOnOpenChange} />);

    // Type some data
    await user.type(screen.getByLabelText('Project Name'), 'Test');

    // Click cancel
    await user.click(screen.getByText('Cancel'));

    // Modal should close
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should clear errors when typing', async () => {
    const user = userEvent.setup();
    render(<CreateProjectModal open={true} onOpenChange={mockOnOpenChange} />);

    // Submit to trigger errors
    await user.click(screen.getByText('Create Project'));
    expect(screen.getByText('Project name is required')).toBeInTheDocument();

    // Start typing
    await user.type(screen.getByLabelText('Project Name'), 'T');

    // Error should be cleared
    expect(screen.queryByText('Project name is required')).not.toBeInTheDocument();
  });
});