import {getEditForm} from './edit-form';
import {getCard} from './card';
import {getButton} from './button-load';

export const getBoardContainer = () => {
  return `<section class="board container">
    <div class="board__filter-list">
      <a href="#" class="board__filter">SORT BY DEFAULT</a>
      <a href="#" class="board__filter">SORT BY DATE up</a>
      <a href="#" class="board__filter">SORT BY DATE down</a>
    </div>
    <div class="board__tasks">
    ${getEditForm()}
    ${getCard()}
    ${getCard()}
    ${getCard()}
    </div>
    ${getButton()}
  </section>`;
};
