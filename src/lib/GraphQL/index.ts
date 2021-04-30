import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Config from '../../configs';
import * as Store from '../Store';

const httpLink = createHttpLink({
  uri: `${Config.backend_url}/graphql`,
});

const authLink = setContext(
  (
    _: any,
    {
      headers,
    }: {
      headers: any;
    }
  ) => {
    // get the authentication token from local storage if it exists
    const token = Store.get('currentUser.token');
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  }
);

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
