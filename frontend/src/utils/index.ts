export const formatTime = (input: string | Date | undefined) => {
  if (!input) return "Invalid date";

  const date = input instanceof Date ? input : new Date(input);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export const getAvatarColor = (name: string) => {
  const colors = [
    'linear-gradient(135deg, #6366f1, #818cf8)',
    'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    'linear-gradient(135deg, #ec4899, #f472b6)',
    'linear-gradient(135deg, #f59e0b, #fbbf24)',
    'linear-gradient(135deg, #10b981, #34d399)',
    'linear-gradient(135deg, #06b6d4, #22d3ee)',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export const generateGroupId = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

