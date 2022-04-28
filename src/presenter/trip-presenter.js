import CreatingFormView from '../view/creating-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import {render} from '../render.js';

export default class TripPresenter {

  init = (tripContainer) => {
    this.tripContainer = tripContainer;

    render(new CreatingFormView(), this.tripContainer);
    render(new EditFormView(), this.tripContainer);

    for (let i = 0; i < 3; i++) {
      render(new WaypointView(), this.tripContainer);
    }
  };
}
