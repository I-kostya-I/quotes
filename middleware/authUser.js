export default ({ store, redirect, route }) => {
  if (store.getters["auth/isAuth"]) {
    redirect('/admin')
  }
}
