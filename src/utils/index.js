function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function GetDateStr (AddDayCount) {
  var dd = new Date()
  dd.setDate(dd.getDate() + AddDayCount)
  var y = dd.getFullYear()
  var m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1)
  var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()
  const hour = dd.getHours()
  const minute = dd.getMinutes()
  const second = dd.getSeconds()
  const t2 = [hour, minute, second].map(formatNumber).join(':')
  var t1 = y + '/' + m + '/' + d
  return `${t1} ${t2}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

function orderStatus (status) {
  let sdc = ''
  switch (status) {
    case 'paying':
      sdc = '待付款'
      break
    case 'cancel':
      sdc = '已取消'
      break
    case 'sending':
      sdc = '待发货'
      break
    case 'waiting':
      sdc = '待收货'
      break
    case 'finished':
      sdc = '已完成'
      break
  }
  return sdc
}

export default {
  formatNumber,
  formatTime,
  orderStatus,
  GetDateStr
}
