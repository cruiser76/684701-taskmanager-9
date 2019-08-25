import {dataTaskList} from './board';
import {renderContent} from './../main';

export const addButtonLoadAction = () => {
  const buttonLoad = document.querySelector(`.load-more`);

  if (buttonLoad) {
    buttonLoad.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      renderContent();
      if (dataTaskList.length === 0) {
        buttonLoad.parentNode.removeChild(buttonLoad);
      }
    });
  }
};
