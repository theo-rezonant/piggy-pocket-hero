import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

describe('SnakeGame - Restart Functionality', () => {
  it('should render the snake game with initial score of 0', () => {
    render(<SnakeGame />);
    expect(screen.getByText(/Score: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/Snake Game/i)).toBeInTheDocument();
  });

  it('should display game over screen when game ends', async () => {
    render(<SnakeGame />);

    // Simulate multiple left arrow presses to cause collision
    for (let i = 0; i < 15; i++) {
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      await waitFor(() => {}, { timeout: 200 });
    }

    // Game Over screen should appear
    await waitFor(() => {
      expect(screen.getByText(/Game Over!/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('should display Restart button on game over screen', async () => {
    render(<SnakeGame />);

    // Force game over state by rapidly moving
    for (let i = 0; i < 15; i++) {
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      await waitFor(() => {}, { timeout: 200 });
    }

    await waitFor(() => {
      expect(screen.getByText(/Game Over!/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Restart Game/i })).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('should reset game state when Restart button is clicked', async () => {
    const { container } = render(<SnakeGame />);

    // Force game over
    for (let i = 0; i < 15; i++) {
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      await waitFor(() => {}, { timeout: 200 });
    }

    // Wait for game over
    await waitFor(() => {
      expect(screen.getByText(/Game Over!/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Get the restart button and click it
    const restartButton = screen.getByRole('button', { name: /Restart Game/i });
    fireEvent.click(restartButton);

    // Verify game state is reset
    await waitFor(() => {
      // Game Over screen should be removed
      expect(screen.queryByText(/Game Over!/i)).not.toBeInTheDocument();
      // Score should be reset to 0
      expect(screen.getByText(/Score: 0/i)).toBeInTheDocument();
    });
  });

  it('should remove Game Over screen after restart', async () => {
    render(<SnakeGame />);

    // Force game over
    for (let i = 0; i < 15; i++) {
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      await waitFor(() => {}, { timeout: 200 });
    }

    await waitFor(() => {
      expect(screen.getByText(/Game Over!/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Click restart
    const restartButton = screen.getByRole('button', { name: /Restart Game/i });
    fireEvent.click(restartButton);

    // Verify Game Over screen is removed
    await waitFor(() => {
      expect(screen.queryByText(/Game Over!/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Restart Game/i })).not.toBeInTheDocument();
    });
  });

  it('should allow keyboard controls after restart', async () => {
    render(<SnakeGame />);

    // Force game over
    for (let i = 0; i < 15; i++) {
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      await waitFor(() => {}, { timeout: 200 });
    }

    await waitFor(() => {
      expect(screen.getByText(/Game Over!/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Click restart
    const restartButton = screen.getByRole('button', { name: /Restart Game/i });
    fireEvent.click(restartButton);

    // Game should be playable again
    await waitFor(() => {
      expect(screen.queryByText(/Game Over!/i)).not.toBeInTheDocument();
    });

    // Test keyboard controls work
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    // No errors should occur
    expect(screen.getByText(/Snake Game/i)).toBeInTheDocument();
  });

  it('should display controls instructions', () => {
    render(<SnakeGame />);
    expect(screen.getByText(/Controls:/i)).toBeInTheDocument();
    expect(screen.getByText(/Arrow Keys or WASD: Move snake/i)).toBeInTheDocument();
    expect(screen.getByText(/Space: Pause\/Resume game/i)).toBeInTheDocument();
  });

  it('should support pause functionality with spacebar', () => {
    render(<SnakeGame />);

    // Press space to pause
    fireEvent.keyDown(window, { key: ' ' });

    // Pause overlay should appear
    waitFor(() => {
      expect(screen.getByText(/PAUSED/i)).toBeInTheDocument();
    });
  });
});
