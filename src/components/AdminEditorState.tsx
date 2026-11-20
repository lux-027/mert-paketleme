"use client";

import { createContext } from "react";

export type EditorState = {
  footer: HTMLDivElement | null;
  overlay: HTMLDivElement | null;
  photoJobs: number;
  setBusy: (busy: boolean) => void;
  markDirty: () => void;
  markClean: () => void;
  beginPhotoTask: () => () => void;
};

export const AdminEditorState = createContext<EditorState | null>(null);
