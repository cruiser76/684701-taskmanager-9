import AbstractComponent from './abstract-component';
import {SortType} from './data';

export default class Sort extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<div class="board__filter-list">
    <a href="#" data-sort-type="${SortType.DEFAULT}" class="board__filter">SORT BY DEFAULT</a>
    <a href="#" data-sort-type="${SortType.DATE_UP}" class="board__filter">SORT BY DATE up</a>
    <a href="#" data-sort-type="${SortType.DATE_DOWN}" class="board__filter">SORT BY DATE down</a>
   </div>`;
  }
}
