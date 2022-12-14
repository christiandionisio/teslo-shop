import { Chip, Grid, Link, Typography } from '@mui/material';
import React from 'react'
import { ShopLayout } from '../../components/layouts';
import {DataGrid, GridColDef, GridValueGetterParams} from '@mui/x-data-grid'
import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 100},
    {field: 'fullname', headerName: 'Nombre Completo', width: 300},
    {
        field: 'paid', 
        headerName: 'Pagada', 
        description: 'Muestra información si esta pagada o no',
        width: 200,
        renderCell: (params) => {
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
        renderCell: (params) => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref>
                    <Link underline='always'>
                        Ver orden
                    </Link>
                </NextLink>
            )
        }
    },
];


interface Props {
    orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({orders}) => {

    const rows = orders.map((order, i) => ({
        id: i + 1,
        paid: order.isPaid,
        fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderId: order._id
    }))
    
  return (
    <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes de clientes'>
        <>
            <Typography variant='h1' component='h1'>Historial de oridenes</Typography>

            <Grid container className='fadeIn'>
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


export const getServerSideProps: GetServerSideProps = async ({req}) => {
    
    const session: any = await getSession({req});

    if (!session) {
        return {
            redirect: {
                destination: 'auth/login?p=/orders/history',
                permanent: false,
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser(session.user._id);

    return {
        props: {
            orders     
        }
    }
}

export default HistoryPage;