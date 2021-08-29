import Cookies from 'js-cookie'

export default () => ({
  sidebar: {
    opened: Cookies.get('sidebarStatus')
      ? !!+Cookies.get('sidebarStatus')
      : false,
    withoutAnimation: false
  },
  device: 'desktop'
})
