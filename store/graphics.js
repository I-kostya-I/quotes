export const state = () => ({ 
})


export const mutations = {

}

export const actions = {
  async getQuotesData({ commit }, data) {
    try {
      const quotes = await this.$axios.post('/api/quotes/load', data)  
      return quotes.data 
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  },
  
  async loadNewPoint({ commit }, data) {
    try {
      const quotes = await this.$axios.post('/api/quotes/load', data)  
      return quotes.data 
    } catch (e) {
      commit('setError', e, { root: true })
      throw e
    }
  }
  
}

export const getters = {
   
}