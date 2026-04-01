// ─── File System Access API wrapper ──────────────────────────────────────────
// Lets the app save files directly to a user-chosen folder on disk.
// The folder handle is persisted in IndexedDB so the user only has to pick once.
// Permission may need to be re-granted on each browser session (Chrome/Edge only).

// ─── Type declarations (not in standard TS lib) ───────────────────────────────

interface FSDirectoryHandle {
  readonly name: string;
  getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FSDirectoryHandle>;
  getFileHandle(name: string, options?: { create?: boolean }): Promise<FSFileHandle>;
  queryPermission(descriptor: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
  requestPermission(descriptor: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
}

interface FSFileHandle {
  createWritable(): Promise<FSWritableStream>;
}

interface FSWritableStream {
  write(data: Blob | BufferSource | string): Promise<void>;
  close(): Promise<void>;
}

declare global {
  interface Window {
    showDirectoryPicker?(options?: {
      id?: string;
      mode?: 'read' | 'readwrite';
      startIn?: string;
    }): Promise<FSDirectoryHandle>;
  }
}

// ─── Module state ─────────────────────────────────────────────────────────────

let currentHandle: FSDirectoryHandle | null = null;

// ─── IndexedDB helpers ────────────────────────────────────────────────────────

const IDB_NAME  = 'resumeos_filesystem';
const IDB_STORE = 'handles';
const IDB_KEY   = 'save_folder';

function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror  = () => reject(req.error);
  });
}

async function storeHandle(handle: FSDirectoryHandle): Promise<void> {
  try {
    const db = await openIDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(handle, IDB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror    = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('Could not persist directory handle:', e);
  }
}

async function retrieveHandle(): Promise<FSDirectoryHandle | null> {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = () => resolve((req.result as FSDirectoryHandle) ?? null);
      req.onerror   = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Returns true if the File System Access API is available (Chrome / Edge). */
export function isFSAccessSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function';
}

/** Returns the name of the currently active save folder, or null. */
export function getCurrentFolderName(): string | null {
  return currentHandle?.name ?? null;
}

/**
 * Opens the OS folder picker. Stores the handle for the session (and in IDB
 * for future sessions). Returns the chosen folder name, or null if cancelled.
 */
export async function pickSaveFolder(): Promise<string | null> {
  if (!isFSAccessSupported()) return null;
  try {
    const handle = await window.showDirectoryPicker!({ mode: 'readwrite' });
    currentHandle = handle;
    await storeHandle(handle);
    return handle.name;
  } catch (err) {
    if ((err as Error).name === 'AbortError') return null;
    throw err;
  }
}

/**
 * Tries to restore the previously chosen folder from IndexedDB.
 * Returns the folder name if permission is already granted, otherwise null.
 * Call this on app start so "Mark as Applied" works without re-picking.
 */
export async function restoreSaveFolder(): Promise<string | null> {
  if (!isFSAccessSupported()) return null;
  try {
    const handle = await retrieveHandle();
    if (!handle) return null;
    const perm = await handle.queryPermission({ mode: 'readwrite' });
    if (perm === 'granted') {
      currentHandle = handle;
      return handle.name;
    }
    // Try requesting (may auto-grant without a prompt in trusted contexts)
    const req = await handle.requestPermission({ mode: 'readwrite' });
    if (req === 'granted') {
      currentHandle = handle;
      return handle.name;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Saves files into a subfolder named `{Company}_{Role}` inside the save folder.
 * Creates the subfolder if it doesn't exist.
 * Returns true on success, false if no folder is configured or save fails.
 */
export async function saveApplicationFiles(
  company: string,
  roleName: string,
  files: { name: string; blob: Blob }[],
): Promise<boolean> {
  // Lazy restore in case page was refreshed
  if (!currentHandle) {
    await restoreSaveFolder();
    if (!currentHandle) return false;
  }

  try {
    const folderName = `${company}_${roleName}`
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 80) || 'Application';

    const subDir = await currentHandle.getDirectoryHandle(folderName, { create: true });

    for (const { name, blob } of files) {
      const fh       = await subDir.getFileHandle(name, { create: true });
      const writable = await fh.createWritable();
      await writable.write(blob);
      await writable.close();
    }
    return true;
  } catch (err) {
    console.error('saveApplicationFiles failed:', err);
    return false;
  }
}
