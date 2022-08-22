import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'; // import bootstrap from node_modules
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { rootStore } from './reducers';

function MyApp({ Component, pageProps }) {
  return <Provider store={rootStore}>
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  </Provider>
}

export default MyApp
