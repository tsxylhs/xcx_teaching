import request from './request'

export default function crud (prefix) {
  var path = prefix
  if (path.indexOf('/') !== 0) {
    path = prefix
  }

  return {
    list: function (params) {
      console.log('api filter')
      return request.post(path + '/list', params)
    },
    delete: function (id) {
      return request.delete(path + '/' + id)
    },
    get: function (id) {
      return request.get(path + '/' + id)
    },
    create: function (domain) {
      return request.post(path + '/add', domain)
    },
    update: function (domain) {
      return request.put(path + '/' + domain.id, domain)
    }
  }
}
