import {getMenu} from './components/site-menu';
import {getContent} from './components/content';

const renderComponents = (container, markup, method = `beforeEnd`) => {
  container.insertAdjacentHTML(method, markup);
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);

renderComponents(menuContainer, getMenu());
renderComponents(mainContainer, getContent());
