import * as types from './mutation-types'
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'

function findIndex (list, currentSong) {
  let index = list.findIndex((item) => {
    return item.id === currentSong.id
  })
  return index
}
export function selectPlay ({commit, state}, {list, index}) {
  if (state.mode === playMode.random) {
    let randomList = shuffle(list).res
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULL_SCREEN, true)
}

export function randomPlay ({commit, state}, {list, index}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, shuffle(list).res)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULL_SCREEN, true)
}

export function insertSong ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let currentSong = playlist[currentIndex]
  let fpIndex = findIndex(playlist, song)
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }
  console.log('zz')
  console.log(currentSong)
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  console.log(currentSIndex)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(currentSIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}

export function deleteSong ({commit, state}, {item, index}) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let deletePIndex = findIndex(playlist, item)
  console.log(playlist)
  console.log(item)
  console.log(index)
  sequenceList.splice(index, 1)
  if (state.mode === playMode.sequence) {
    playlist.splice(index, 1)
    if (currentIndex > index) {
      currentIndex--
    }
  }
  if (state.mode === playMode.random) {
    playlist.splice(deletePIndex, 1)
    if (currentIndex > deletePIndex) {
      currentIndex--
    }
  }
  if (!playlist.length) {
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_PLAYING, false)
  } else {
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_PLAYING, true)
  }
}

export function selectSong ({commit, state}, {item, index}) {
  let playlist = state.playlist.slice()
  if (state.mode === playMode.sequence || state.mode === playMode.loop) {
    commit(types.SET_CURRENT_INDEX, index)
  } else {
    let currentSIndex = findIndex(playlist, item)
    commit(types.SET_CURRENT_INDEX, currentSIndex)
  }
  commit(types.SET_PLAYING, true)
}