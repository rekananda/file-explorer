import config from '@/config';
import type { ApiReturn } from '@core';
import type { FolderDetailT, FolderTreeT } from '@database';
import axios, { type AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import type { MainStore } from './type';

export const useMainStore = defineStore('main', {
  state: (): MainStore => ({
    currentFolder: null,
    displayFolder: {
      folders: [],
      files: [],
    },
    folderTree: [],
    path: "/",
  }),
  actions: {
    async fetchFolderTree() {
      const response: AxiosResponse<ApiReturn<FolderTreeT[]>> = await axios.get(`${config.apiUrl}folder/tree`);
      this.folderTree = response.data.data;
    },
    async fetchDisplayFolder(id?: string) {
      const response:AxiosResponse<ApiReturn<FolderDetailT>> = await axios.get(`${config.apiUrl}folder/${id??""}`);
      this.currentFolder = response.data.data.folder;
      this.displayFolder.folders = response.data.data.folders;
      this.displayFolder.files = response.data.data.files;
      this.path = response.data.data.path;
    },
    async postCreate(type: "folder"|"file", name: string) {
      const payload = {
        name,
        ...(this.currentFolder ? { [type === "folder" ? "parentId" : "folderId"]: this.currentFolder.id } : {})
      };
    
      try {
        const url = `${config.apiUrl}${type}${type === "file" ? "/text" : ""}`;
    
        const response: AxiosResponse<ApiReturn<FolderDetailT>> = await axios.post(url, payload);
        if (response.data.status == 200) {
          await this.fetchDisplayFolder(this.currentFolder?this.currentFolder.id:undefined);

          if (type === "folder") {
            await this.fetchFolderTree();
          }
        } else {
          console.error("API response was not successful:", response.data);
        }
      } catch (error) {
        console.error("Error creating item:", error);
      }
    },
    async deleteItem(type: "folder"|"file", id: string) {
      const response: AxiosResponse<ApiReturn<FolderDetailT>> = await axios.delete(`${config.apiUrl}${type}`, {data: {id: [id]}});
      if (response.data.status == 200) {
        await this.fetchDisplayFolder(this.currentFolder?this.currentFolder.id:undefined);
        if (type === "folder") {
          await this.fetchFolderTree();
        }
      }
    }
  },
});

