import {getSearch} from './site-search';
import {getFilters} from './site-filters';
import {getBoardContainer} from './board';

export const getContent = () => {
  return `
    ${getSearch()}
    ${getFilters()}
    ${getBoardContainer()}`;
};
