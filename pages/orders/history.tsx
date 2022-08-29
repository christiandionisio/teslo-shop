import { Chip, Grid, Link, Typography } from '@mui/material';
import React from 'react'
import { ShopLayout } from '../../components/layouts';
import {DataGrid, GridColDef, GridValueGetterParams} from '@mui/x-data-grid'
import NextLink from 'next/link';

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 100},
    {field: 'fullname', headerName: 'Nombre Completo', width: 300},
    {
        field: 'paid', 
        headerName: 'Pagada', 
        description: 'Muestra información si esta pagada o no',
        width: 200,
        renderCell: (params: GridValueGetterParams) => {
            return (
                params.row.paid
                    ? <Chip color='success' label='Pagada' variant='outlined' />
                    : <Chip color='error' label='No Pagada' variant='outlined' />
            )
        }
    },
    {
        field: 'order', 
        headerName: 'Ver orden', 
        width: 200,
        sortable: false,
        renderCell: (params: GridValueGetterParams) => {
            return (
                <NextLink href={`/orders/${params.row.id}`} passHref>
                    <Link underline='always'>
                        Ver orden
                    </Link>
                </NextLink>
            )
        }
    },
];

const rows = [
    {id: 1, paid: true, fullname: 'Christian Dionisio'},
    {id: 2, paid: false, fullname: 'Melissa Flores'},
    {id: 3, paid: false, fullname: 'Hernando Vallejo'},
    {id: 4, paid: true, fullname: 'Eduardo Rios'},
    {id: 5, paid: false, fullname: 'Natalia Herrera'},
    {id: 6, paid: true, fullname: 'Christian Dionisio'},
]

const HistoryPage = () => {
  return (
    <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes de clientes'>
        <>
            <Typography variant='h1' component='h1'>Historial de oridenes</Typography>

            <Grid container>
                <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                    <DataGrid 
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>
            </Grid>
        </>
    </ShopLayout>
  )
}

export default HistoryPage;