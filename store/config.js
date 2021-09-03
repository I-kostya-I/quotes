import { async } from "q"

export const state = () => ({ 
})


export const mutations = {

}

export const actions = {
  async getLinks({ commit }) {
    try {
      const links = await this.$axios.get('/api/config?type=links') 
      return links.data.links
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },

  async getQuotes({ commit }) {
    try {
      const quotes = await this.$axios.get('/api/config?type=quotes') 
      return quotes.data.quotes
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },

  async addLink({commit}, link){
    try {
      await this.$axios.post('/api/config/links', {link : link}) 
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },

  async deleteLink({commit}, id){
    try {
      await this.$axios.delete('/api/config/links/' + id) 
    } catch (e) { 
      commit('setError', e, { root: true })
      throw e
    }
  }
  
}

export const getters = {
   
}