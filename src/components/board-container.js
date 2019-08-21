import {getSortList} from './sorting';

export const getBoardContainer = () => {
  return `<section class="board container">
  ${getSortList()}
  <div class="board__tasks">

  </div>
</section>`;
};
