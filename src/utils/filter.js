
function formatRichText (html) {
  // 去掉img标签里的style、width、height属性
  let newContent = html.replace(/<img[^>]*>/gi, function (content) {
    content = content.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '')
    content = content.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '')
    content = content.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '')
    return content
  })
  // 修改所有style里的width属性为max-width:100%
  newContent = newContent.replace(/style="[^"]+"/gi, function (content) {
    content = content.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;')
    return content
  })
  // 去掉<br/>标签
  newContent = newContent.replace(/<br[^>]*\/>/gi, '')
  // img标签添加style属性：max-width:100%;height:auto
  newContent = newContent.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"')
  return newContent
}

module.exports = {
  formatRichText
}
