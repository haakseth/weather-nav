/* tslint:disable no-any */
interface Directions {
  bbox: Array<number>;
  info: DirectionsInfo;
  routes: Array<Route>;
}
interface Route {
  bbox: Array<number>;
  geometry: string;
  geometry_format: string;
  segments: Array<RouteSegment>;
  summary: RouteSummary;
  way_points: Array<number>;
}

interface RouteSegment {
  distance: number;
  duration: number;
  steps: Array<RouteStep>;
}

interface RouteStep {
  distance: number;
  duration: number;
  instruction: string;
  name: string;
  type: number;
}

interface RouteSummary {
  distance: number;
  duration: number;
}

interface DirectionsInfo {
  attribution: string;
  engine: any;
  query: any;
  service: string;
  timestamp: number;
}
