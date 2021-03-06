export function serialize(obj: any, prefix: string): string {
  const resultingString = []
  let p

  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? prefix + '[' + p + ']' : p
      const v = obj[p]
      resultingString.push(
        v !== null && typeof v === 'object' ? serialize(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v)
      )
    }
  }
  return resultingString.join('&')
}
