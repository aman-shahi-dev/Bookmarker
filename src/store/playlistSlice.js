import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { playlistService } from "../services/appwrite/databases";
import axios from "axios";
import { config } from "../config/config";
import { extractPlaylistId } from "../services/youtube";

const initialState = {
  userPlaylists: [], // holds playlists fetched from appwrite
  activeVideos: [], // holds videos fetched from youtube
  loading: false,
  error: null,
};

export const generateAndSavePlaylist = createAsyncThunk(
  "playlists/generate",
  async ({ url, userId }) => {
    const playlistId = extractPlaylistId(url);
    const API_KEY = config.youtube_api_key;

    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`,
    );

    const title = response.data.items[0].snippet.title;
    const thumbnails = response.data.items[0].snippet.thumbnails;
    const thumbnail = (
      thumbnails.maxres ||
      thumbnails.high ||
      thumbnails.medium ||
      thumbnails.default
    ).url;
    const description = response.data.items[0].snippet.description;

    const result = await playlistService.savePlaylist({
      playlistId,
      userId,
      title,
      thumbnail,
      description,
    });

    return result;
  },
);

export const fetchUserPlaylists = createAsyncThunk(
  "playlists/fetchUserPlaylists",
  async (userId) => {
    const response = await playlistService.getUserPlaylists(userId);
    return response.documents;
  },
);

export const fetchPlaylistVideos = createAsyncThunk(
  "playlists/fetchPlaylistVideos",
  async (playlistId, { rejectWithValue }) => {
    try {
      const API_KEY = config.youtube_api_key;
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`,
      );
      return response.data.items;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const playlistSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    resetActivePlaylist: (state) => {
      state.activeVideos = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAndSavePlaylist.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateAndSavePlaylist.fulfilled, (state, action) => {
        state.userPlaylists.unshift(action.payload);
        state.loading = false;
      })
      .addCase(generateAndSavePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserPlaylists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
        state.userPlaylists = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPlaylistVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlaylistVideos.fulfilled, (state, action) => {
        state.activeVideos = action.payload;
        state.loading = false;
      })
      .addCase(fetchPlaylistVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetActivePlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
