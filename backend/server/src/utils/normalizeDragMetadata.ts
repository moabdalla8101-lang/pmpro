/**
 * Canonical drag-and-match metadata: opaque IDs + labels for UI,
 * correctMatches keyed by IDs for grading (never expose to learners).
 */

export type DragItem = { id: string; label: string };

export type NormalizedDragMetadata = {
  leftItems: DragItem[];
  rightItems: DragItem[];
  /** leftId -> rightId */
  correctMatches: Record<string, string>;
  usable: boolean;
};

function parseJsonField(value: any): any {
  if (value == null) return null;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
}

function itemLabel(raw: any): string | null {
  if (raw == null) return null;
  if (typeof raw === 'string' || typeof raw === 'number') return String(raw);
  if (typeof raw === 'object') {
    const label = raw.text ?? raw.label ?? raw.name ?? raw.left_item ?? raw.right_item;
    if (label != null) return String(label);
  }
  return null;
}

function leftIdFromRaw(raw: any, index: number): string {
  if (raw != null && typeof raw === 'object') {
    if (raw.letter != null) return String(raw.letter);
    if (raw.id != null) return String(raw.id);
  }
  if (typeof raw === 'string' || typeof raw === 'number') {
    return `L:${String(raw)}`;
  }
  return `L${index}`;
}

function rightIdFromRaw(raw: any, index: number): string {
  if (raw != null && typeof raw === 'object') {
    if (raw.index != null) return String(raw.index);
    if (raw.id != null) return String(raw.id);
    if (raw.letter != null) return String(raw.letter);
  }
  if (typeof raw === 'string' || typeof raw === 'number') {
    return `R:${String(raw)}`;
  }
  return `R${index}`;
}

function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/**
 * Normalize every real-bank drag shape into {id,label} lists + ID-keyed matches.
 */
export function normalizeDragMetadata(metadata: any): NormalizedDragMetadata {
  const parsed = parseJsonField(metadata);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { leftItems: [], rightItems: [], correctMatches: {}, usable: false };
  }

  const rawLeft: any[] = parsed.leftItems || parsed.left_items || [];
  const rawRight: any[] = parsed.rightItems || parsed.right_items || [];
  const pairs: any[] = parsed.dragDropPairs || parsed.drag_drop_pairs || [];

  let leftItems: DragItem[] = [];
  let rightItems: DragItem[] = [];

  if (Array.isArray(rawLeft) && rawLeft.length > 0) {
    leftItems = rawLeft
      .map((raw, i) => {
        const label = itemLabel(raw);
        if (!label) return null;
        return { id: leftIdFromRaw(raw, i), label };
      })
      .filter(Boolean) as DragItem[];
  }

  if (Array.isArray(rawRight) && rawRight.length > 0) {
    rightItems = rawRight
      .map((raw, i) => {
        const label = itemLabel(raw);
        if (!label) return null;
        return { id: rightIdFromRaw(raw, i), label };
      })
      .filter(Boolean) as DragItem[];
  }

  // Build from pairs when lists are missing
  if (leftItems.length === 0 && Array.isArray(pairs) && pairs.length > 0) {
    leftItems = pairs
      .map((pair, i) => {
        const label = itemLabel(pair?.left_item ?? pair?.left ?? pair?.leftItem);
        if (!label) return null;
        return { id: `L${i}`, label };
      })
      .filter(Boolean) as DragItem[];
    rightItems = pairs
      .map((pair, i) => {
        const label = itemLabel(pair?.right_item ?? pair?.right ?? pair?.rightItem);
        if (!label) return null;
        return { id: `R${i}`, label };
      })
      .filter(Boolean) as DragItem[];
  }

  const leftByLabel = new Map(leftItems.map((i) => [i.label, i.id]));
  const rightByLabel = new Map(rightItems.map((i) => [i.label, i.id]));
  const leftIds = new Set(leftItems.map((i) => i.id));
  const rightIds = new Set(rightItems.map((i) => i.id));

  const rawMatches: Record<string, any> =
    parsed.matches || parsed.correctMatches || parsed.correct_matches || {};

  const correctMatches: Record<string, string> = {};

  for (const [rawLeftKey, rawRightVal] of Object.entries(rawMatches)) {
    const leftKey = String(rawLeftKey);
    const rightKey = String(rawRightVal);

    let leftId = leftIds.has(leftKey)
      ? leftKey
      : leftByLabel.get(leftKey) || null;
    let rightId = rightIds.has(rightKey)
      ? rightKey
      : rightByLabel.get(rightKey) || null;

    // Letter/index style already uses ids
    if (!leftId && leftIds.has(leftKey)) leftId = leftKey;
    if (!rightId && rightIds.has(rightKey)) rightId = rightKey;

    if (leftId && rightId) {
      correctMatches[leftId] = rightId;
    }
  }

  if (Object.keys(correctMatches).length === 0 && Array.isArray(pairs) && pairs.length > 0) {
    pairs.forEach((pair, i) => {
      const leftLabel = itemLabel(pair?.left_item ?? pair?.left ?? pair?.leftItem);
      const rightLabel = itemLabel(pair?.right_item ?? pair?.right ?? pair?.rightItem);
      if (!leftLabel || !rightLabel) return;
      const leftId = leftByLabel.get(leftLabel) || `L${i}`;
      const rightId = rightByLabel.get(rightLabel) || `R${i}`;
      correctMatches[leftId] = rightId;
    });
  }

  const usable =
    leftItems.length > 0 &&
    rightItems.length > 0 &&
    Object.keys(correctMatches).length > 0 &&
    Object.keys(correctMatches).length === leftItems.length;

  return { leftItems, rightItems, correctMatches, usable };
}

export function learnerDragPromptFromMetadata(metadata: any): {
  leftItems: DragItem[];
  rightItems: DragItem[];
  usable: boolean;
} {
  const normalized = normalizeDragMetadata(metadata);
  if (!normalized.usable) {
    return { leftItems: [], rightItems: [], usable: false };
  }
  return {
    leftItems: shuffleInPlace([...normalized.leftItems]),
    rightItems: shuffleInPlace([...normalized.rightItems]),
    usable: true,
  };
}
