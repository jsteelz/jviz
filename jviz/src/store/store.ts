import { observable, computed } from 'mobx';
import { Route } from '../components/common/GtfsTypes';

class VizStore {
  @observable route : Route | undefined;
  @observable tripJkey : string = '';
  @observable date : string = '';
  @observable time : string = '';
}

export default new VizStore();
