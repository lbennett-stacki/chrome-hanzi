export function capitalize(input, options = {}) {
  const chars = input.split('');

  return options.first
    ? `${chars[0].toUpperCase()}${chars.splice(1).join('')}`
    : input.toUpperCase();
}

export function capitalizeFirst(input, options = {}) {
  return capitalize(input, { ...options, first: true });
}
