import { observable, action } from 'mobx';
import { Route } from '../components/common/GtfsTypes';

class VizStore {
  @observable route : Route | undefined;
  @observable tripJkey : string = '';
  @observable date : string = '';
  @observable time : string = '';

  @action
  updateRoute(route: Route | undefined) {
    this.route = route;
  }
}

export default VizStore;
