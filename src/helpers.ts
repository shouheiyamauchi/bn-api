export const asyncForEach = async <T>(
  array: T[],
  cb: (item: T) => Promise<void>
) => {
  for (const item of array) {
    await cb(item)
  }
}

export const removeDuplicateItems = (items: string | string[]) => {
  const itemKeys: { [key: string]: boolean } = {}
  if (Array.isArray(items)) {
    items.forEach((item) => (itemKeys[item] = true))
  } else {
    itemKeys[items] = true
  }

  return Object.keys(itemKeys)
}
