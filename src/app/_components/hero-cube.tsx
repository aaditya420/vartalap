'use client'
/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unused-vars,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-explicit-any */

import { useEffect, useRef } from 'react'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PMREMGenerator,
  AmbientLight,
  DirectionalLight,
  Group,
  Box3,
  Sphere,
  Vector3,
  Quaternion,
  Vector2,
  MathUtils,
  MeshPhysicalMaterial,
  Mesh,
  Object3D,
  BufferGeometry,
  SRGBColorSpace,
  Clock,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'


export default function HeroCube() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<any>(null)

  useEffect(() => {
    const container = containerRef.current!
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new Scene()
    // Transparent background so the cube blends into the page gradient
    scene.background = null

    const camera = new PerspectiveCamera(38, width / height, 0.1, 100)
    // Start at a pleasant 3/4 angle; exact distance is framed below
    camera.position.set(4.2, 2.6, 6)

    const renderer = new WebGLRenderer({ antialias: true, alpha: true })
    renderer.outputColorSpace = SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height, false)
    renderer.setClearColor(0x000000, 0)
    Object.assign(renderer.domElement.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      display: 'block',
    })
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Subtle environment for glossy reflections
    const pmrem = new PMREMGenerator(renderer)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.02).texture
    scene.environment = env

    // Lighting: soft rim + key
    const ambient = new AmbientLight(0xffffff, 0.3)
    scene.add(ambient)

    const key = new DirectionalLight(0xffffff, 0.7)
    key.position.set(5, 6, 4)
    key.castShadow = true
    scene.add(key)

    const rim = new DirectionalLight(0xffffff, 0.5)
    rim.position.set(-6, -3, -4)
    scene.add(rim)

    // Root group (orientation controlled by cursor)
    const root = new Group()
    scene.add(root)

    // Build 3x3x3 cubelets with small gaps
    const spacing = 1.08
    const size = 0.98
    const radius = 0.08

    const geometry = new RoundedBoxGeometry(size, size, size, 4, radius)
    const material = new MeshPhysicalMaterial({
      color: 0x000000,
      roughness: 0.18,
      metalness: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.2,
    })

    const cubelets: any[] = []
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        for (let k = -1; k <= 1; k++) {
          const m = new Mesh(geometry, material)
          m.position.set(i * spacing, j * spacing, k * spacing)
          m.castShadow = true
          m.receiveShadow = true
          m.userData = { i, j, k }
          root.add(m)
          cubelets.push(m)
        }
      }
    }

    // Frame object to fit container (no cropping)
    const bbox = new Box3().setFromObject(root)
    const sphere = new Sphere()
    bbox.getBoundingSphere(sphere)
    const center = sphere.center.clone()
    const initialDir = camera.position.clone().sub(center).normalize() // keep the viewing angle

    function frameToView() {
      // Fit both width and height of the sphere into the frustum
      const fovY = MathUtils.degToRad(camera.fov)
      const fovX = 2 * Math.atan(Math.tan(fovY / 2) * camera.aspect)
      const r = sphere.radius * 1.25 // margin for aesthetics
      const distY = r / Math.sin(fovY / 2)
      const distX = r / Math.sin(fovX / 2)
      const dist = Math.max(distX, distY)
      camera.position.copy(center).add(initialDir.clone().multiplyScalar(dist))
      camera.lookAt(center)
    }
    frameToView()

    // Helper to pick a layer and rotate 90deg smoothly
    // Sub‑group that temporarily holds a rotating layer. It must be
    // parented under `root` so it inherits the cube's overall rotation.
    const turnGroup = new Group()
    root.add(turnGroup)

    type Axis = 'x' | 'y' | 'z'
    const axes: Axis[] = ['x', 'y', 'z']
    const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)]!
    let nextTurnTime = 1.8 // seconds before first turn
    let turning = false
    let turnAxis: Axis = 'y'
    let layer = 0
    let angle = 0
    const turnDuration = 0.6
    let dir = 1

    function attachLayer(a: Axis, l: number) {
      // Reset pivot to cube center and clear any previous rotation
      turnGroup.position.set(0, 0, 0)
      turnGroup.rotation.set(0, 0, 0)

      // Detach any previous layer back to the root (preserve world transform)
      while (turnGroup.children.length) {
        const child = turnGroup.children[0]
        child.updateMatrixWorld(true)
        root.attach(child)
      }

      // Attach selected layer matching logical coords (exact indices)
      cubelets.forEach((c) => {
        if (
          (a === 'x' && c.userData.i === l) ||
          (a === 'y' && c.userData.j === l) ||
          (a === 'z' && c.userData.k === l)
        ) {
          turnGroup.attach(c)
        }
      })
    }

    function bakeAndUpdateIndices(a: Axis, l: number, clockwise: number) {
      // Bake transform: move children back to root preserving world transform
      const children = [...turnGroup.children]
      children.forEach((child) => {
        child.updateMatrixWorld(true)
        root.attach(child)
      })
      // Update logical indices after 90deg turn
      const rot = (v: { i: number; j: number; k: number }) => {
        const { i, j, k } = v
        if (a === 'x') return { i, j: clockwise > 0 ? -k : k, k: clockwise > 0 ? j : -j }
        if (a === 'y') return { i: clockwise > 0 ? k : -k, j, k: clockwise > 0 ? -i : i }
        // z
        return { i: clockwise > 0 ? -j : j, j: clockwise > 0 ? i : -i, k }
      }
      cubelets.forEach((c) => {
        if (
          (a === 'x' && c.userData.i === l) ||
          (a === 'y' && c.userData.j === l) ||
          (a === 'z' && c.userData.k === l)
        ) {
          c.userData = rot(c.userData)
        }
      })
      // Reset temporary group's rotation for next turn
      turnGroup.rotation.set(0, 0, 0)
    }

    const clock = new Clock()

    // Cursor-driven orientation: rotate so the cube's corner (1,1,1)
    // points toward the mouse cursor ray from the camera.
    const cornerVec = new Vector3(1, 1, 1).normalize()
    const targetQuat = new Quaternion().copy(root.quaternion)

    function updateOrientationFromPointer(clientX: number, clientY: number) {
      const ndc = new Vector2(
        (clientX / window.innerWidth) * 2 - 1,
        -(clientY / window.innerHeight) * 2 + 1,
      )
      const rayPoint = new Vector3(ndc.x, ndc.y, 0.5).unproject(camera)
      const dir = rayPoint.sub(camera.position).normalize()
      // Aim at a point along the ray roughly at the cube center depth
      const dist = camera.position.distanceTo(center)
      const hit = camera.position.clone().add(dir.multiplyScalar(dist))
      const desiredDir = hit.sub(center).normalize()
      targetQuat.setFromUnitVectors(cornerVec, desiredDir)
    }

    const onPointerMove = (e: PointerEvent) => {
      updateOrientationFromPointer(e.clientX, e.clientY)
    }
    window.addEventListener('pointermove', onPointerMove)
    // helpers to mutate rotation without index access
    const addAxisRotation = (obj: any, a: Axis, delta: number) => {
      if (a === 'x') obj.rotation.x += delta
      else if (a === 'y') obj.rotation.y += delta
      else obj.rotation.z += delta
    }
    const setAxisRotation = (obj: any, a: Axis, value: number) => {
      if (a === 'x') obj.rotation.x = value
      else if (a === 'y') obj.rotation.y = value
      else obj.rotation.z = value
    }

    renderer.setAnimationLoop(() => {
      const dt = clock.getDelta()

      // Smoothly slerp cube orientation toward the target
      root.quaternion.slerp(targetQuat, Math.min(1, dt * 5))

      nextTurnTime -= dt
      if (!turning && nextTurnTime <= 0) {
        turning = true
        angle = 0
        turnAxis = pick(axes)
        layer = pick([-1, 0, 1] as const)
        dir = Math.random() > 0.5 ? 1 : -1
        attachLayer(turnAxis, layer)
      }

      if (turning) {
        const step = (Math.PI / 2 / turnDuration) * dt * dir
        angle += Math.abs(step)
        addAxisRotation(turnGroup, turnAxis, step)
        if (angle >= Math.PI / 2 - 1e-3) {
          // Snap and finish
          setAxisRotation(turnGroup, turnAxis, (Math.PI / 2) * dir)
          bakeAndUpdateIndices(turnAxis, layer, dir)
          setAxisRotation(turnGroup, turnAxis, 0)
          turning = false
          nextTurnTime = 1.6 + Math.random() * 1.2
        }
      }

      renderer.render(scene, camera)
    })

    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
      frameToView()
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(container)

    return () => {
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      renderer.setAnimationLoop(null)
      renderer.dispose()
      pmrem.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative h-[420px] md:h-[520px] pointer-events-none select-none" />
  )
}
