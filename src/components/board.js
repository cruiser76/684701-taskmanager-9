import {getEditForm} from './edit-form';
import {getCard} from './card';
import {getLoadModeButton} from './button-load';
import {getSortList} from './sorting';

export const getBoardContainer = () => {
  return `<section class="board container">
    ${getSortList()}
    <div class="board__tasks">
    ${getEditForm()}
    ${getCard()}
    ${getCard()}
    ${getCard()}
    </div>
    ${getLoadModeButton()}
  </section>`;
};
