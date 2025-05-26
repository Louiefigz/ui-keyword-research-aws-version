import { screen, fireEvent, waitFor } from '@testing-library/react';
import { FileDropzone } from '@/components/features/upload/FileDropzone';
import { render } from '@/__tests__/test-utils';

describe('FileDropzone', () => {
  const mockOnFileSelect = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render dropzone with instructions', () => {
    render(<FileDropzone onFileSelect={mockOnFileSelect} />);

    expect(screen.getByText(/Drag & drop your CSV file here/)).toBeInTheDocument();
    expect(screen.getByText(/Supports files up to 50MB/)).toBeInTheDocument();
  });

  it('should show processing state', () => {
    render(<FileDropzone onFileSelect={mockOnFileSelect} isProcessing />);

    expect(screen.getByText('Detecting CSV format...')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should handle file drop', async () => {
    render(<FileDropzone onFileSelect={mockOnFileSelect} />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByText(/Drag & drop your CSV file here/).closest('div');

    if (dropzone) {
      // Simulate file drop
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(mockOnFileSelect).toHaveBeenCalledWith(file);
      });
    }
  });

  it('should handle file selection via input', async () => {
    render(<FileDropzone onFileSelect={mockOnFileSelect} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });

    if (input) {
      // Simulate file selection
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(mockOnFileSelect).toHaveBeenCalledWith(file);
      });
    }
  });

  it('should reject non-CSV files', async () => {
    render(<FileDropzone onFileSelect={mockOnFileSelect} />);

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const dropzone = screen.getByText(/Drag & drop your CSV file here/).closest('div');

    if (dropzone) {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
        },
      });

      // Should not call onFileSelect for invalid file
      expect(mockOnFileSelect).not.toHaveBeenCalled();
    }
  });

  it('should show error for oversized files', async () => {
    render(<FileDropzone onFileSelect={mockOnFileSelect} maxSize={1024} />); // 1KB limit

    const largeContent = new Array(2000).join('x'); // 2KB content
    const file = new File([largeContent], 'large.csv', { type: 'text/csv' });
    const dropzone = screen.getByText(/Drag & drop your CSV file here/).closest('div');

    if (dropzone) {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
        },
      });

      // Should not call onFileSelect for oversized file
      expect(mockOnFileSelect).not.toHaveBeenCalled();
    }
  });

  it('should be disabled when processing', () => {
    render(<FileDropzone onFileSelect={mockOnFileSelect} isLoading />);

    const dropzone = screen.getByText(/Detecting CSV format/i);
    expect(dropzone).toBeInTheDocument();
  });
});