import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { NextPage } from "next";
import { ShopLayout } from "../../components/layouts"
import { ProductSlideshow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { ICartProduct, IProduct } from "../../interfaces";
import { dbProducts } from "../../database";
import { GetStaticPaths } from 'next';
import { GetStaticProps } from 'next';
import { getAllProductSlugs } from "../../database/dbProducts";
import { useContext, useState } from "react";
import { ISize } from '../../interfaces/products';
import { useRouter } from "next/router";
import { CartContext } from "../../context";


interface Props {
  product: IProduct;
}

const ProductPage:NextPage<Props> = ({product}) => {

  const router = useRouter();

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const {addProductToCart} = useContext(CartContext);

  const selectedSize = (size: ISize) => {
    setTempCartProduct({
      ...tempCartProduct,
      size
    })
  }

  const onAddProduct = () => {
    if (!tempCartProduct.size) return;
    addProductToCart(tempCartProduct);
    router.push('/cart');
  }

  const updateQuantity = (quantity: number) => {
    setTempCartProduct({
      ...tempCartProduct,
      quantity
    });
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description} >
      <Grid container spacing={3} >
        <Grid item xs={12} sm={7}>
          <ProductSlideshow 
            images={product.images}
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column' >
            {/* titulos */}
            <Typography variant="h1" component='h1' >{product.title}</Typography>
            <Typography variant="subtitle1" component='h2' >${product.price}</Typography>

            {/* Cantidad */}
            <Box sx={{my: 2}}>
              <Typography variant="subtitle2">Cantidad</Typography>
              <ItemCounter 
                currentValue={tempCartProduct.quantity}
                maxValue={product.inStock > 10 ? 10: product.inStock}
                updateQuantity={updateQuantity}
              />
              <SizeSelector 
                sizes={product.sizes}
                selectedSize={tempCartProduct.size}
                onSelectedSize={selectedSize}
              />
            </Box>

            {/* Agregar al carrito */}

            {
              (product.inStock > 0)
              ? (
                <Button color="secondary" className="circular-btn"
                  onClick={onAddProduct}
                >
                  {
                    tempCartProduct.size
                      ? 'Agregar al carrito'
                      : 'Seleccione una talla'
                  }
                </Button>
              )
              : (
                <Chip label="No hay disponibles" color="error" variant="outlined" />
              )
            }



            {/* Description */}
            <Box sx={{mt: 3}}>
              <Typography variant="subtitle2" >Descripción</Typography>
              <Typography variant="body2" >{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// export const getServerSideProps: GetServerSideProps = async ({params}) => {

//   const product = await dbProducts.getProductBySlug(params?.slug as string)

  // if (!product) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false
  //     }
  //   }
  // }

//   return {
//     props: {
//       product
//     }
//   }
// }



export const getStaticPaths: GetStaticPaths = async (ctx) => {
  
  const productsSlug = await getAllProductSlugs();

  return {
    paths: productsSlug.map(({slug}) => (
      {
        params: {slug}
      }
    )),
    fallback: "blocking"
  }
}


export const getStaticProps: GetStaticProps = async ({params}) => {
  const product = await dbProducts.getProductBySlug(params?.slug as string);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24
  }
}



export default ProductPage