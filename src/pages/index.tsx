import type {NextPage} from 'next'
import Head from 'next/head'
import * as yup from 'yup'
import Wave from 'react-wavify'
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {toast} from 'react-toastify';
import {useState} from 'react';

interface FormData {
    name: string;
    email: string;
    message: string;
    botcheck: boolean;
}

const schema = yup.object().shape({
    name: yup.string()
        .min(2, 'Der Name muss mindestens 2 Zeichen lang sein')
        .max(64, 'Der Name darf maximal 64 Zeichen lang sein')
        .required('Der Name darf nicht leer sein'),
    email: yup.string()
        .email('Die E-Mail-Adresse ist ungültig')
        .max(128, 'Die E-Mail-Adresse darf nicht länger als 128 Zeichen sein')
        .required('Die E-Mail-Adresse darf nicht leer sein'),
    message: yup.string()
        .min(3, 'Die Nachricht muss mindestens 3 Zeichen lang sein')
        .max(4096, 'Die Nachricht darf maximal 4096 Zeichen lang sein')
        .required('Die Nachricht darf nicht leer sein'),
    botcheck: yup.boolean()
});

const Home: NextPage = () => {
    const {register, handleSubmit, formState: {errors}, reset} = useForm<FormData>({
        resolver: yupResolver(schema)
    });
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify({
                access_key: '53c1ab18-73e3-4e61-9611-a74a6ce12c00',
                subject: 'Kontaktanfrage - ' + data.name,
                from_name: data.name,
                name: data.name,
                email: data.email,
                message: data.message,
                botcheck: data.botcheck
            }, null, 2),
        }).then(res => res.json()).then(async (res) => {
            setLoading(false);
            if (res.success) {
                toast.success('Nachricht erfolgreich versendet.');
                reset();
            } else {
                toast.error('Es ist ein Fehler aufgetreten.');
            }
        }).catch((error) => {
            setLoading(false);
            toast.error('Es ist ein Fehler aufgetreten.');
        });
    };

    return (
        <div className="h-full">
            <Head>
                <title>Kontakt | Niklas</title>
                <meta name="description" content="Willkommen auf meiner persönlichen Kontaktseite."/>
                <link rel="icon" href="/img/favicon.png"/>
            </Head>

            <main className="h-full flex">
                <div className="h-full w-1/2 hidden 2xl:flex relative gradient">
                    <img src="/img/logo-380.png" width={200} height={200} className="absolute z-10 logo"/>
                </div>
                <div className="h-full flex grow justify-center items-center">
                    <div className="w-full max-w-xl">
                        <div className="pb-10 text-center">
                            <h1 className="text-white text-5xl mb-1">Kontakt</h1>
                        </div>
                        <form className="flex flex-col px-5" onSubmit={handleSubmit(onSubmit)}>
                            <input type="checkbox" className="hidden" {...register('botcheck')}/>
                            <div className="form-group">
                                <input disabled={loading} type="text" className="form-control"
                                       placeholder="Name" {...register('name')}/>
                            </div>
                            <small className="text-red-400">{errors.name?.message}</small>
                            <div className="form-group">
                                <input disabled={loading} type="email" className="form-control" placeholder="Email"
                                       formNoValidate {...register('email')}/>
                            </div>
                            <small className="text-red-400">{errors.email?.message}</small>
                            <div className="form-group">
                                <textarea disabled={loading} placeholder="Nachricht" rows={8}
                                          className="form-control resize-none"  {...register('message')}/>
                            </div>
                            <small className="text-red-400">{errors.message?.message}</small>
                            <div className="flex justify-end mt-3">
                                <button disabled={loading} className="btn btn-primary" type="submit">Senden</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home
