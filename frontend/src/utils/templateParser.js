/**
 * Parses markdown text for bracketed placeholders like [Party Name] or [Effective Date].
 * Returns an array of structured field objects.
 */
export function parseFields(markdown) {
  if (!markdown) return [];

  // Match anything inside square brackets, e.g., [Fill in state], [Today's date]
  const regex = /\[([^\]]+)\]/g;
  const matches = [...markdown.matchAll(regex)];

  const fieldsMap = new Map();

  matches.forEach(match => {
    const fullPlaceholder = match[0]; // e.g. "[Effective Date]"
    let label = match[1].trim(); // e.g. "Effective Date"

    // Ignore small brackets like [x] or [ ] used for checkboxes
    if (label.toLowerCase() === 'x' || label === '') return;

    // Deduplicate fields using the exact placeholder text as ID
    const id = fullPlaceholder;

    if (!fieldsMap.has(id)) {
      let type = 'text';
      const lowerLabel = label.toLowerCase();
      
      // Infer type
      if (lowerLabel.includes('date')) {
        type = 'date';
      } else if (lowerLabel.includes('year') || lowerLabel.includes('month') || lowerLabel.includes('day')) {
        type = 'text'; // duration or length of time
      }

      fieldsMap.set(id, {
        id,
        label,
        type,
        placeholder: fullPlaceholder,
        value: null
      });
    }
  });

  return Array.from(fieldsMap.values());
}
