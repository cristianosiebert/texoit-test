import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Lista from './lista';

test('Exibe lista de filmes', async () => {
  render(<Lista />);

  await waitFor(() => {
    expect(screen.getByText("Can't Stop the Music")).toBeInTheDocument();
    expect(screen.getByText('Cruising')).toBeInTheDocument();
  });
});

test('Paginação da lista de filmes', async () => {
    render(<Lista />);
  
    await waitFor(() => {
      expect(screen.getByText('Cruising')).toBeInTheDocument();
      expect(screen.getByText('The Formula')).toBeInTheDocument();
      expect(screen.getByText('Friday the 13th')).toBeInTheDocument();
      expect(screen.getByText('The Nude Bomb')).toBeInTheDocument();
      expect(screen.getByText('The Jazz Singer')).toBeInTheDocument();
    });
  
    fireEvent.click(screen.getByLabelText('Next Page'));

    await waitFor(() => {
      expect(screen.queryByText('Cruising')).not.toBeInTheDocument();
      expect(screen.queryByText('The Formula')).not.toBeInTheDocument();
      expect(screen.queryByText('Friday the 13th')).not.toBeInTheDocument();
      expect(screen.queryByText('Tarzan, the Ape Man')).toBeInTheDocument();
      expect(screen.queryByText('Inchon')).toBeInTheDocument();
    });
  
    fireEvent.click(screen.getByLabelText('Previous Page'));
  
    await waitFor(() => {
      expect(screen.getByText('Cruising')).toBeInTheDocument();
      expect(screen.getByText('The Formula')).toBeInTheDocument();
      expect(screen.getByText('Friday the 13th')).toBeInTheDocument();
      expect(screen.queryByText('Butterfly')).not.toBeInTheDocument();
      expect(screen.queryByText('Annie')).not.toBeInTheDocument();
    });
});

test('Filtros da lista de filmes', async () => {
    render(<Lista />);

    await waitFor(() => {
      expect(screen.getByText('Cruising')).toBeInTheDocument();
      expect(screen.getByText('The Formula')).toBeInTheDocument();
      expect(screen.getByText('Friday the 13th')).toBeInTheDocument();
      expect(screen.getByText('The Nude Bomb')).toBeInTheDocument();
      expect(screen.getByText('The Jazz Singer')).toBeInTheDocument();
    });

    const btnFilter = screen.getAllByLabelText('Show Filter Menu');
    fireEvent.click(btnFilter[0]);
    fireEvent.change(screen.getByDisplayValue(''), { target: { value: '1985' } });
    setTimeout(async () => {
        fireEvent.click(screen.getByLabelText('Aplicar'));

        await waitFor(() => {
        expect(screen.queryByText('The Jazz Singer')).not.toBeInTheDocument();
        expect(screen.queryByText('Rambo: First Blood Part II')).toBeInTheDocument();
        expect(screen.queryByText('Fever Pitch')).toBeInTheDocument();
        expect(screen.queryByText('Revolution')).toBeInTheDocument();
        expect(screen.queryByText('Rocky IV')).toBeInTheDocument();
        expect(screen.queryByText('Year of the Dragon')).toBeInTheDocument();
        });
    }, 500);

    fireEvent.click(btnFilter[1]);
    fireEvent.change(screen.getByLabelText('select-vencedor'), { target: { value: 'true' } });
    setTimeout(async () => {
        fireEvent.click(screen.getByLabelText('Aplicar'));
        await waitFor(() => {
        expect(screen.queryByText('Rambo: First Blood Part II')).toBeInTheDocument();
        });
    }, 500);

    fireEvent.click(btnFilter[1]);
    setTimeout(async () => {
        fireEvent.click(screen.getByLabelText('Cancelar'));
        await waitFor(() => {
            expect(screen.queryByText('The Jazz Singer')).not.toBeInTheDocument();
            expect(screen.queryByText('Rambo: First Blood Part II')).toBeInTheDocument();
            expect(screen.queryByText('Fever Pitch')).toBeInTheDocument();
            expect(screen.queryByText('Revolution')).toBeInTheDocument();
            expect(screen.queryByText('Rocky IV')).toBeInTheDocument();
            expect(screen.queryByText('Year of the Dragon')).toBeInTheDocument();
        });
    }, 500);

    fireEvent.click(btnFilter[0]);
    setTimeout(async () => {
        fireEvent.click(screen.getByLabelText('Cancelar'));
        await waitFor(() => {
            expect(screen.getByText('Cruising')).toBeInTheDocument();
            expect(screen.getByText('The Formula')).toBeInTheDocument();
            expect(screen.getByText('Friday the 13th')).toBeInTheDocument();
            expect(screen.getByText('The Nude Bomb')).toBeInTheDocument();
            expect(screen.getByText('The Jazz Singer')).toBeInTheDocument();
        });
    }, 500);    
});