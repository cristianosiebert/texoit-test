import React, { useState, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import api from './api'

function Lista() {  
  const [movies, setMovies] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [filtros, setFiltros] = useState({
    year: { value: '', matchMode: FilterMatchMode.CONTAINS },
    winner: { value: '' },
    page: 0,
    first: 0,
    size: 10,
  });

  const limpar = () => {
    const filtro = {...filtros};
    filtro.year.value = '';
    filtro.winner.value = '';
    setFiltros(filtro);
  };

  const filtrar = (e) => {
    const filtro = {...filtros};
    filtro[e.field].value = e.constraints.value;
    setFiltros(filtro);
  }

  const filterWinner = (options) => {
    const opcoes = [
      { name: 'Sim', value: 'true' },
      { name: 'Não', value: 'false' },
    ]
    return <Dropdown aria-label="select-vencedor" value={options.value} onChange={(e) => options.filterCallback(e.value)} options={opcoes} optionLabel="name" />;
  };

  const filterClearTemplate = (options) => {
      return <Button className='cancel-filter' size="small" type="button" label="Cancelar" onClick={options.filterClearCallback} outlined></Button>;
  };

  const filterApplyTemplate = (options) => {
      return <Button type="button" label="Aplicar" size="small" onClick={options.filterApplyCallback}></Button>;
  };

  const onPageChange = (e) => {
    const filtro = {...filtros};
    filtro.page = e.page;
    filtro.first = e.first;
    filtro.size = e.rows;
    setFiltros(filtro);
  }

  useEffect(() => {
    const getParametrosFetch = () => {
      let params = `?page=${filtros.page}&size=${filtros.size}`;
      if (filtros.winner.value !== '') {
        params += `&winner=${filtros.winner.value}`
      }
      if (filtros.year.value !== '') {
        params += `&year=${filtros.year.value}`
      }
      return params
    };

    const getFilmes = async () => {
      const url = getParametrosFetch();
      const filmes = await api.get(url);
      return filmes;
    }

    const fetchData = async () => {
      const filmes = await getFilmes();
      setMovies(filmes.data.content);
      setPaginationData(filmes.data);
    };
    fetchData();
  }, [filtros]);

  return (
    <div className="content-wrapper">
      <h1 className="page-title">Lista de filmes</h1>
      <DataTable
        stripedRows
        value={movies}
        tableStyle={{ minWidth: '734px' }}
        filters={filtros}
        globalFilterFields={['year', 'winner']}
        emptyMessage="Nenhum filme encontrado."
      >
        <Column
          field="id"
          header="ID"
          style={{ width: '10%' }}
        ></Column>
        <Column
          field="year"
          header="Ano"
          filter
          onFilterApplyClick={filtrar}
          onFilterClear={limpar}
          filterApply={filterApplyTemplate}
          filterClear={filterClearTemplate}
          style={{ width: '15%' }}
        ></Column>
        <Column
          field="title"
          header="Título"
        ></Column>
        <Column
          field="winner"
          header="Vencedor?"
          dataType="boolean"
          filter
          onFilterApplyClick={filtrar}
          onFilterClear={limpar}
          filterElement={filterWinner}
          filterApply={filterApplyTemplate}
          filterClear={filterClearTemplate}
          style={{ width: '15%' }}
        ></Column>
      </DataTable>
      <Paginator
        first={filtros.first}
        page={filtros.page}
        rows={filtros.size}
        totalRecords={paginationData.totalElements}
        rowsPerPageOptions={[10, 20, 30]}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default Lista;
