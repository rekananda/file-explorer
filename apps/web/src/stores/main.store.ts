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
    }
  },
});

