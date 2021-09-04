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

  async addQuotes({commit}, quote){
    try {
      await this.$axios.post('/api/config/quotes', { 
        alias : quote.alias,
        name : quote.name,
        open : quote.time[0],
        close : quote.time[1] 
      }) 
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  }, 

  async editLink({commit}, linkData){
    try {
      await this.$axios.patch('/api/config/links/' + linkData.id , {link : linkData.link}) 
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  }, 

  async editQuote({commit}, quoteData){
    try { 
      await this.$axios.patch('/api/config/quotes/' + quoteData.id , {
        alias : quoteData.alias,
        name : quoteData.name,
        open : quoteData.time[0],
        close : quoteData.time[1]
      }) 
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
  },

  async deleteQuote({commit}, id){
    try {
      await this.$axios.delete('/api/config/quotes/' + id) 
    } catch (e) { 
      commit('setError', e, { root: true })
      throw e
    }
  }
  
  
}

export const getters = {
   
}