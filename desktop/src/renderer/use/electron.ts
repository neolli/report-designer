import type {ExposedInMainWorld} from '../../preload'

export function useElectron(): ExposedInMainWorld {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).electron as ExposedInMainWorld
}

export function useHandle(callback) {
  let electron = useElectron()
  electron.handle(callback)
  electron.preloadReady()
}
