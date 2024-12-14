import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './components/Register';
import axios from 'axios';

// Mockujemy axios
jest.mock('axios');

describe('Register', () => {
  test('should send data to API on successful registration', async () => {
    // Mockujemy odpowiedź API
    axios.post.mockResolvedValue({ status: 200 });

    render(<Register />);

    // Symulujemy wpisywanie danych
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@example.com' }
    });

    // Klikamy przycisk "Register"
    fireEvent.click(screen.getByText(/Register/i));

    // Czekamy na odpowiedź API
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/register', {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
      });
    });
  });

  test('should show error message if registration fails', async () => {
    // Mockujemy błąd odpowiedzi API
    axios.post.mockRejectedValue(new Error('Registration failed'));

    render(<Register />);

    // Symulujemy wpisywanie danych
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@example.com' }
    });

    // Klikamy przycisk "Register"
    fireEvent.click(screen.getByText(/Register/i));

    // Czekamy na komunikat o błędzie
    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });
});
