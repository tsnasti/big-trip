import {generateWaypoint} from '../mock/waypoint.js';

const POINT_COUNT = 5;

export default class PointModel {
  points = Array.from({length: POINT_COUNT}, generateWaypoint);

  getPoints = () => this.points;
}
