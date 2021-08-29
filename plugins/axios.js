export default function({$axios, store, redirect}){

    $axios.interceptors.request.use(request =>{ 
        const token = store.getters['auth/token']
        request.headers.common['Authorization'] = `Bearer ${token}`

        return request
    })
  
    $axios.onError(error => {
        if(error.response){ 
            // console.log(error.response)
        }
    })
}