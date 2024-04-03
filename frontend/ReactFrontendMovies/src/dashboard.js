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
        <h3 className="page-title">List years with multiple winners</h3>
        <DataTable
          stripedRows
          value={multiplosVencedores.years}
          tableStyle={{ minWidth: '372px' }}
          emptyMessage="Year not found."
        >
          <Column field="year" header="Year" style={{ width: '50%' }}></Column>
          <Column field="winnerCount" header="Win Count"></Column>
        </DataTable>
      </div>

      <div className="top-div">
        <h3 className="page-title">Top 3 studios wiht winners</h3>
        <DataTable
          stripedRows
          value={top3Vencedores}
          tableStyle={{ minWidth: '372px' }}
          emptyMessage="Studio not found."
        >
          <Column field="name" header="Name" style={{ width: '50%' }}></Column>
          <Column field="winCount" header="Win Count"></Column>
        </DataTable>
      </div>

      <div className="bottom-div">
        <h3 className="page-title">Producers with longest and shortest interval between wins</h3>
        <h4 className="page-title">Maximum</h4>
        <DataTable
          stripedRows
          value={intervalosMax}
          tableStyle={{ minWidth: '372px' }}
          emptyMessage="Producers not found."
        >
          <Column field="producer" header="Producer"></Column>
          <Column field="interval" header="Interval" style={{ width: '15%' }}></Column>
          <Column field="previousWin" header="Previous Year" style={{ width: '15%' }}></Column>
          <Column field="followingWin" header="Following Year" style={{ width: '15%' }}></Column>
        </DataTable>

        <h4>Minimum</h4>
        <DataTable
          stripedRows
          value={intervalosMin}
          tableStyle={{ minWidth: '372px' }}
          emptyMessage="Producers not found."
        >
          <Column field="producer" header="Producer"></Column>
          <Column field="interval" header="Interval" style={{ width: '15%' }}></Column>
          <Column field="previousWin" header="Previous Year" style={{ width: '15%' }}></Column>
          <Column field="followingWin" header="Following Year" style={{ width: '15%' }}></Column>
        </DataTable>
      </div>

      <div className="bottom-div">
        <h3 className="page-title">List movie winners by year</h3>
        <div className="busca-ano">
          <InputText className="input-busca-ano" value={anoBusca} onChange={(e) => setAnoBusca(e.target.value)} />
          <Button className="btn-busca-ano" type="button" label="Apply" size="small" onClick={getFilmesAno}></Button>
          <Button className="btn-busca-ano" size="small" type="button" label="Cancel" onClick={resetFilmesAno} outlined></Button>
        </div>

        <DataTable
          stripedRows
          value={filmesAno}
          tableStyle={{ minWidth: '372px' }}
        >
          <Column field="id" header="ID" style={{ width: '10%' }}></Column>
          <Column field="year" header="Year" style={{ width: '15%' }}></Column>
          <Column field="title" header="Title"></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default Dashboard;
