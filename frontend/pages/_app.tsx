import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>LLM Recommender</title>
        <meta name="description" content="AI-powered show and movie recommendations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
        <main className="container mx-auto px-4 py-8">
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}

export default MyApp;
