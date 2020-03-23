import crud from './builder'
import fly from './request'

var API = {}

API.library = crud('/v1/library')
API.books = crud('/v1/book')
API.table = crud('/v1/table')
API.message = crud('v1/message')
API.notes = crud('v1/notes')
API.cabinet = crud('v1/cabinet')
API.mybooks = crud('v1/mybooks')
API.categories = crud('/v1/categories')
API.items = crud('/v1/items')
API.user = crud('/v1/user')
API.address = crud('/v1/address')
API.supplier = crud('/v1/supplier')
API.orderProcess = crud('/v1/process')
API.shop = crud('/v1/shop')
API.headerImage = crud('/v1/headerImages')
API.bdshop = crud('v1/shop')
API.queueup = crud('/v1/queueup')
API.apply = crud('v1/apply')
API.login = function (param) {
  return fly.post('/v1/user/login', param)
}
API.books.updatebooks = function (param) {
  return fly.post('/v1/book/update', param)
}
API.books.applylibrary = function (id) {
  return fly.get('/v1/applylibrary/' + id)
}

API.user.update = function (params) {
  return fly.put('/v1/user', params)
}

API.address.checked = function (params) {
  return fly.put('/v1/address/:id/checked', params)
}

export default API
