import store from '@/store';
import { SWRProvider } from '@/utils/lib/swrConfig';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <SWRProvider>
        <Head>
          {/* Google Ads Tag */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-V2FLGXLQLB"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-V2FLGXLQLB');
              `,
            }}
          />
        </Head>
        <ToastContainer />
        <Component {...pageProps} />
      </SWRProvider>
    </Provider>
  );
}

export default MyApp;
