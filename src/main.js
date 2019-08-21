import {getMenu} from './components/site-menu';
import {getBoardContainer} from './components/board-container';
import {getSearch} from './components/site-search';
import {getFilters} from './components/site-filters';
import {getCardList, filterCount, dataTaskList} from './components/board';
import {getFiltersData} from './components/data';
import {getLoadMoreButton} from './components/button-load';
import {getButtonLoadAction} from './components/button-load-action';


export const renderContent = () => {
  const CARD_COUNT = 8;
  const boardContainer = document.querySelector(`.board`);
  if (boardContainer) {
    const boardList = boardContainer.querySelector(`.board__tasks`);
    boardList.innerHTML = ``;
    renderComponents(boardList, getCardList(CARD_COUNT));
    const filters = getFilters(getFiltersData(filterCount));
    if (document.querySelector(`.main__filter`)) {
      document.querySelector(`.main__filter`).parentNode.removeChild(document.querySelector(`.main__filter`));
    }
    renderComponents(boardContainer, filters, `beforebegin`);
    if (!document.querySelector(`.load-more`)) {
      renderComponents(boardList, dataTaskList.length === 0 ? `` : getLoadMoreButton(), `afterend`);
    }
  }
};

const renderComponents = (container, markup, method = `beforeEnd`) => {
  container.insertAdjacentHTML(method, markup);
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);

renderComponents(menuContainer, getMenu());
renderComponents(menuContainer, getSearch(), `afterend`);
renderComponents(mainContainer, getBoardContainer());

renderContent();
getButtonLoadAction();
