import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../../components/layouts';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { tesloApi } from '../../axiosApi';
import { ErrorOutline } from '@mui/icons-material';
import { validations } from '../../utils';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context';
import { getSession, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';

type FormData = {
    name: string;
    email: string;
    password: string;
};

const RegisterPage = () => {

    const router = useRouter();
    const {registerUser} = useContext(AuthContext);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onRegisterForm = async ({name, email, password}: FormData) => {
        setShowError(false)

        const {hasError, message} = await registerUser(name, email, password);

        if (hasError) {
            setShowError(true);
            setErrorMessage(message!);
            setTimeout(() => setShowError(false), 3000);
            return;
        }

        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);
        await signIn('credentials', {email, password});
    }

  return (
    <AuthLayout title={'Registrar'}>
        <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
            <Box sx={{width: 350, padding: '10px 20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Crear Cuenta</Typography>
                        <Chip 
                            label='Error al registrar'
                            color='error'
                            icon={<ErrorOutline />}
                            className='fadeIn'
                            sx={{display: showError ? 'flex': 'none'}}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField 
                            label='Nombre 
                            completo' 
                            variant='filled' 
                            fullWidth 
                            {...register('name', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            type='email'
                            label='Correo' 
                            variant='filled' 
                            fullWidth 
                            {...register('email', {
                                required: 'Este campo es requerido',
                                validate: validations.isEmail
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label='Contrase??a'
                            type='password'
                            variant='filled'
                            fullWidth 
                            {...register('password', {
                                required: 'Este campo es requerido',
                                minLength: {value: 6, message: 'M??nimo 6 caracteres'}
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            color='secondary'
                            className='circular-btn'
                            size='large'
                            fullWidth
                            type='submit'
                        >
                            Registrar
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink 
                            href={'/auth/login' + ((router.query.p) ? `?p=${router.query.p?.toString()}`: '')} 
                            passHref
                        >
                            <Link underline='always'>
                                Ya tienes cuenta?
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({req, query}) => {

    const session = await getSession({req});

    const {p = '/'} = query; 

    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}

export default RegisterPage;