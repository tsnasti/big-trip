import CreatingFormView from '../view/creating-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import {render} from '../render.js';

export default class TripPresenter {

  init = (tripContainer, PointModel) => {
    this.tripContainer = tripContainer;
    this.pointModel = PointModel;
    this.eventPoints = [...this.pointModel.getPoints()];

    window.console.log(this.eventPoints);

    render(new CreatingFormView(this.eventPoints[0]), this.tripContainer);

    for (let i = 0; i < this.eventPoints.length; i++) {
      render(new WaypointView(this.eventPoints[i]), this.tripContainer);
      render(new EditFormView(this.eventPoints[i]), this.tripContainer);
    }
  };
}
