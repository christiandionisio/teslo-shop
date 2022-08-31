import { Typography } from '@mui/material';
import React from 'react'
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

export const KidPage = () => {
    const {products, isLoading} = useProducts('/products?gender=kid');

    return (
      <ShopLayout title={`Teslo-shop - Kids`} pageDescription={'Productos para niños'}>
          <>
            <Typography variant='h1' component='h1'>Niños</Typography>
            <Typography variant='h2' sx={{mb: 1}}>Productos para niños</Typography>
    
            {
              isLoading
                ? <FullScreenLoading />
                : <ProductList products={products} />
            }
    
          </>
      </ShopLayout>
    )
}

export default KidPage;
