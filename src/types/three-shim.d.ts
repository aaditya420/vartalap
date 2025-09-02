// Minimal shims to satisfy TypeScript when using three without @types
declare module 'three';
declare module 'three/examples/jsm/environments/RoomEnvironment.js' {
  export class RoomEnvironment {}
}
declare module 'three/examples/jsm/geometries/RoundedBoxGeometry.js' {
  export class RoundedBoxGeometry {
    constructor(...args: unknown[])
  }
}

