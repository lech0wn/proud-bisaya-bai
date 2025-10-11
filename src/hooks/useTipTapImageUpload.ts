'use client';
import { useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { articlesApi } from '@/lib/api/articles';

export function useTiptapImageUpload(editor: Editor | null) {
  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;

    try {
      // Show loading state in editor
      const { url } = await articlesApi.uploadImage(file);
      
      // Insert image into editor
      editor.chain().focus().setNode('image', { src: url }).run();
      
      return url;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  }, [editor]);

  const handleImageDelete = useCallback(async (url: string) => {
    try {
      // Extract path from URL
      const urlObj = new URL(url);
      const path = urlObj.pathname.split('/').pop();
      
      if (path) {
        await articlesApi.deleteImage(path);
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
      throw error;
    }
  }, []);

  return { handleImageUpload, handleImageDelete };
}