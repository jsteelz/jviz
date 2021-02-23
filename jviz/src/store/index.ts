import { createContext } from 'react';
import VizStore from './store';

export const storeContext = createContext({
  store: new VizStore()
});
