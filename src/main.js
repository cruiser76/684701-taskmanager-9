import {getTaskMock} from './components/data';
import BoardController from './controllers/board-controller';

// получим список задач(пока моковых)
const getDataTaskList = () => {
  const TASK_COUNT = 11;
  const dataTaskList = [];
  for (let i = 0; i < TASK_COUNT; i += 1) {
    dataTaskList.push(getTaskMock());
  }
  return dataTaskList;
};
const dataTaskList = getDataTaskList();

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);

const boardController = new BoardController(mainContainer, menuContainer, dataTaskList);
boardController.init();
