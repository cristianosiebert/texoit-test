import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import api from './api'

function Dashboard() {
  const [multiplosVencedores, setMultiplosVencedores] = useState({});
  const [top3Vencedores, setTop3Vencedores] = useState([]);
  const [intervalosMax, setIntervalosMax] = useState([]);
  const [intervalosMin, setIntervalosMin] = useState([]);
  const [anoBusca, setAnoBusca] = useState('');
  const [filmesAno, setFilmesAno] = useState([]);

  const getMultiplosVencedores = async () => {
    const url = '?projection=years-with-multiple-winners';
    const multiVencedores = await api.get(url);
    return multiVencedores.data;
  }

  const getTop3Vencedores = async () => {
    const url = '?projection=studios-with-win-count';
    const top3 = await api.get(url);
    return top3.data.studios.slice(0, 3);
  }

  const getIntervalosMaxMin = async () => {
    const url = '?projection=max-min-win-interval-for-producers';
    const intervalos = await api.get(url);
    return intervalos.data;
  }

  const getFilmesAno = async () => {
    if (anoBusca !== '') {
      const url = `?winner=true&year=${anoBusca}`;
      const filmesAno = await api.get(url);
      setFilmesAno(filmesAno.data);
    } else {
      resetFilmesAno();
    }
  }

  const resetFilmesAno = () => {
    setAnoBusca('');
    setFilmesAno([]);
  }

  useEffect(() => {
    const fetchData = async () => {
      const multiVencedores = await getMultiplosVencedores();
      setMultiplosVencedores(multiVencedores);
      const top3 = await getTop3Vencedores();
      setTop3Vencedores(top3);
      const filmesAno = await getIntervalosMaxMin();
      setIntervalosMax(filmesAno.max);
      setIntervalosMin(filmesAno.min);
    };
    fetchData();
  }, []);

  return (
    <div className="content-wrapper container">
      <div className="top-div">
        <h3 className="page-title">Lista de anos com múltiplos vencedores</h3>
        <DataTable
          stripedRows
          value={multiplosVencedores.years}
          tableStyle={{ minWidth: '372px' }}
          emptyMessage="Nenhum ano encontrado."
        >
          <Column field="year" header="Ano" style={{ width: '50%' }}></Column>
          <Column field="winnerCount" header="Vitórias"></Column>
        </DataTable>
      </div>

      <div className="top-div">
        <h3 className="page-title">Top 3 estúdios vencedores</h3>
        <DataTable
          stripedRows
          value={top3Vencedores}
          tableStyle={{ minWidth: '372px' }}
          emptyMessage="Nenhum estúdio encontrado."
        >
          <Column field="name" header="Nome" style={{ width: '50%' }}></Column>
          <Column field="winCount" header="Vitórias"></Column>
        </DataTable>
      </div>

      <div className="bottom-div">
        <h3 className="page-title">Produtores com maior e menor intervalo entre vitórias</h3>
        <h4 className="page-title">Máximo</h4>
        <DataTable
          stripedRows
          value={intervalosMax}
          tableStyle={{ minWidth: '372px' }}
          emptyMessage="Nenhum produtor encontrado."
        >
          <Column field="followingWin" header="Mais recente" style={{ width: '15%' }}></Column>
          <Column field="interval" header="Intervalo" style={{ width: '15%' }}></Column>
          <Column field="previousWin" header="Mais antigo" style={{ width: '15%' }}></Column>
          <Column field="producer" header="Produtor"></Column>
        </DataTable>

        <h4>Mínimo</h4>
        <DataTable
          stripedRows
          value={intervalosMin}
          tableStyle={{ minWidth: '372px' }}
          emptyMessage="Nenhum produtor encontrado."
        >
          <Column field="followingWin" header="Mais recente" style={{ width: '15%' }}></Column>
          <Column field="interval" header="Intervalo" style={{ width: '15%' }}></Column>
          <Column field="previousWin" header="Mais antigo" style={{ width: '15%' }}></Column>
          <Column field="producer" header="Produtor"></Column>
        </DataTable>
      </div>

      <div className="bottom-div">
        <h3 className="page-title">Lista de filmes vencedores por ano</h3>
        <div className="busca-ano">
          <InputText className="input-busca-ano" value={anoBusca} onChange={(e) => setAnoBusca(e.target.value)} />
          <Button className="btn-busca-ano" type="button" label="Aplicar" size="small" onClick={getFilmesAno}></Button>
          <Button className="btn-busca-ano" size="small" type="button" label="Cancelar" onClick={resetFilmesAno} outlined></Button>
        </div>

        <DataTable
          stripedRows
          value={filmesAno}
          tableStyle={{ minWidth: '372px' }}
          emptyMessage="Nenhum filme encontrado."
        >
          <Column field="id" header="ID" style={{ width: '10%' }}></Column>
          <Column field="year" header="Ano" style={{ width: '15%' }}></Column>
          <Column field="title" header="Título"></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default Dashboard;
