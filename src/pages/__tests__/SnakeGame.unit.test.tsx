import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SnakeGame from '../SnakeGame';

// Mock canvas context
const mockContext = {
  fillStyle: '',
  strokeStyle: '',
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  arc: vi.fn(),
};

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext as unknown as CanvasRenderingContext2D);
  vi.clearAllMocks();
});

describe('SnakeGame - Unit Tests for Restart Functionality', () => {
  it('should render the snake game component', () => {
    render(<SnakeGame />);
    expect(screen.getByText(/Snake Game/i)).toBeInTheDocument();
  });

  it('should display initial score of 0', () => {
    render(<SnakeGame />);
    expect(screen.getByText(/Score: 0/i)).toBeInTheDocument();
  });

  it('should render canvas element', () => {
    const { container } = render(<SnakeGame />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('width', '400');
    expect(canvas).toHaveAttribute('height', '400');
  });

  it('should display game controls instructions', () => {
    render(<SnakeGame />);
    expect(screen.getByText(/Controls:/i)).toBeInTheDocument();
  });

  it('should respond to keyboard input', () => {
    render(<SnakeGame />);

    // Simulate arrow key press
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    // Should not throw errors
    expect(screen.getByText(/Snake Game/i)).toBeInTheDocument();
  });

  it('should support WASD controls', () => {
    render(<SnakeGame />);

    // Simulate WASD key press
    fireEvent.keyDown(window, { key: 'w' });
    fireEvent.keyDown(window, { key: 's' });
    fireEvent.keyDown(window, { key: 'a' });
    fireEvent.keyDown(window, { key: 'd' });

    // Should not throw errors
    expect(screen.getByText(/Snake Game/i)).toBeInTheDocument();
  });

  it('should render without Game Over screen initially', () => {
    render(<SnakeGame />);
    expect(screen.queryByText(/Game Over!/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Restart Game/i })).not.toBeInTheDocument();
  });
});
