import fly from './request'
export default function crud (prefix) {
  var path = prefix
  if (path.indexOf('/') !== 0) {
    path = prefix
  }

  return {
    list: function (params) {
      console.log('api list')
      return fly.get(path, params)
    },
    filter: function (params) {
      console.log('api filter')
      return fly.get(path, { params: params })
    },
    delete: function (id) {
      return fly.delete(path + '/' + id)
    },
    get: function (id) {
      return fly.get(path + '/' + id)
    },
    create: function (domain) {
      return fly.post(path, domain)
    },
    update: function (domain) {
      return fly.put(path + '/' + domain.id, domain)
    }
  }
}
