import { useSyncExternalStore } from 'use-sync-external-store/shim'
import { useHistory, type History } from './useHistory'

export const useHistorySelector = <T>(selector: (history: History) => T) => {
  const history = useHistory()
  return useSyncExternalStore(history.listen, () => selector(history))
}
