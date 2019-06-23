export function labelFormatter(value) {
  if (value / 1000 >= 0.1 && value / 10000 < 1) {
    return value / 1000 + 'k'
  } else if (value / 10000 >= 1) {
    return value / 10000 + 'w'
  }
  return value
}
