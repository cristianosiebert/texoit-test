import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Dashboard from './dashboard';

test('Exibe anos com múltiplos vencedores', async () => {
  render(<Dashboard />);

  await waitFor(() => {
    expect(screen.getByText('1986')).toBeInTheDocument();
    expect(screen.getByText('1990')).toBeInTheDocument();
    expect(screen.getByText('2015')).toBeInTheDocument();
  });
});

test('Exibe top 3 de estúdios vencedores', async () => {
    render(<Dashboard />);

    setTimeout(async () => {
      await waitFor(() => {
        expect(screen.getByText('Columbia Pictures')).toBeInTheDocument();
        expect(screen.getByText('Paramount Pictures')).toBeInTheDocument();
        expect(screen.getByText('Warner Bros')).toBeInTheDocument();
      });
    }, 500);
});

test('Exibe produtores com maior e menor intervalo entre vitórias', async () => {
    render(<Dashboard />);
  
    await waitFor(() => {
      expect(screen.getByText('Matthew Vaughn')).toBeInTheDocument();
      expect(screen.getByText('Joel Silver')).toBeInTheDocument();
    });
});

test('Exibe lista de filmes vencedores por ano após busca', async () => {
    const anoBusca = '2002';
    render(<Dashboard />);
  
    fireEvent.change(screen.getByDisplayValue(''), { target: { value: anoBusca } });
    fireEvent.click(screen.getByText('Apply'));

    await waitFor(() => {
      expect(screen.getByText('Swept Away')).toBeInTheDocument();
    });
});