import { find, findIndex, forEach } from 'lodash'

export const state = () => ({
  list: []
})

export const mutations = {
  set (state, projects) {
    state.list = projects
  },

  add (state, project) {
    state.list.push(project)
  },

  addTask (state, { project, task }) {
    find(state.list, { '@id': project['@id'] }).tasks.push(task['@id'])
  },

  remove (state, project) {
    const id = project.id
    state.list.splice(findIndex(state.list, { id }), 1)
  },

  removeTask (state, { project, task }) {
    const proj = find(state.list, { '@id': project })
    proj.tasks.splice(findIndex(proj.tasks, task['@id']), 1)
  }
}

export const actions = {
  async init ({ state, commit }) {
    if (state.list.length === 0) {
      const data = await this.$axios.$get('/api/projects')
      commit('set', data['hydra:member'])
    }
  },

  async add ({ commit }, name) {
    const data = await this.$axios.$post('/api/projects', { name })

    commit('add', data)

    return data
  },

  addTask ({ dispatch, commit }, payload) {
    commit('addTask', payload)
  },

  async remove ({ commit, dispatch }, project) {
    await this.$axios.$delete(`/api/projects/${project.id}`)

    commit('remove', project)

    forEach(project.tasks, task => commit('tasks/remove', { '@id': task }, { root: true }))
  },

  removeTask ({ commit }, payload) {
    commit('removeTask', payload)
  }
}