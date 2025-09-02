declare module 'three/examples/jsm/environments/RoomEnvironment.js' {
  import * as THREE from 'three'
  export class RoomEnvironment extends THREE.Object3D {}
}

declare module 'three/examples/jsm/geometries/RoundedBoxGeometry.js' {
  import * as THREE from 'three'
  export class RoundedBoxGeometry extends THREE.BoxGeometry {
    constructor(width: number, height: number, depth: number, segments?: number, radius?: number)
  }
}

